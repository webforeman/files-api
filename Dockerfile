# Specified base image for the build stage
FROM node:20 AS build

# Sets the working directory in the container
WORKDIR /usr/src/app

# Copies the package.json and package-lock.json files to the working directory
COPY package*.json .

# Executes the installation of all dependencies, including development dependencies
RUN npm install

# Copies the entire project to the working directory
COPY . .

# Runs the build script of the project
RUN npm run build

# Specifies the base image for the production stage
FROM node:20 AS production

# Sets the working directory in the container
WORKDIR /usr/src/app

# Copies the package.json and package-lock.json files to the working directory
COPY package*.json .

# Executes the installation of only production dependencies
RUN npm ci --only=production && \
    npm cache clean --force

# Copies the built code from the build stage to the production stage
COPY --from=build /usr/src/app/dist ./dist

# Sets the command that will be executed when the container is run
CMD ["node", "dist/src/index.js"]
