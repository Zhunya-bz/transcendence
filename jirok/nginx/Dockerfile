FROM nginx:alpine

COPY nginx.conf /etc/nginx/nginx.conf

RUN mkdir -p /etc/nginx/certs

COPY certs/fullchain.pem /etc/nginx/certs/fullchain.pem
COPY certs/privkey.pem /etc/nginx/certs/privkey.pem