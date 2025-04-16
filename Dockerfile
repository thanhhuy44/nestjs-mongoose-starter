# Stage 1: Build

FROM node:23-alpine AS builder

WORKDIR /app

COPY package.json ./
COPY yarn.lock ./

RUN yarn install

COPY . .

RUN yarn build

# Stage 2: Build

FROM node:23-alpine 

WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
RUN yarn install --production --frozen-lockfile && yarn cache clean --force

CMD ["node", "dist/main"]