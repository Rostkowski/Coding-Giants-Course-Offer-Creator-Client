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

### API Integration
The app fetches data from an external API proxied through n8n webhook (see `src/environment.json`):
- Base URL: `https://n8n.rostkowski.uk/webhook/b1220a02-273a-4c1a-ac0b-25c9adf3e73b?link=`
- Headers: `currentCountry` and `currentLanguage` set based on user selection
- Endpoints used:
  - `/api/Course/coursesByLocalisation` (stationary courses)
  - `/api/Course/coursesByPostCode` (online courses)

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
- `src/environment.json` - API base URL configuration
- `src/models/` - TypeScript interfaces for type safety
- `cypress/e2e/UI/` - E2E test specs
- `cypress/fixtures/` - Test data stubs

## Task Master AI Instructions
**Import Task Master's development workflow commands and guidelines, treat as if import is in the main CLAUDE.md file.**
@./.taskmaster/CLAUDE.md
