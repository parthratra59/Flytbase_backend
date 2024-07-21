# Flytbase Backend API 🚀

### About the Application

Welcome to the Flytbase Backend API! This repository contains the backend server for the Flytbase project, developed using Node.js, Express, MongoDB, and TypeScript. The server is containerized using Docker and hosted on Render.


## 🚀 Live Deployed Link: https://paymentstepper.netlify.app/


### 🛠️ Tech Stack

1. Node.js: JavaScript runtime built on Chrome's V8 JavaScript engine.

2. Express: Fast, unopinionated, minimalist web framework for Node.js.

3. TypeScript: Typed superset of JavaScript that compiles to plain JavaScript.

4. MongoDB: NoSQL database for storing mission and drone data.

5. Docker: Platform for developing, shipping, and running applications in containers.

6. Render: Render is utilized for backend deployment, providing a reliable and scalable infrastructure to handle application requests efficiently.



## 📚 Features
### Basic Features

1. Use of JWT for API authentication: Ensures secure access to the APIs.

2. API schema and data validation: Validates data to maintain consistency and integrity.

3. Postman collection for API usage: Provides a Postman collection for testing the APIs.

4. Use of MongoDB for data storage: Stores data efficiently using MongoDB.

5. CRUD services for custom categories in a user's account: Allows users to create, read, update, and delete custom categories.
   

### Bonus Features

1. Associating categories to missions: One category can be added to multiple missions, but one mission can only have one category.

2. Retrieve all drones belonging to a particular category: Fetches all drones associated with a specific category.

3. Retrieve all missions belonging to a particular category: Fetches all missions associated with a specific category.

4. Use of TypeScript: Enhances code quality and maintainability.

5. Dockerized application: Simplifies deployment and scaling.

6. Deployed on Render: The application is hosted on Render for easy access.



## 🚀 Getting Started
### Prerequisites
1. Nodejs
2. Docker


## Getting Started Locally 🚀

To run the project locally, follow these steps:

1. Clone the repository:

```bash
https://github.com/parthratra59/stepper.git
```

2. Navigate to the project directory:

```bash
cd <projectdictonary>
```

3. Install the required dependencies for both the frontend and backend.:

```bash
npm install
```

4. Configure your environment variables, including API keys and database connections.

5. Start the project locally (Run the frontend and backend servers):

```bash
# For the frontend
npm run dev

# For the backend
cd stepper_server
npm run dev
```









