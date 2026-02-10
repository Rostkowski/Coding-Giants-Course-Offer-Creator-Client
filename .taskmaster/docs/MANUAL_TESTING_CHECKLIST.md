# Manual Testing Checklist - Dual Endpoint Integration

## Overview
This checklist verifies that the dual endpoint integration correctly displays all courses (including those without groups) for all 9 course kinds.

## Pre-Testing Setup
1. ✅ Start development server: `npm start`
2. ✅ Open browser at http://localhost:3000
3. ✅ Open browser console to monitor endpoint calls and any errors

## Testing Procedure

For each course kind below, follow these steps:
1. Select "Poland" as country
2. Select the specific course kind
3. Verify courses load successfully
4. Check browser console for:
   - Both endpoint calls (primary + comprehensive)
   - No JavaScript errors
   - Deduplication log message (in development mode)
5. Verify courses appear in the dropdown
6. Check that previously missing courses now appear
7. Select one or more courses
8. Click "Generate Offer"
9. Verify offer generates correctly

---

## Course Kinds to Test

### 1. SEMESTER_ONLINE
- [ ] Courses load successfully
- [ ] No duplicate courses in list
- [ ] Console shows both endpoint calls
- [ ] Previously ungrouped courses now visible
- [ ] Filter matches: `courseLength === "FULL_SEMESTER"` AND `courseType === "OnlineCourse"`

**Expected courses:** All semester-long online courses

---

### 2. SEMESTER_STATIONARY
- [ ] Courses load successfully
- [ ] Location selection step appears
- [ ] Select a location
- [ ] Courses for that location appear
- [ ] Filter matches: `courseLength === "FULL_SEMESTER"` AND `courseType === "ProgrammingCourse"`

**Expected courses:** All semester-long stationary programming courses

---

### 3. MATH_ONLINE_8TH_GRADE
- [ ] Courses load successfully
- [ ] Filter matches: `courseType === "MathOnlineCourse"`
- [ ] Math courses appear in dropdown

**Expected courses:** Online math courses

---

### 4. MATH_STATIONARY_8TH_GRADE
- [ ] Courses load successfully
- [ ] Location selection step appears
- [ ] Filter matches: `courseType === "MathCourse"`

**Expected courses:** Stationary math courses

---

### 5. GRAPHIC_ONLINE_FULL_SEMESTER
- [ ] Courses load successfully
- [ ] Filter matches: `courseType === "GraphicOnlineCourse"` AND `courseLength === "FULL_SEMESTER"`

**Expected courses:** Semester-long online graphic design courses

---

### 6. GRAPHIC_STATIONARY_FULL_SEMESTER
- [ ] Courses load successfully
- [ ] Location selection step appears
- [ ] Filter matches: `courseType === "GraphicCourse"` AND `courseLength === "FULL_SEMESTER"`

**Expected courses:** Semester-long stationary graphic courses

---

### 7. SHORT_ONLINE
- [ ] Courses load successfully
- [ ] Filter matches: `courseLength === "SHORT"` AND `courseType.includes("Online")`

**Expected courses:** Short (holiday/vacation) online courses

---

### 8. DEMO_STATIONARY_CWG
- [ ] Courses load successfully
- [ ] Location selection step appears
- [ ] Filter matches: `courseType === "DemonstrationProgrammingCourse"`

**Expected courses:** Demonstration/trial lessons (stationary)

---

### 9. DEMO_DIAGNOSTIC_ONLINE_LESSON
- [ ] Courses load successfully
- [ ] Filter matches: `courseType === "DemonstrationLesson1On1Online"`

**Expected courses:** Individual online trial lessons

---

## Error Handling Tests

### Scenario 1: Normal Operation (Both Endpoints Working)
- [ ] Both endpoints called successfully
- [ ] Courses from both sources appear
- [ ] No duplicate courses
- [ ] Console shows deduplication stats

### Scenario 2: Primary Endpoint Failure
Test by blocking primary endpoint in browser DevTools:
- [ ] Only comprehensive endpoint succeeds
- [ ] Courses still appear (from comprehensive)
- [ ] Console warning logged
- [ ] No JavaScript errors

### Scenario 3: Comprehensive Endpoint Failure
Test by blocking comprehensive endpoint:
- [ ] Only primary endpoint succeeds
- [ ] Courses still appear (from primary)
- [ ] Original behavior maintained
- [ ] Console warning logged

### Scenario 4: Both Endpoints Fail
Test by blocking both endpoints:
- [ ] Empty course list shown
- [ ] No infinite loader
- [ ] Error logged to console
- [ ] "Generate Offer" button disabled

---

## Post-Testing Validation

### Code Quality
- [ ] TypeScript compiles without errors: `npx tsc --noEmit`
- [ ] No console errors in development
- [ ] No console warnings (except expected endpoint failures)

### Cypress Tests
- [ ] Run E2E tests: `npm test`
- [ ] All tests pass
- [ ] New dual endpoint test file passes

### Performance
- [ ] Page load time reasonable (<3 seconds for course list)
- [ ] No noticeable delay compared to previous version
- [ ] Both endpoints load in parallel (check Network tab)

### Documentation
- [ ] CLAUDE.md updated with new architecture
- [ ] README.md mentions dual endpoint feature (if applicable)
- [ ] Code comments added to complex logic

---

## Known Issues / Limitations

Document any issues found during testing:

1. **Issue:** [Description]
   - **Severity:** High/Medium/Low
   - **Workaround:** [If applicable]

2. **Issue:** [Description]
   - **Severity:** High/Medium/Low
   - **Workaround:** [If applicable]

---

## Sign-Off

**Tested By:** ________________
**Date:** ________________
**Version:** ________________

**All tests passed:** ☐ Yes ☐ No
**Ready for deployment:** ☐ Yes ☐ No

**Notes:**
