# Product Requirements Document: Course Without Groups Integration

<context>
# Overview
The Coding Giants Course Offer Creator currently fails to display courses that don't have assigned groups. Sales team reported that these courses are missing from the course selection step (Step 3), preventing users from creating offers for certain available courses. This PRD addresses the integration of an additional API endpoint that contains all courses (including those without groups) to ensure complete course availability.

## Problem Statement
The current implementation uses endpoints (`coursesByLocalisation` and `coursesByPostCode`) that filter courses based on location and course kind but exclude courses without assigned groups. This results in incomplete course listings and missed sales opportunities.

**Current Behavior:**
- Step 3 fetches courses from filtered endpoint
- Only courses WITH groups are returned
- Courses WITHOUT groups are invisible to users
- Users cannot create offers for ungrouped courses

**Desired Behavior:**
- Step 3 displays ALL available courses for the selected course kind
- Both grouped and ungrouped courses are visible
- Course list is complete and accurate
- No duplicate courses appear

## Business Impact
- **Sales Loss**: Missing courses = missed revenue opportunities
- **User Experience**: Incomplete listings reduce trust and usability
- **Operational Efficiency**: Sales team workarounds create manual overhead
- **Data Accuracy**: Offers don't reflect actual course availability

# Core Features

## 1. Dual Endpoint Integration
**What it does:**
- Fetches courses from both the existing filtered endpoint AND the comprehensive courses endpoint
- Merges results to provide complete course listings

**Why it's important:**
- Ensures no courses are missed due to grouping status
- Maintains backward compatibility with existing functionality
- Provides redundancy if one endpoint has issues

**How it works:**
- Makes two parallel API calls in Step 3
- Existing: `coursesByLocalisation` or `coursesByPostCode` (filtered, with groups)
- New: `/api/course/courses` (comprehensive, all courses)
- Combines results with intelligent deduplication

## 2. Course Kind Filtering
**What it does:**
- Filters the comprehensive endpoint response based on user's selected course kind
- Maps `selectedCourseKind` values to course type and length criteria

**Why it's important:**
- The comprehensive endpoint returns ~150+ courses across ALL kinds
- Only courses matching the selected kind should be displayed
- Prevents overwhelming users with irrelevant options

**How it works:**
- Applies filtering logic based on course type and length fields
- Mapping table (see Technical Architecture section)
- Extracts courses from nested `preparedCollection` structure

## 3. Intelligent Course Deduplication
**What it does:**
- Prevents duplicate courses from appearing in the selection list
- Uses course ID as the unique identifier

**Why it's important:**
- Courses may exist in both endpoints
- Duplicates confuse users and break the offer generation
- Ensures clean, professional course list

**How it works:**
- Collects course IDs from the primary (filtered) endpoint
- Filters supplementary courses to exclude existing IDs
- Appends only new courses to the list

## 4. Age-Based Course Organization
**What it does:**
- Organizes courses by age groups for easy browsing
- Maintains existing age group structure from filtered endpoint
- Integrates supplementary courses into appropriate age groups

**Why it's important:**
- Age-appropriate course selection is critical for parents
- Maintains familiar user experience
- Professional presentation of course options

**How it works:**
- Preserves age groups from primary endpoint
- Maps supplementary courses to age groups using their `age` field
- Creates or merges into existing age group buckets

# User Experience

## User Personas
**Primary User: Sales Representative**
- Creates course offers for prospective students
- Needs complete course listings to maximize sales
- Expects accurate, up-to-date information
- Time-sensitive (creates multiple offers daily)

**Secondary User: School Administrator**
- Reviews offers before sending to families
- Requires confidence in data accuracy
- Needs consistent formatting and presentation

## Key User Flows

### Flow 1: Normal Course Selection (Happy Path)
1. User selects country (Step 0)
2. User selects course kind "SEMESTER_ONLINE" (Step 1)
3. System fetches courses from both endpoints
4. System displays combined course list grouped by age
5. User selects desired courses
6. User proceeds to offer generation (Step 4)

**Success Criteria:**
- All available courses appear
- No duplicates
- Load time < 3 seconds
- Age groups properly formatted

### Flow 2: Course Selection with Ungrouped Courses
1. User selects course kind with ungrouped courses
2. System fetches and merges from both endpoints
3. Previously invisible courses now appear
4. User successfully selects previously unavailable course
5. Offer generates correctly with new course

**Success Criteria:**
- Ungrouped courses visible
- Properly integrated into age groups
- No visual distinction (seamless integration)

### Flow 3: Error Handling
1. User selects course kind
2. Primary endpoint fails OR returns empty
3. System falls back to comprehensive endpoint only
4. User sees all available courses
5. Warning logged (for monitoring)

**Success Criteria:**
- Graceful degradation
- User unaware of backend issues
- No broken UI states

## UI/UX Considerations
- **No Visual Changes**: Existing UI remains unchanged
- **Loading State**: Existing loader covers both API calls
- **Performance**: Parallel requests prevent slowdown
- **Error States**: Maintain existing error handling UX
- **Accessibility**: No impact on screen readers or keyboard navigation
</context>

<PRD>
# Technical Architecture

## System Components

### 1. SelectCourse Component (Modified)
**Location:** `src/OfferCreationForm/Steps/SelectCourse.tsx`

**Current State:**
```typescript
useEffect(() => {
  fetch(`${baseApiUrl}giganciprogramowaniaformularz.edu.pl/api/Course/${endpoint}/${courseKind}/${location}`)
    .then(response => response.json())
    .then(data => {
      // Process preparedCollection grouped by age
      // Transform to flat course list
      setListOfCourses(transformedCourses);
    });
}, [dependencies]);
```

**New State:**
```typescript
useEffect(() => {
  // Parallel API calls
  Promise.all([
    fetchPrimaryEndpoint(),    // Existing filtered endpoint
    fetchComprehensiveEndpoint() // New comprehensive endpoint
  ])
    .then([primaryData, comprehensiveData]) => {
      const primaryCourses = transformPrimaryResponse(primaryData);
      const filteredSupplementary = filterAndTransformComprehensive(comprehensiveData, selectedCourseKind);
      const mergedCourses = deduplicateAndMerge(primaryCourses, filteredSupplementary);
      setListOfCourses(mergedCourses);
    })
    .catch(error => {
      // Graceful degradation logic
    });
}, [dependencies]);
```

### 2. New Utility Functions

#### `fetchComprehensiveEndpoint()`
**Purpose:** Fetch all courses from comprehensive endpoint
**Input:** Headers (currentCountry, currentLanguage)
**Output:** Promise<ComprehensiveCoursesResponse>
**Endpoint:** `${baseApiUrl}crm.giganciprogramowania.edu.pl/api/course/courses`

#### `filterCoursesByKind(courses, selectedCourseKind)`
**Purpose:** Filter comprehensive courses by selected kind
**Input:**
- courses: Course[] (from comprehensive endpoint)
- selectedCourseKind: string (e.g., "SEMESTER_ONLINE")

**Output:** Course[] (filtered list)

**Filtering Logic:**
```typescript
const COURSE_KIND_FILTERS = {
  'SEMESTER_ONLINE': (course) =>
    course.courseLength === 'FULL_SEMESTER' && course.courseType === 'OnlineCourse',

  'SEMESTER_STATIONARY': (course) =>
    course.courseLength === 'FULL_SEMESTER' && course.courseType === 'ProgrammingCourse',

  'MATH_ONLINE_8TH_GRADE': (course) =>
    course.courseType === 'MathOnlineCourse',

  'MATH_STATIONARY_8TH_GRADE': (course) =>
    course.courseType === 'MathCourse',

  'GRAPHIC_ONLINE_FULL_SEMESTER': (course) =>
    course.courseType === 'GraphicOnlineCourse' && course.courseLength === 'FULL_SEMESTER',

  'GRAPHIC_STATIONARY_FULL_SEMESTER': (course) =>
    course.courseType === 'GraphicCourse' && course.courseLength === 'FULL_SEMESTER',

  'SHORT_ONLINE': (course) =>
    course.courseLength === 'SHORT' && course.courseType.includes('Online'),

  'DEMO_STATIONARY_CWG': (course) =>
    course.courseType === 'DemonstrationProgrammingCourse',

  'DEMO_DIAGNOSTIC_ONLINE_LESSON': (course) =>
    course.courseType === 'DemonstrationLesson1On1Online'
};
```

#### `transformComprehensiveCourses(data)`
**Purpose:** Transform nested comprehensive response to flat course list
**Input:** ComprehensiveCoursesResponse (nested by kindName)
**Output:** Course[] (flat array with age property on each course)

**Transformation:**
```typescript
// Comprehensive endpoint structure:
// preparedCollection[{kindName, courses[{id, name, age, ...}]}]
//
// Transform to:
// [{id, name, age, courseType, courseLength, registrationType, ...}]
```

#### `deduplicateCourses(primaryCourses, supplementaryCourses)`
**Purpose:** Merge course lists without duplicates
**Input:**
- primaryCourses: Course[] (from filtered endpoint)
- supplementaryCourses: Course[] (from comprehensive endpoint, filtered)

**Output:** Course[] (merged, deduplicated)

**Logic:**
```typescript
const primaryIds = new Set(primaryCourses.map(c => c.value)); // course.id mapped to value
const uniqueSupplementary = supplementaryCourses.filter(c => !primaryIds.has(c.value));
return [...primaryCourses, ...uniqueSupplementary];
```

#### `organizeByAgeGroups(courses)`
**Purpose:** Group courses by age for display (optional enhancement)
**Input:** Course[] (flat list with age property)
**Output:** AgeGroup[] (grouped structure)

**Note:** Current implementation transforms grouped structure to flat list. This function would be for future UI improvements to show age-based sections.

## Data Models

### PrimaryEndpointResponse (Current)
```typescript
interface PrimaryCoursesResponse {
  preparedCollection: {
    age: string;              // "Wiek 7-9 lat"
    courses: {
      id: number;
      name: string;
      registrationType: string; // "Registered" | "Interested"
      courseType: string;
      courseLength: string;
      isAvailable: boolean;
      // ... other fields
    }[];
  }[];
  courseCategories: CourseCategory[];
}
```

### ComprehensiveEndpointResponse (New)
```typescript
interface ComprehensiveCoursesResponse {
  preparedCollection: {
    kindName: string;         // "Kursy z AI i programowania"
    kindId: number;
    kindGroups: string[];     // ["PROGRAMMING", "MATH", ...]
    courses: {
      id: number;
      name: string;
      age: string;            // "Wiek 7-9 lat" (on course, not parent)
      courseType: string;     // "OnlineCourse", "ProgrammingCourse", etc.
      courseLength: string;   // "FULL_SEMESTER", "SHORT"
      isAvailable: boolean;
      registrationType?: string; // May not exist in comprehensive endpoint
      // ... other fields
    }[];
  }[];
  courseCategories: CourseCategory[];
}
```

### TransformedCourse (Internal)
```typescript
interface TransformedCourse {
  value: number;              // Course ID
  label: string;              // Display name: "[Interested Only] [Age] Name" or "[Age] Name"
  age?: string;               // Original age string (for future grouping)
  courseType?: string;        // Original courseType (for debugging)
  courseLength?: string;      // Original courseLength (for debugging)
}
```

## APIs and Integrations

### Existing Primary Endpoints (Keep)
**For Stationary Courses:**
```
GET ${n8nProxy}giganciprogramowaniaformularz.edu.pl/api/Course/coursesByLocalisation/${courseKind}/${locationId}
Headers:
  currentCountry: string
  currentLanguage: string
```

**For Online Courses:**
```
GET ${n8nProxy}giganciprogramowaniaformularz.edu.pl/api/Course/coursesByPostCode/${courseKind}/00000
Headers:
  currentCountry: string
  currentLanguage: string
```

### New Comprehensive Endpoint (Add)
```
GET ${n8nProxy}crm.giganciprogramowania.edu.pl/api/course/courses
Headers:
  currentCountry: string (optional - may not filter)
  currentLanguage: string (optional - may not filter)
```

**Response:** ~150+ courses across all kinds, grouped by kindName
**Size:** Moderate (~50-100KB JSON)
**Performance:** Similar to existing endpoints (~500ms-1s)

### n8n Proxy Configuration
**Base URL:** `https://n8n.rostkowski.uk/webhook/b1220a02-273a-4c1a-ac0b-25c9adf3e73b?link=`

**Purpose:** CORS proxy to allow frontend access to external APIs
**Format:** `${baseApiUrl}${targetEndpoint}`

**Note:** Verify n8n configuration supports the new crm subdomain. May need n8n webhook update if domain whitelist exists.

## Infrastructure Requirements

### Frontend Changes
- **Files Modified:** 1 (SelectCourse.tsx)
- **New Files:** 1 optional (courseFilterUtils.ts for utility functions)
- **Dependencies:** No new dependencies required
- **Bundle Size Impact:** +2-3KB (utility functions)

### API Load Impact
- **Additional Requests:** +1 per Step 3 load
- **Request Timing:** Parallel with existing request
- **Total Load Time:** No increase (parallel execution)
- **Caching Opportunity:** Consider caching comprehensive endpoint response (5-10 min TTL)

### Error Handling
**Scenario 1: Primary endpoint fails**
- Fallback: Use comprehensive endpoint only
- User Impact: None (may see more courses)
- Logging: Warn level

**Scenario 2: Comprehensive endpoint fails**
- Fallback: Use primary endpoint only
- User Impact: Ungrouped courses still missing (degraded mode)
- Logging: Warn level

**Scenario 3: Both endpoints fail**
- Fallback: Existing error state (empty course list or error message)
- User Impact: Cannot proceed to Step 4
- Logging: Error level

**Scenario 4: Filtering produces no results**
- Fallback: Show courses from primary endpoint only
- User Impact: Ungrouped courses missing
- Logging: Info level (may indicate new course kind)

### Performance Optimization
1. **Parallel Requests:** Use `Promise.all()` to fetch simultaneously
2. **Response Caching:** Cache comprehensive endpoint (optional, phase 2)
3. **Lazy Filtering:** Only filter comprehensive data if primary is insufficient
4. **Early Return:** If primary endpoint has sufficient courses, optionally skip comprehensive

# Development Roadmap

## Phase 1: MVP - Basic Dual Endpoint Integration
**Goal:** Display all courses including those without groups

### Tasks:
1. **Add comprehensive endpoint fetch**
   - Create new fetch function for `/api/course/courses`
   - Use existing n8n proxy base URL
   - Add same headers as primary endpoint
   - Handle response/error states

2. **Implement course kind filtering**
   - Create `COURSE_KIND_FILTERS` mapping object
   - Implement `filterCoursesByKind()` utility function
   - Unit test each filter condition
   - Verify against known course examples

3. **Transform comprehensive response**
   - Extract courses from nested `preparedCollection` structure
   - Flatten kindName groups to course list
   - Preserve `age`, `courseType`, `courseLength` fields
   - Map to internal `TransformedCourse` format

4. **Implement deduplication logic**
   - Extract course IDs from primary response
   - Filter supplementary courses by ID
   - Merge arrays without duplicates
   - Preserve course order (primary first)

5. **Integrate into SelectCourse component**
   - Modify useEffect to call both endpoints
   - Use `Promise.all()` for parallel execution
   - Apply filtering and deduplication
   - Update state with merged course list

6. **Test with real data**
   - Test each course kind (all 9 variations)
   - Verify no duplicates appear
   - Confirm ungrouped courses now visible
   - Check age labels format correctly

**Acceptance Criteria:**
- All course kinds display complete course lists
- No duplicate courses in selection dropdown
- Ungrouped courses appear with correct age labels
- Existing functionality unchanged (backward compatible)
- Load time ≤ current load time + 500ms

**Estimated Complexity:** Medium
**Estimated Tasks:** 6 development tasks + testing

## Phase 2: Error Handling & Resilience
**Goal:** Graceful degradation and robust error handling

### Tasks:
1. **Implement fallback logic**
   - If primary fails, use comprehensive only
   - If comprehensive fails, use primary only
   - If both fail, show existing error state

2. **Add error logging**
   - Log endpoint failures
   - Log filtering mismatches
   - Log deduplication statistics

3. **Add performance monitoring**
   - Track dual endpoint load time
   - Monitor supplementary course count
   - Alert if filtering returns zero courses

4. **Implement retry logic**
   - Retry failed endpoint once
   - Exponential backoff (optional)
   - Timeout configuration (5s)

**Acceptance Criteria:**
- Component never crashes due to API failures
- Users see courses even if one endpoint fails
- Errors logged for debugging
- Performance metrics available

**Estimated Complexity:** Low-Medium
**Estimated Tasks:** 4 development tasks

## Phase 3: Performance Optimization & Polish
**Goal:** Optimize load times and user experience

### Tasks:
1. **Implement response caching**
   - Cache comprehensive endpoint response (5 min TTL)
   - Use browser sessionStorage or memory cache
   - Invalidate on country/language change

2. **Add loading state improvements**
   - Show progress: "Loading courses..." → "Merging courses..."
   - Display course count after load
   - Add subtle indicator for supplementary courses (optional)

3. **Optimize filtering logic**
   - Memoize filter functions
   - Early exit if comprehensive not needed
   - Benchmark and profile performance

4. **Add admin/debug tools**
   - Dev mode flag to show course source
   - Console logging for course merge stats
   - Comparison view (primary vs comprehensive)

**Acceptance Criteria:**
- Load time reduced by 20%+
- Cache hit rate > 60%
- Smooth, professional loading experience
- Debug tools available for troubleshooting

**Estimated Complexity:** Low
**Estimated Tasks:** 4 enhancement tasks

# Logical Dependency Chain

## Foundation (Build First)
**Priority: CRITICAL**

1. **Data Fetching Infrastructure**
   - Must have: Comprehensive endpoint fetch function
   - Reason: Can't proceed without data source
   - Deliverable: `fetchComprehensiveEndpoint()` function
   - Validation: Can retrieve and parse response

2. **Course Kind Filter Mapping**
   - Must have: Complete filter mapping for all 9 course kinds
   - Reason: Incorrect filtering breaks course selection
   - Deliverable: `COURSE_KIND_FILTERS` object + unit tests
   - Validation: Each filter tested against sample courses

3. **Response Transformation**
   - Must have: Transform nested comprehensive response to flat list
   - Reason: Different structure than primary endpoint
   - Deliverable: `transformComprehensiveCourses()` function
   - Validation: Output matches internal course format

## Core Functionality (Build Second)
**Priority: HIGH**

4. **Deduplication Logic**
   - Must have: Remove duplicate courses by ID
   - Depends on: #1 (data fetching), #3 (transformation)
   - Deliverable: `deduplicateCourses()` function
   - Validation: No duplicates in output, correct merge order

5. **Component Integration**
   - Must have: Integrate dual endpoint logic into SelectCourse
   - Depends on: #1, #2, #3, #4 (all core utilities)
   - Deliverable: Modified `SelectCourse.tsx` with parallel fetching
   - Validation: Component renders merged course list

6. **Label Formatting**
   - Must have: Preserve existing label format `[Age] CourseName`
   - Depends on: #3 (transformation provides age field)
   - Deliverable: Updated label generation logic
   - Validation: Labels match existing format

## Getting to Usable Frontend (Build Third)
**Priority: MEDIUM**

7. **Basic Error Handling**
   - Must have: Component doesn't crash on API failures
   - Depends on: #5 (component integration)
   - Deliverable: Try-catch blocks, error states
   - Validation: Graceful degradation on failures

8. **Loading States**
   - Nice to have: Show appropriate loading indicator
   - Depends on: #5 (component integration)
   - Deliverable: Loading state for dual endpoint fetch
   - Validation: Existing loader covers new fetch time

9. **Manual Testing Suite**
   - Must have: Test each course kind manually
   - Depends on: #5 (component integration)
   - Deliverable: Testing checklist + results
   - Validation: All course kinds work correctly

## Polish & Reliability (Build Fourth)
**Priority: LOW**

10. **Comprehensive Error Handling**
    - Nice to have: Fallback logic for each endpoint
    - Depends on: #7 (basic error handling)
    - Deliverable: Fallback strategies + logging
    - Validation: Works with either endpoint down

11. **Performance Optimization**
    - Nice to have: Response caching, optimized filtering
    - Depends on: #5 (component integration)
    - Deliverable: Cache implementation, performance metrics
    - Validation: Load time reduced, cache functional

12. **Cypress E2E Tests**
    - Must have: Automated test coverage
    - Depends on: #5 (component integration)
    - Deliverable: New Cypress test specs for merged courses
    - Validation: Tests pass, cover dual endpoint scenarios

## Build Order Summary
```
Phase 1 (MVP - Get to Working Frontend):
  1 → 2 → 3 → 4 → 5 → 6 → 9
  (Fetch → Filter → Transform → Dedupe → Integrate → Format → Test)

Phase 2 (Error Handling):
  7 → 10
  (Basic errors → Comprehensive fallbacks)

Phase 3 (Polish):
  8 → 11 → 12
  (Loading states → Performance → Automated tests)
```

## Atomic Task Scoping

### Task 1: Fetch Function
**Input:** Headers object
**Output:** Promise<ComprehensiveCoursesResponse>
**Can test independently:** Yes (mock endpoint)
**Can be improved later:** Yes (add caching, retry logic)

### Task 2: Filter Mapping
**Input:** Course object + selectedCourseKind
**Output:** Boolean (course matches kind)
**Can test independently:** Yes (unit tests with sample courses)
**Can be improved later:** Yes (add new course kinds, optimize logic)

### Task 3: Transformation
**Input:** Nested comprehensive response
**Output:** Flat course array
**Can test independently:** Yes (unit test with fixture)
**Can be improved later:** Yes (optimize performance, add fields)

### Task 4: Deduplication
**Input:** Two course arrays
**Output:** Merged array without duplicates
**Can test independently:** Yes (unit test)
**Can be improved later:** Yes (add merge strategies, conflict resolution)

### Task 5: Integration
**Input:** Component props
**Output:** Rendered component with merged courses
**Can test independently:** Partially (needs mocked endpoints)
**Can be improved later:** Yes (optimize load order, add caching)

# Risks and Mitigations

## Technical Challenges

### Risk 1: Endpoint Response Structure Changes
**Likelihood:** Medium
**Impact:** High (breaks filtering/transformation)

**Mitigation:**
- Add response validation/type checking
- Graceful fallback to primary endpoint only
- Monitoring/alerts for unexpected response shapes
- Version API responses if possible

### Risk 2: Course Kind Mapping Incomplete
**Likelihood:** Medium
**Impact:** Medium (some courses missing)

**Mitigation:**
- Default fallback filter: show all courses if kind unknown
- Log unmapped course kinds for investigation
- Regular review of new course kinds added
- Add admin tool to preview filtering results

### Risk 3: Performance Degradation
**Likelihood:** Low
**Impact:** Medium (slower Step 3 loading)

**Mitigation:**
- Parallel API calls (already planned)
- Response caching (Phase 3)
- Monitor load times in production
- Optimize filtering algorithm if needed

### Risk 4: n8n Proxy Doesn't Support New Endpoint
**Likelihood:** Low
**Impact:** High (blocks entire feature)

**Mitigation:**
- Test n8n proxy with new endpoint early (first task)
- Have n8n admin contact ready
- Alternative: Direct API call if CORS allows
- Fallback: Request backend team to add ungrouped courses to existing endpoint

### Risk 5: Duplicate Courses Due to ID Mismatches
**Likelihood:** Low
**Impact:** Medium (confusing UX, broken offers)

**Mitigation:**
- Comprehensive unit tests for deduplication
- Manual testing across all course kinds
- Add course ID validation
- Log duplicate detection events

## MVP Definition

**Minimum Viable Product:**
The smallest feature that solves the core problem: displaying all courses including those without groups.

**MVP Scope:**
1. Fetch comprehensive endpoint
2. Filter by selected course kind
3. Transform to internal format
4. Deduplicate by course ID
5. Display merged list to user

**MVP Does NOT Include:**
- Advanced error handling (fallback logic)
- Response caching
- Performance optimizations
- Debug tools
- Comprehensive E2E tests

**MVP Success Criteria:**
- Previously invisible ungrouped courses now appear
- No duplicate courses in list
- Existing functionality unchanged
- Works for all 9 course kinds
- Load time acceptable (< 3 seconds)

**MVP Can Be Built Upon:**
- Error handling added in Phase 2
- Performance optimization in Phase 3
- Testing automation in Phase 3
- Each utility function can be independently improved

**Why This MVP:**
- Solves immediate business problem (missing courses)
- Low risk (falls back to existing behavior on error)
- Testable (can manually verify each course kind)
- Extensible (clear phases for improvement)
- Fast to implement (6 core tasks)

## Resource Constraints

### Development Resources
**Required Skills:**
- TypeScript/React (modify SelectCourse component)
- REST API integration (dual endpoint fetching)
- Array manipulation (filtering, deduplication)
- Testing (Cypress for E2E)

**Time Estimate:**
- Phase 1 (MVP): 2-3 days
- Phase 2 (Error Handling): 1 day
- Phase 3 (Polish): 1-2 days
- **Total: 4-6 days** (single developer)

### Testing Resources
**Required:**
- Access to staging/dev environment
- Sample data for all 9 course kinds
- Ability to verify ungrouped courses exist
- Cypress test environment setup

### Infrastructure Resources
**Required:**
- n8n proxy access (verify endpoint support)
- API endpoint availability (verify crm subdomain accessible)
- No new servers/services needed
- No new dependencies required

### External Dependencies
**Risk: Backend API Changes**
- Dependency: External API structure stability
- Owner: Backend team (external)
- Mitigation: Response validation, defensive parsing

**Risk: n8n Proxy Configuration**
- Dependency: n8n webhook configuration
- Owner: DevOps/infrastructure team
- Mitigation: Test early, have admin contact

# Appendix

## Research Findings

### Endpoint Comparison Analysis

**Primary Endpoint (`coursesByPostCode/coursesByLocalisation`):**
- **Purpose:** Filtered courses by location and course kind
- **Response Time:** ~500-800ms
- **Data Size:** ~20-50KB (10-30 courses typical)
- **Structure:** Grouped by age first
- **Filtering:** Backend applies course kind filter
- **Limitation:** Excludes courses without groups

**Comprehensive Endpoint (`/api/course/courses`):**
- **Purpose:** All available courses across system
- **Response Time:** ~700-1000ms
- **Data Size:** ~50-100KB (~150+ courses)
- **Structure:** Grouped by kind first, courses have age
- **Filtering:** None (all courses returned)
- **Advantage:** Includes courses without groups

### Course Type Analysis
**Observed Course Types:**
- `OnlineCourse` - Standard online semester courses
- `ProgrammingCourse` - Stationary programming courses
- `MathCourse` - Stationary math courses
- `MathOnlineCourse` - Online math courses
- `GraphicCourse` - Stationary graphic design courses
- `GraphicOnlineCourse` - Online graphic design courses
- `DemonstrationLesson1On1Online` - Online trial lessons
- `DemonstrationProgrammingCourse` - Stationary trial lessons

### Course Length Analysis
**Observed Values:**
- `FULL_SEMESTER` - Full semester courses (~5 months)
- `SHORT` - Short courses (holiday/vacation courses)

### Age Group Analysis
**Standard Age Ranges:**
- "Wiek 6-7 lat"
- "Wiek 7-9 lat"
- "Wiek 10-12 lat"
- "Wiek 13-15 lat"
- "Wiek 16-18 lat"

**Finding:** All courses in comprehensive endpoint have age information (no null/missing age fields).

## Technical Specifications

### TypeScript Interfaces

```typescript
// Utility function interfaces
interface CourseKindFilter {
  (course: Course): boolean;
}

interface CourseKindFilters {
  [key: string]: CourseKindFilter;
}

// Response interfaces
interface CourseCategory {
  courseCategoryId: number;
  categoryName: string;
  categoryOrder: number;
}

interface Course {
  id: number;
  name: string;
  age?: string;
  courseType: string;
  courseLength: string;
  isAvailable: boolean;
  registrationType?: string;
  bestseller?: boolean;
  duration?: {
    text: string;
    details: string;
  };
  price?: {
    ammount: string;
    ammountOneTimePayment?: string;
    method: string;
    isoCode: string;
  };
}

interface AgeGroupedCourses {
  age: string;
  courses: Course[];
}

interface KindGroupedCourses {
  kindName: string;
  kindId: number;
  kindGroups: string[];
  courses: Course[];
}

interface PrimaryCoursesResponse {
  preparedCollection: AgeGroupedCourses[];
  courseCategories: CourseCategory[];
}

interface ComprehensiveCoursesResponse {
  preparedCollection: KindGroupedCourses[];
  courseCategories: CourseCategory[];
}

interface TransformedCourse {
  value: number;
  label: string;
  age?: string;
  courseType?: string;
  courseLength?: string;
}
```

### Environment Configuration

**Current:**
```json
{
  "baseApiUrl": "https://n8n.rostkowski.uk/webhook/b1220a02-273a-4c1a-ac0b-25c9adf3e73b?link="
}
```

**No Changes Needed** - Same proxy used for new endpoint.

### API Headers
```typescript
const headers = {
  'currentCountry': props.currentCountryCode,  // e.g., "PL"
  'currentLanguage': props.currentLanguage      // e.g., "pl-PL"
};
```

**Note:** Comprehensive endpoint may not filter by these headers. Testing needed to confirm.

### Error Response Formats
**Expected Error Scenarios:**
1. Network failure (fetch rejected)
2. Non-200 status code
3. Invalid JSON response
4. Missing expected fields (preparedCollection)
5. Empty course list (valid but no data)

**Error Handling Strategy:**
```typescript
try {
  const response = await fetch(endpoint);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  const data = await response.json();
  if (!data.preparedCollection) {
    throw new Error('Invalid response structure');
  }
  return data;
} catch (error) {
  console.error('Endpoint fetch failed:', error);
  return null; // Fallback to other endpoint
}
```

## Testing Specifications

### Manual Testing Checklist
**For Each Course Kind (9 total):**
- [ ] SEMESTER_ONLINE
- [ ] SEMESTER_STATIONARY
- [ ] MATH_ONLINE_8TH_GRADE
- [ ] MATH_STATIONARY_8TH_GRADE
- [ ] GRAPHIC_ONLINE_FULL_SEMESTER
- [ ] GRAPHIC_STATIONARY_FULL_SEMESTER
- [ ] SHORT_ONLINE
- [ ] DEMO_STATIONARY_CWG
- [ ] DEMO_DIAGNOSTIC_ONLINE_LESSON

**Test Steps:**
1. Select Poland (or test country)
2. Select course kind
3. Wait for course list to load
4. Verify no duplicates (compare IDs)
5. Verify age labels formatted correctly
6. Verify previously missing courses now appear
7. Select course and generate offer
8. Verify offer includes course correctly

### Unit Test Specifications

**Test: `filterCoursesByKind()`**
```typescript
describe('filterCoursesByKind', () => {
  it('filters SEMESTER_ONLINE courses correctly', () => {
    const courses = [
      { id: 1, courseType: 'OnlineCourse', courseLength: 'FULL_SEMESTER' },
      { id: 2, courseType: 'ProgrammingCourse', courseLength: 'FULL_SEMESTER' },
      { id: 3, courseType: 'OnlineCourse', courseLength: 'SHORT' }
    ];
    const result = filterCoursesByKind(courses, 'SEMESTER_ONLINE');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(1);
  });

  // Similar tests for all 9 course kinds...
});
```

**Test: `deduplicateCourses()`**
```typescript
describe('deduplicateCourses', () => {
  it('removes duplicate courses by ID', () => {
    const primary = [{ value: 1, label: 'Course A' }];
    const supplementary = [
      { value: 1, label: 'Course A' },
      { value: 2, label: 'Course B' }
    ];
    const result = deduplicateCourses(primary, supplementary);
    expect(result).toHaveLength(2);
    expect(result.map(c => c.value)).toEqual([1, 2]);
  });

  it('preserves course order (primary first)', () => {
    const primary = [{ value: 1 }, { value: 2 }];
    const supplementary = [{ value: 3 }, { value: 4 }];
    const result = deduplicateCourses(primary, supplementary);
    expect(result.map(c => c.value)).toEqual([1, 2, 3, 4]);
  });
});
```

### Cypress E2E Test Specifications

**Test: Dual Endpoint Integration**
```typescript
describe('Course selection with dual endpoints', () => {
  beforeEach(() => {
    cy.visit('/');

    // Intercept primary endpoint
    cy.intercept('GET', '**/coursesByPostCode/**', {
      fixture: 'primaryCourses.json'
    }).as('primaryEndpoint');

    // Intercept comprehensive endpoint
    cy.intercept('GET', '**/course/courses', {
      fixture: 'comprehensiveCourses.json'
    }).as('comprehensiveEndpoint');
  });

  it('displays courses from both endpoints', () => {
    cy.selectCountry('Poland');
    cy.selectCourseKind('SEMESTER_ONLINE');

    // Wait for both endpoints
    cy.wait(['@primaryEndpoint', '@comprehensiveEndpoint']);

    // Verify courses displayed
    cy.get('[data-cy="coursesSelectBox"]').should('be.visible');

    // Verify specific supplementary course appears
    cy.get('[data-cy="coursesSelectBox"]')
      .contains('Previously Missing Course')
      .should('exist');
  });

  it('handles primary endpoint failure gracefully', () => {
    cy.intercept('GET', '**/coursesByPostCode/**', {
      statusCode: 500
    }).as('primaryEndpointFail');

    cy.selectCountry('Poland');
    cy.selectCourseKind('SEMESTER_ONLINE');

    // Should still show courses from comprehensive endpoint
    cy.get('[data-cy="coursesSelectBox"]').should('be.visible');
  });
});
```

## Rollback Plan

### Rollback Trigger Conditions
**Immediate Rollback If:**
1. Duplicate courses appear in production
2. Load time exceeds 5 seconds consistently
3. Course selection breaks for any course kind
4. Offer generation fails due to merged courses
5. >5% error rate in endpoint fetching

### Rollback Procedure
**Step 1: Revert Code Changes**
```bash
git revert <feature-commit-hash>
git push origin main
```

**Step 2: Verify Rollback**
- Test course selection for all kinds
- Verify existing functionality restored
- Check error rates return to normal

**Step 3: Communicate**
- Notify sales team (ungrouped courses missing again)
- Log issue for investigation
- Schedule post-mortem

### Rollback Impact
- **User Impact:** Ungrouped courses become invisible again
- **Business Impact:** Returns to previous state (missing courses)
- **Technical Impact:** Zero (clean revert to previous version)
- **Data Impact:** None (no data modifications)

### Alternative: Feature Flag
**Consider Adding Feature Flag:**
```typescript
const USE_DUAL_ENDPOINT = process.env.REACT_APP_USE_DUAL_ENDPOINT === 'true';

if (USE_DUAL_ENDPOINT) {
  // New dual endpoint logic
} else {
  // Original single endpoint logic
}
```

**Benefits:**
- Instant enable/disable without deployment
- A/B testing capability
- Gradual rollout option
- Easy rollback

**Implementation Complexity:** +1 day

## Success Metrics

### Key Performance Indicators (KPIs)

**Functional Metrics:**
- Course visibility: 100% of available courses displayed
- Duplicate rate: 0 duplicate courses
- Course kind coverage: 9/9 kinds working correctly
- Error rate: <1% endpoint failures

**Performance Metrics:**
- Load time: ≤ current + 500ms
- API response time: <2s for dual fetch
- Cache hit rate: >60% (Phase 3)

**Business Metrics:**
- Offers created for previously missing courses
- Sales team satisfaction rating
- Support tickets related to missing courses

### Monitoring & Alerts

**Application Monitoring:**
```typescript
// Log endpoint performance
console.log('Dual endpoint fetch completed', {
  primaryTime: primaryDuration,
  comprehensiveTime: comprehensiveDuration,
  totalCourses: mergedCourses.length,
  supplementaryCourses: supplementaryCount,
  duplicatesRemoved: duplicateCount
});
```

**Alert Conditions:**
- Both endpoints fail >3 times in 10 minutes
- Load time exceeds 5 seconds
- Zero courses returned after merge
- Filtering returns unexpected course count

## Future Enhancements (Out of Scope)

### UI Improvements
- Visual indicator for supplementary courses (badge/icon)
- Age group section headers in dropdown
- Course count display: "Showing X courses"
- Filter courses by age group

### Performance Enhancements
- Service worker caching
- Lazy load course details on hover
- Prefetch comprehensive endpoint on Step 2

### Data Enhancements
- Course popularity sorting
- Recommended courses highlight
- Recently added courses indicator

### Admin Tools
- Course source comparison view
- Filtering debug mode
- Endpoint health dashboard
- Cache management UI

---

**Document Version:** 1.0
**Last Updated:** 2026-02-10
**Author:** Product Team
**Status:** Draft - Ready for Development
