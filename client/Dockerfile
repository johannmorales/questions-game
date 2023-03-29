FROM node:18-alpine as builder

ARG VITE_BACKEND_URL
ENV VITE_BACKEND_URL $VITE_BACKEND_URL

WORKDIR /app

COPY . .

RUN npm install

RUN npm run build

FROM nginx:1.23.4-alpine

COPY --from=builder /app/dist /usr/share/nginx/html

RUN rm /etc/nginx/conf.d/default.conf

COPY deploy/nginx/nginx.conf /etc/nginx/conf.d

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
