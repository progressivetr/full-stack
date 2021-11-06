# develop stage
FROM node:lts-alpine as develop-stage
# add dependencies
RUN apk add --update --no-cache python3 make g++
WORKDIR /app
COPY package*.json ./
RUN yarn install
COPY . .

# build stage
FROM develop-stage as build-stage
RUN yarn build --prod

# production stage
FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d

ENV PORT = 80
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]