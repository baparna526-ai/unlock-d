# Stage 1: Build the React application
FROM node:20-alpine AS build

WORKDIR /app

# Install dependencies first (for layer caching)
COPY package*.json ./
RUN npm install

# Copy source code and build
COPY . .
RUN npm run build

# Stage 2: Serve the static files with Nginx
FROM nginx:alpine

# Copy built assets from build stage to nginx folder
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80 (default Nginx port)
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
