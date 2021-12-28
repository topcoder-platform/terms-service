
# Use the base image with Node.js 12.0.0
FROM node:12.22.6

# Copy the current directory into the Docker image
RUN apt-get install -y curl
COPY . /terms-service
# Set working directory for future use
WORKDIR /terms-service

# Install the dependencies from package.json
RUN npm install
CMD npm start