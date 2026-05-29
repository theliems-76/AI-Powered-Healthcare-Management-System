FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm install --production

# Copy app source code
COPY . .

# Environment variables will be injected via docker-compose
EXPOSE 5000

CMD ["npm", "start"]
