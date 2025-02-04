# Use the official Node.js image as the base image
FROM node:20

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./
COPY yarn.lock ./

# Install dependencies
RUN apt-get install openssl
RUN yarn -v
RUN yarn install

# Copy the rest of the application code
COPY . .

RUN npx prisma generate

# Build the NestJS application
RUN yarn run build

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application
#CMD ["ls" , "-la", "/usr/src/app/dist/src"] 
CMD ["node", "dist/src/main"]