FROM php:8.2-fpm
LABEL "language"="php"
LABEL "framework"="laravel"
WORKDIR /src
RUN apt-get update && apt-get install -y curl gnupg2 build-essential git python2 jq && curl -fsSL https://deb.nodesource.com/setup_14.x | bash - && apt-get install -y nodejs python2 && ln -sf python2 /usr/bin/python
COPY --from=composer:2.7 /usr/bin/composer /usr/bin/composer
COPY . .
RUN composer install --optimize-autoloader --no-dev && if [ -f package.json ]; then npm install; fi && if [ -f package.json ] && [ -n "$(jq '.scripts.build' package.json)" ]; then npm run build; fi
EXPOSE 9000
CMD ["php-fpm"]
