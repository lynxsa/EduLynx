# Career Service Dockerfile
FROM node:20-alpine
WORKDIR /usr/src/app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm install --production

# Copy Prisma schema and generated client
COPY prisma ./prisma
COPY src ./src

# Generate Prisma client and build
RUN npx prisma generate
RUN npm run build

EXPOSE 4002
CMD ["npm", "start"]
