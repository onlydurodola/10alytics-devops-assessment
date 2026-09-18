FROM node:22.14.0-alpine AS builder

WORKDIR /build

COPY package*.json ./
RUN npm ci

ENV VITE_API_URL=/api
COPY . .
RUN npm run build

FROM nginx:1.27.4-alpine

COPY --from=builder /build/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
