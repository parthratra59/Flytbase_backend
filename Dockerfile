# Use the official Node.js image as the base image
FROM node:alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory (source(localmachine)) to (destination(container))
COPY package.json package.json
COPY package-lock.json package-lock.json

# Install dependencies
RUN npm install


# Copy the rest of the application code to the working directory (same source(.) to destination (.))
COPY . .


# Install TypeScript globally
RUN npm install -g typescript


# Compile TypeScript code
RUN tsc

EXPOSE 4000


# Command to run the compiled application in production mode
# This starts the application using the compiled JavaScript code from the dist directory
CMD ["node", "dist/index.js"]
