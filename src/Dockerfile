FROM php:7.4-fpm
LABEL "language"="php"
LABEL "framework"="laravel"
WORKDIR /src

# 安裝基本開發工具、php zip 擴充、unzip、node14
RUN apt-get update \
    && apt-get install -y curl gnupg2 build-essential git jq python3 unzip \
    && apt-get install -y libzip-dev \
    && docker-php-ext-install zip \
    && curl -fsSL https://deb.nodesource.com/setup_14.x | bash - \
    && apt-get install -y nodejs

RUN ln -sf /usr/bin/python3 /usr/bin/python

COPY --from=composer:2.7 /usr/bin/composer /usr/bin/composer
COPY . .

RUN composer install --optimize-autoloader --no-dev \
    && if [ -f package.json ]; then npm install; fi \
    && if [ -f package.json ] && [ -n "$(jq '.scripts.build' package.json)" ]; then npm run build; fi

EXPOSE 9000

CMD ["php-fpm"]
