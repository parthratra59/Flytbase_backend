# Flytbase Backend API 🚀

### About the Application

Welcome to the Flytbase Backend API! This repository contains the backend server for the Flytbase project, developed using Node.js, Express, MongoDB, and TypeScript. The server is containerized using Docker and hosted on Render.


## 🚀 Live Deployed Link: https://flytbase-backend.onrender.com/api/v1


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
https://github.com/parthratra59/Flytbase_backend.git
```

2. Navigate to the project directory:

```bash
cd <projectdictonary>
```

3. Install dependencies:

```bash
npm install
```

4. Create a .env file in the root directory and add your MongoDB connection string and other environment variables:

```bash
PORT=3000

MONGODB_URI=mongodb+srv://ratraparth59:1225079@cluster0.9zzvie2.mongodb.net

ACCESS_TOKEN_SECRET=ratraparth59
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=ratraparth79
REFRESH_TOKEN_EXPIRY=10d
```

Although it is not recommended to include .env files in GitHub, the repository is private, so this file has not been deleted.


6. Start the server :

```bash
npm run dev
```
The server will be running on http://localhost:3000.


## Signup Credentials
Here are the credentials to sign up:
{
    "username": "parth ratra",
    "email": "parth79@gmail.com",
    "password": "Waheu@122"
}

## Login Credentials
{
    "email": "parth79@gmail.com",
    "password": "Waheu@122"
}

## Docker 🚀

To run the server using Docker, follow these steps:

1. Pull the Docker image:

```bash
docker pull ratraparth59/flytbase_server
```

2. Run the Docker container:

```bash
docker run -it -p <localmachineport>:3000 ratraparth59/flytbase_server
```
Replace <localmachineport> with the port you want to use on your local machine.


## API Documentation 📚 

### Users
1. POST /users/signup - User signup

2. POST /users/login - User login

3. GET /users/getUserById/:uID - Get a user by their ID

4. POST /users/logout - User logout

5. POST /users/refreshToken - Refresh access token


### Drones
1. POST /drones/addDrone - Add a new drone

2. POST /drones/addSiteToDrone/:dID - Add site to a drone

3. PUT /drones/updateDrone/:dID - Update a drone by its ID

4. GET /drones/getAllDrones - Retrieve all drones

5. DELETE /drones/deleteDrone/:dID - Delete a drone by its ID

6. PUT /drones/moveSiteByID/:dID - Move a drone to a different site by its ID

### Sites
1. POST /sites/createSite - Create a new site

2. GET /sites/getdroneBySiteName - Get drones by the site's name

3. PUT /sites/updateSiteName - Update a site by its name

4. DELETE /sites/deleteSiteByID/:sID - Delete a site by its ID

### Missions
1. POST /missions/addMissions - Add a new mission

2. GET /missions/getMissions/site/:sID - Get missions by site ID with pagination

3. PUT /missions/updateMission/:mID - Update a mission

4. DELETE /missions/deleteMission/:mID - Delete a mission

### Categories
1. POST /categories/addCategory - Add a new category

2. POST /categories/associate_Mission/:categoryID - Associate a mission with a category

3. POST /categories/associate_Drone/:categoryID - Associate a drone with a category

4. PUT /categories/updateCategory/:categoryID - Update a category

5. PUT /categories/changeMissionCategory/:mID - Change the category of a mission

6. PUT /categories/changeDroneCategory/:dID - Change the category of a drone

7. DELETE /categories/delete_Mission_Category/:categoryID - Delete a category from missions

8. DELETE /categories/delete_Drone_Category/:categoryID - Delete a category from drones

9. GET /categories/getMissions_Category/:categoryID - Get missions of a category by category ID

10. GET /categories/getDrones_Category/:categoryID - Get drones of a category by category ID

