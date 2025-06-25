FROM php:7.4-fpm
LABEL "language"="php"
LABEL "framework"="laravel"
WORKDIR /src

RUN apt-get update \
    && apt-get install -y curl gnupg2 build-essential git jq python3 \
    && curl -fsSL https://deb.nodesource.com/setup_14.x | bash - \
    && apt-get install -y nodejs

# 建立 python 連結到 python3（有的系統 python 指到 python2，這裡強制指向 python3）
RUN ln -sf /usr/bin/python3 /usr/bin/python

COPY --from=composer:2.7 /usr/bin/composer /usr/bin/composer
COPY . .

RUN composer install --optimize-autoloader --no-dev \
    && if [ -f package.json ]; then npm install; fi \
    && if [ -f package.json ] && [ -n "$(jq '.scripts.build' package.json)" ]; then npm run build; fi

EXPOSE 9000

CMD ["php-fpm"]
