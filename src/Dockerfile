# 使用官方 PHP 映像作為基礎映像
FROM php:7.4-fpm

# 設置工作目錄
WORKDIR /var/www

# 安裝系統依賴項
RUN apt-get update && apt-get install -y \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install gd

# 安裝 Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# 複製專案文件到容器中
COPY . /var/www

# 安裝 PHP 依賴項
RUN composer install --no-dev --optimize-autoloader

# 設置正確的文件權限
RUN chown -R www-data:www-data /var/www/storage && chmod -R 755 /var/www/storage

# 暴露端口
EXPOSE 9000

# 啟動 PHP-FPM
CMD ["php-fpm"]
