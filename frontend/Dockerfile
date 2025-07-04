# Use an official Node.js runtime as a parent image
FROM node:20 as build-stage


ARG REACT_APP_KC_URL
ARG REACT_APP_KC_CLIENT_ID
ARG REACT_APP_KC_REALM
ARG REACT_APP_URL
ARG REACT_APP_BACKEND_URL
# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./
COPY yarn.lock ./


# Install dependencies
RUN yarn install

# Copy the rest of the application code to the working directory
COPY . .

# Build the React app for production
RUN yarn build

FROM nginx:alpine

# Copy the build artifacts from the build stage to NGINX web server
COPY --from=build-stage /app/build/ /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 for the NGINX server
EXPOSE 80
EXPOSE 3006

# Command to start NGINX when the container is run
CMD ["nginx", "-g", "daemon off;"]