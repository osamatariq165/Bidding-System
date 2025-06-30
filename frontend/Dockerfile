# 1️⃣ Use Node for build stage
FROM node:18-alpine as build

# 2️⃣ Set working dir
WORKDIR /app

# 3️⃣ Install deps
COPY package*.json ./
RUN npm install

# 4️⃣ Copy source
COPY . .

# 5️⃣ Build static files
RUN npm run build

# 6️⃣ Use nginx to serve
FROM nginx:alpine

# 7️⃣ Copy built files into nginx public folder
COPY --from=build /app/dist /usr/share/nginx/html

# 8️⃣ Expose port 80
EXPOSE 80

# 9️⃣ Start nginx
CMD ["nginx", "-g", "daemon off;"]
