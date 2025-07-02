# Curriculum Service Dockerfile
FROM node:18-alpine

WORKDIR /usr/src/app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm install --production

# Copy source code
COPY prisma ./prisma
COPY src ./src

# Generate Prisma client
RUN npx prisma generate

# Build TypeScript (optional, using ts-node in dev)
RUN npm run build

EXPOSE 4000
CMD ["npm", "start"]
