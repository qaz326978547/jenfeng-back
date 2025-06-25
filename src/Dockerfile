FROM php:7.4-fpm

LABEL "language"="php"
LABEL "framework"="laravel"
WORKDIR /src

RUN apt-get update \
    && apt-get install -y nginx curl gnupg2 build-essential git jq python3 unzip libzip-dev supervisor \
    && docker-php-ext-install zip \
    && curl -fsSL https://deb.nodesource.com/setup_14.x | bash - \
    && apt-get install -y nodejs

RUN ln -sf /usr/bin/python3 /usr/bin/python

COPY --from=composer:2.7 /usr/bin/composer /usr/bin/composer
COPY . .
COPY ./docker/nginx.conf /etc/nginx/conf.d/default.conf

# 必須於 COPY . . 之後，保證資料夾存在並正確權限
RUN mkdir -p /src/storage /src/bootstrap/cache \
    && chown -R www-data:www-data /src/storage /src/bootstrap/cache

RUN composer install --optimize-autoloader --no-dev \
    && if [ -f package.json ]; then npm install; fi

COPY ./docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

EXPOSE 9000

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
