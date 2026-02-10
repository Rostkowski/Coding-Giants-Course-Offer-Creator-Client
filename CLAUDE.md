# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React-based client application for creating course offers for Coding Giants (a programming school for children). It guides users through a multi-step wizard to generate customized course offers with location-specific details.

## Development Commands

### Running the Application
```bash
npm start                  # Start development server on http://localhost:3000
npm run start-server       # Alias for npm start
```

### Building
```bash
npm run build              # Production build (outputs to build/)
```

### Testing
```bash
npm test                   # Run Cypress E2E tests (starts dev server + runs tests)
npx cypress open           # Open Cypress Test Runner (interactive mode)
npm run cy:run             # Run Cypress tests in headless mode
```

Note: The test script uses `start-server-and-test` to automatically start the dev server before running Cypress tests.

### Deployment
```bash
npm run build              # Build first
./scripts/deploy.sh        # Deploy to production (copies build/ to /var/www/html/offer-creator)
```

CI/CD runs automatically on pushes to `main` via GitHub Actions (self-hosted runner). The workflow builds with memory optimization: `NODE_OPTIONS="--max-old-space-size=1536"` and `GENERATE_SOURCEMAP=false`.

## Architecture

### State Management Pattern
The app uses a **single container component** (`OfferCreationForm`) that manages all application state via React hooks. State flows down to presentational step components, which communicate back via callback props.

**Key State Variables:**
- `step` (0-4): Controls which step component renders
- `currentLanguage` / `currentCountryCode`: Selected country/language
- `selectedCourseKind`: Course type (SEMESTER_ONLINE, SEMESTER_STATIONARY, etc.)
- `selectedLocation`: For stationary courses, contains location-specific contact details
- `selectedCourse`: Array of selected course objects
- `countryMainContactDetails`: Main contact info for online courses

### Multi-Step Wizard Flow
1. **Step 0**: `SelectCountry` - Choose country (sets language/country code)
2. **Step 1**: `SelectCourseKind` - Choose course type (online vs stationary)
3. **Step 2**: `SelectLocationForStationaryCourse` - Only for stationary courses (auto-skips for online)
4. **Step 3**: `SelectCourse` - Multi-select courses from API
5. **Step 4**: `CourseOffer` - Display generated offer

**Navigation Logic:**
- Online courses skip step 2 (location selection)
- Back button logic at step 3 jumps back 2 steps for online courses
- Selected courses reset when navigating back before step 4

### API Integration - Dual Endpoint Architecture
The app fetches course data from TWO endpoints in parallel to ensure complete course listings (including courses without assigned groups):

**n8n Proxy Configuration:**
- Base URL: `https://n8n.rostkowski.uk/webhook/b1220a02-273a-4c1a-ac0b-25c9adf3e73b?link=`
- Headers: `currentCountry` and `currentLanguage` set based on user selection

**Primary Endpoint (Filtered):**
- `/api/Course/coursesByLocalisation` (stationary courses)
- `/api/Course/coursesByPostCode` (online courses)
- Returns courses WITH groups, filtered by location/kind
- Response structure: `preparedCollection` grouped by age

**Comprehensive Endpoint (All Courses):**
- `/api/course/courses` on `crm.giganciprogramowania.edu.pl` domain
- Returns ALL courses (~150+), including those without groups
- Response structure: `preparedCollection` grouped by kindName
- Client-side filtering by `courseType` and `courseLength`

**Dual Endpoint Flow:**
1. Both endpoints called in parallel using `Promise.all()`
2. Primary response transformed to flat course list (existing logic)
3. Comprehensive response transformed and filtered by selected course kind
4. Results merged and deduplicated by course ID
5. Primary courses take precedence; supplementary courses appended

**Course Kind Filter Mapping:**
- `SEMESTER_ONLINE` → `courseLength === "FULL_SEMESTER"` AND `courseType === "OnlineCourse"`
- `SEMESTER_STATIONARY` → `courseLength === "FULL_SEMESTER"` AND `courseType === "ProgrammingCourse"`
- `MATH_ONLINE_8TH_GRADE` → `courseType === "MathOnlineCourse"`
- `MATH_STATIONARY_8TH_GRADE` → `courseType === "MathCourse"`
- `GRAPHIC_ONLINE_FULL_SEMESTER` → `courseType === "GraphicOnlineCourse"` AND `courseLength === "FULL_SEMESTER"`
- `GRAPHIC_STATIONARY_FULL_SEMESTER` → `courseType === "GraphicCourse"` AND `courseLength === "FULL_SEMESTER"`
- `SHORT_ONLINE` → `courseLength === "SHORT"` AND courseType contains "Online"
- `DEMO_STATIONARY_CWG` → `courseType === "DemonstrationProgrammingCourse"`
- `DEMO_DIAGNOSTIC_ONLINE_LESSON` → `courseType === "DemonstrationLesson1On1Online"`

**Error Handling & Fallback:**
- If primary fails → use comprehensive only (filtered)
- If comprehensive fails → use primary only (original behavior)
- If both fail → show empty state with error logged
- No infinite loaders; graceful degradation always

### Contact Details Logic
Contact information (phone/email) displayed in the final offer depends on course type:
- **Stationary courses**: Use location-specific contact details from `selectedLocation`
- **Online courses**: Use country-level main contact details from `countryMainContactDetails`

### Testing Strategy
Cypress E2E tests focus on the complete user journey:
- Tests intercept API calls with fixture data
- Custom Cypress commands defined in `cypress/support/commands.ts`:
  - `cy.selectCountry()`
  - `cy.selectCourseKind()`
  - `cy.selectCourses()`
  - `cy.hasExactNumberOfCoursesInOffer()`
- Fixtures organized by course type (e.g., `SemesterOnlineCourses/`)

## Key Technologies
- React 18 with TypeScript
- React Bootstrap for UI components
- react-select for multi-select dropdowns
- TinyMCE for rich text editing (in offer display)
- Cypress for E2E testing
- Playwright available but not actively used in npm scripts

## Important Files
- `src/OfferCreationForm/OfferCreationForm.tsx` - Main state container and wizard logic
- `src/OfferCreationForm/Steps/SelectCourse.tsx` - Dual endpoint integration, course selection
- `src/utils/courseFilterUtils.ts` - Course filtering, transformation, deduplication utilities
- `src/models/CourseModels.ts` - TypeScript interfaces for comprehensive endpoint and transformations
- `src/environment.json` - API base URL configuration
- `cypress/e2e/UI/dualEndpointIntegration.cy.ts` - E2E tests for dual endpoint feature
- `cypress/fixtures/comprehensiveCoursesStub.ts` - Test fixture for comprehensive endpoint
- `.taskmaster/docs/MANUAL_TESTING_CHECKLIST.md` - Manual testing guide for all 9 course kinds

## Task Master AI Instructions
**Import Task Master's development workflow commands and guidelines, treat as if import is in the main CLAUDE.md file.**
@./.taskmaster/CLAUDE.md
