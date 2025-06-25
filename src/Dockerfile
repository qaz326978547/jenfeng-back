FROM php:7.4-fpm

LABEL "language"="php"
LABEL "framework"="laravel"
WORKDIR /src

# 安裝 nginx, node14, python3, 基本工具 & php-zip, unzip
RUN apt-get update \
    && apt-get install -y nginx curl gnupg2 build-essential git jq python3 unzip libzip-dev supervisor \
    && docker-php-ext-install zip \
    && curl -fsSL https://deb.nodesource.com/setup_14.x | bash - \
    && apt-get install -y nodejs

RUN ln -sf /usr/bin/python3 /usr/bin/python

# 複製 composer
COPY --from=composer:2.7 /usr/bin/composer /usr/bin/composer

COPY . .

# 複製 nginx 設定到適當位置（等下會給 nginx.conf 內容）
COPY ./docker/nginx.conf /etc/nginx/conf.d/default.conf

# PHP 必要權限
RUN chown -R www-data:www-data /src/storage /src/bootstrap/cache

# 安裝 PHP/JS 依賴
RUN composer install --optimize-autoloader --no-dev \
    && if [ -f package.json ]; then npm install; fi

# Supervisor 啟動 script
COPY ./docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

EXPOSE 80

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
