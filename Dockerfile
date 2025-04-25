# Use official Nginx image
FROM nginx:alpine

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy our custom nginx config
COPY nginx.conf /etc/nginx/conf.d

# Copy static files to nginx html directory
COPY public/ /usr/share/nginx/html

EXPOSE 80