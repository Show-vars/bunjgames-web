FROM nginx:alpine


COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY public /usr/src/bunjgames-web/

