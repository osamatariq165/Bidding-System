# 1️⃣ Use an official Node image as base
FROM node:18-alpine

# 2️⃣ Set working directory inside the container
WORKDIR /app

# 3️⃣ Copy package.json and package-lock.json
COPY package*.json ./

# 4️⃣ Install dependencies
RUN npm install

# 5️⃣ Copy the rest of your backend code
COPY . .

# 6️⃣ Build the NestJS project
RUN npm run build && echo "=== DIST FOLDER ===" && ls -lah dist && echo "=== MAIN FILE ===" && cat dist/main.js | head -n 10


# 7️⃣ Expose port 3000 (the port NestJS runs on)
EXPOSE 3000

# 8️⃣ Command to run when container starts
CMD ["npm", "run", "start:prod"]
