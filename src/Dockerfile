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

RUN mkdir -p /src/storage/logs /src/bootstrap/cache \
    && chown -R www-data:www-data /src/storage /src/bootstrap/cache \
    && chmod -R 777 /src/storage /src/bootstrap/cache

RUN composer install --optimize-autoloader --no-dev \
    && if [ -f package.json ]; then npm install; fi

RUN php-fpm -t || true

# ⬇⬇ Debug 檢查位置（可刪/可留）
RUN ls -l /src/storage && ls -l /src/storage/logs && ls -l /src/bootstrap && ls -l /src/bootstrap/cache \
    && touch /src/storage/logs/laravel.log \
    && chmod 777 /src/storage/logs/laravel.log

COPY ./docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

EXPOSE 9000

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]