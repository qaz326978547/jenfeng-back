# syntax=docker/dockerfile:1

FROM php:7.4-fpm

LABEL "language"="php"
LABEL "framework"="laravel"

ENV APP_ENV=prod
ENV APP_DEBUG=true

WORKDIR /var/www

ADD https://github.com/mlocati/docker-php-extension-installer/releases/latest/download/install-php-extensions /usr/local/bin/
RUN chmod +x /usr/local/bin/install-php-extensions && sync

RUN set -eux \
    && apt update \
    && apt install -y cron curl gettext git grep libicu-dev nginx pkg-config unzip \
    && rm -rf /var/www/html \
    && curl -fsSL https://deb.nodesource.com/setup_14.x -o nodesource_setup.sh \
    && bash nodesource_setup.sh \
    && apt install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

RUN install-php-extensions @composer apcu bcmath gd intl mysqli opcache pcntl pdo_mysql sysvsem zip

RUN cat <<'EOF' > /etc/nginx/sites-enabled/default
server {
    listen 8080;
    root /var/www/public;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";

    index index.php index.html;
    charset utf-8;

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    error_page 404 /index.php;

    location ~ \.php$ {
        try_files $uri =404;
        fastcgi_split_path_info ^(.+\.php)(/.*)$;
        fastcgi_pass 127.0.0.1:9000;
        fastcgi_index index.php;
        include fastcgi_params;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        fastcgi_param DOCUMENT_ROOT $realpath_root;
        fastcgi_param PATH_INFO $fastcgi_path_info;
        fastcgi_hide_header X-Powered-By;
    }

    location / {
        try_files $uri $uri/ /index.php$is_args$args;
        gzip_static on;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }

    error_log /dev/stderr;
    access_log /dev/stderr;
}
EOF

RUN chown -R www-data:www-data /var/www
COPY --link --chown=www-data:www-data --chmod=755 . /var/www
RUN mkdir -p /var/www/bootstrap/cache && chown -R www-data:www-data /var/www/bootstrap/cache

USER www-data
RUN set -eux \
    && composer install --no-dev --optimize-autoloader --classmap-authoritative \
    && npm install \
    && npm run production
USER root

CMD nginx; php-fpm;

EXPOSE 8080