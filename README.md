# Coding Giants Course Offer Creator

This is a client-side application for creating course offers for Coding Giants, a programming school for children and teenagers. The application guides the user through a multi-step process to generate a customized course offer.

## Features

*   **Multi-step Offer Creation Form:** A user-friendly, step-by-step form to create course offers.
*   **Country Selection:** The user can select the country for which the offer is being created.
*   **Course Kind Selection:** The user can choose between different kinds of courses, such as semester-long courses, online courses, and stationary courses.
*   **Location-based Offers:** For stationary courses, the user can select a specific location, and the offer will include location-specific contact details.
*   **Course Selection:** The user can select one or more courses to be included in the offer.
*   **Customizable Offer Generation:** The generated offer is based on the user's selections and includes all the relevant details, such as course descriptions, schedules, and contact information.

## Getting Started

### Prerequisites

*   Node.js and npm (or yarn)

### Installation and Running

1.  Clone the repository:
    ```bash
    git clone https://github.com/your-username/Coding-Giants-Course-Offer-Creator-Client.git
    ```
2.  Install the dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm start
    ```
    The application will be available at [http://localhost:3000](http://localhost:3000).

## Running the Tests

This project uses Cypress for end-to-end testing.

To run the tests, use the following command:

```bash
npm test
```

This command will start the development server and then run the Cypress tests in headless mode.

To open the Cypress Test Runner, use the following command:

```bash
npx cypress open
```

## Built With

*   [React](https://reactjs.org/) - The web framework used
*   [TypeScript](https://www.typescriptlang.org/) - Superset of JavaScript
*   [Bootstrap](https://getbootstrap.com/) - CSS framework
*   [TinyMCE](https://www.tiny.cloud/) - Rich text editor
*   [Cypress](https://www.cypress.io/) - End-to-end testing framework
*   [Playwright](https://playwright.dev/) - End-to-end testing framework