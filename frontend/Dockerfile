# Use official Node.js image
FROM node:20

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy all the source code
COPY . .

# Expose the dev server port (e.g., 5173 for Vite, 3000 for React)
EXPOSE 3000

# Command to start the dev server
CMD ["npm", "run", "dev"]
