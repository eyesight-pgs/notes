# php

```php
<?php
// php code here
?>
```

## display all errors

```php
<?php
ini_set('display_startup_errors', '1');
ini_set('display_errors', '1');
error_reporting(E_ALL);

ini_set('log_errors', '1');
ini_set('error_log', 'php_errors.log');
```

in php.ini file:

```
error_reporting = E_ALL
display_errors = On
display_startup_errors = On
log_errors = On
; If you set the error_log directive to a relative path, it is a path relative
; to the document root rather than php's containing folder.
error_log = php_errors.log
```

## exploring php

link: https://github.com/wilmoore/php-version/wiki/Exploring-PHP

### Identify full path to PHP binaries

```
which php
which php-fpm
which pear
which pecl
which phar
which php-cgi
which php-config
which phpize
```

### View manual pages

```
man php
man php-fpm
man php-config
man phpize
```

### useful dynamic extensions

```
curl
intl
mysqli
pdo_mysql
zip
```

### max

```
max_execution_time = 3600
memory_limit = 1024M
post_max_size = 512M
upload_max_filesize = 10M
```

## php-fpm

- as which user php-fpm service runs?
    - link: https://unix.stackexchange.com/questions/30190/how-do-i-set-the-user-of-php-fpm-to-be-php-user-instead-of-www-data

- in ubuntu
    - php-fpm location: `/etc/php/8.1/fpm`
    - php.ini location: `/etc/php/8.1/fpm/php.ini`
    - starting php-fpm service: `service php8.1-fpm start`













