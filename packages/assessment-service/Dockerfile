# Assessment Service Dockerfile
FROM node:20-alpine3.21
WORKDIR /usr/src/app

# Install dependencies
COPY package.json package-lock.json* ./
COPY tsconfig.json ./
RUN npm install # Install all dependencies, including devDependencies

# Copy Prisma schema and generated client
COPY prisma ./prisma
COPY src ./src

# Generate Prisma client and build
RUN npx prisma generate
RUN npm run build

EXPOSE 4001
CMD ["npm", "start"]
