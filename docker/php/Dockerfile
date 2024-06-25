FROM php:7.4-fpm-alpine AS builder

RUN docker-php-ext-install sockets \
        pdo \
        pdo_mysql \
        mysqli

# Install xdebug
RUN apk update \
    && apk add --no-cache $PHPIZE_DEPS \
    && pecl channel-update pecl.php.net \
    && pecl install xdebug-3.0.4 \
    && docker-php-ext-enable xdebug

FROM composer:2 AS composer

FROM builder AS workspace
WORKDIR /var/www
COPY --from=composer /usr/bin/composer /usr/bin/composer
