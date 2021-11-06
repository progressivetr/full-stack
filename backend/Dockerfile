FROM node:lts as develop-state
# add dependencies
#RUN apk add --update --no-cache python3 make g++ openssl openssl-dev libc6-compat musl

WORKDIR /app
COPY package*.json ./
RUN yarn install
COPY . .
RUN yarn prisma generate

FROM develop-state as build-state
RUN yarn build

FROM build-state as production-state
COPY --from=build-state /app/dist /app
COPY --from=build-state /app/node_modules /app/node_modules

EXPOSE 80
CMD yarn prisma migrate deploy && node main.js