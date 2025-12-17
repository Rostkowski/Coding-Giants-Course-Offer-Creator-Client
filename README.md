# Coding Giants Course Offer Creator

This is a client-side application for creating course offers for Coding Giants, a programming school for children and teenagers. The application guides the user through a multi-step process to generate a customized course offer.

## Features

*   **Multi-step Offer Creation Form:** A user-friendly, step-by-step form to create course offers.
*   **Country Selection:** The user can select the country for which the offer is being created.
*   **Course Kind Selection:** The user can choose between different kinds of courses, such as semester-long courses, online courses, and stationary courses.
*   **Location-based Offers:** For stationary courses, the user can select a specific location, and the offer will include location-specific contact details.
*   **Course Selection:** The user can select one or more courses to be included in the offer.
*   **Customizable Offer Generation:** The generated offer is based on the user's selections and includes all the relevant details, such as course descriptions, schedules, and contact information.

## Architecture

The application is built with React and follows a component-based architecture.

*   **Component-Based:** The UI is broken down into reusable components, located in the `src/OfferCreationForm/Steps` directory.
*   **Container/Presentational Pattern:** The `OfferCreationForm` component acts as a container component, managing the application's state and logic. The components in the `src/OfferCreationForm/Steps` directory are presentational components, responsible for rendering the UI for each step of the form.
*   **Model Layer:** The `src/models` directory contains data models used in the application, which helps to structure the data and ensure type safety with TypeScript.
*   **Styling:** The application uses Bootstrap for styling, with some custom styles in `src/App.css` and `src/index.css`.

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

## Deployment

The project includes a deployment script at `scripts/deploy.sh`. This script copies the contents of the `build` directory to `/var/www/html/offer-creator`.

To deploy the application, first build the project:

```bash
npm run build
```

Then run the deployment script:

```bash
./scripts/deploy.sh
```

**Note:** You may need to adjust the `destination_dir` variable in the script to match your server's configuration.

## CI/CD

This project uses GitHub Actions for continuous integration and continuous deployment. The workflow is defined in `.github/workflows/deploy-to-production.yml`.

The workflow is triggered on every push to the `main` branch and performs the following steps:

1.  Builds the application.
2.  Runs the tests.
3.  If the build and tests are successful, it deploys the application to production using the `scripts/deploy.sh` script.

## Built With

*   [React](https://reactjs.org/) - The web framework used
*   [TypeScript](https://www.typescriptlang.org/) - Superset of JavaScript
*   [Bootstrap](https://getbootstrap.com/) - CSS framework
*   [TinyMCE](https://www.tiny.cloud/) - Rich text editor
*   [Cypress](https://www.cypress.io/) - End-to-end testing framework
*   [Playwright](https://playwright.dev/) - End-to-end testing framework