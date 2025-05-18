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

## PHP DEBUGGING CODE IGNITER APP (in local development)

Steps:
1. Aquire xdebug.so file:
We can install it using package manager.
Ex: `sudo pacman -S xdebug` this will create .so file mostly in following location: `/usr/lib/php/modules/xdebug.so`.
If you failed in above step, then please follow [wizard](https://xdebug.org/wizard) and complete this step.

2. configuring php ini file:
Get the location of the ini file using `php --ini`, in my case its `/etc/php/php.ini`.
Somewhere I read that its better to have separate ini file for xdebug,
so create `/etc/php/conf.d/99-xdebug.ini` using `touch /etc/php/conf.d/99-xdebug.ini`.
And add the following content in 99-xdebug.ini file:
```ini
zend_extension=xdebug
xdebug.mode=debug
xdebug.start_with_request = yes

xdebug.client_host=127.0.0.1
xdebug.client_port=9003
xdebug.log=/tmp/xdebug.log ; optional, to see WTF is happening
```
Verify that the newly created ini file is being loaded by reading output of `php --ini` command.

3. Configuring VSCode:
At the root of the project, create `.vscode/launch.json` file, and add following content:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Listen for Xdebug",
      "type": "php",
      "request": "launch",
      "port": 9003,
      "pathMappings": {
        "/absolute/path/to/the/codeigniter-project": "${workspaceFolder}"
      }
    }
  ]
}
```
Note that inside pathMappings you need to update the key to absolute path to you code ignite app (root of the project).

4. Final Step
- Start the vs code debuger (`Listen for Xdebug`)
- Open terminal at the root of the project and start serving the app: `./spark serve --port 8000`
- Put some breakpoints in source code in vscode
- Load the application in browser `http://localhost:8000` and navigate to the pages related code where you put breakpoints.
- Congratulations you hit the breakpoint. Thank me now :)




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


