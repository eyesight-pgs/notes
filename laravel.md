# Laravel

## Create new project specific version of laravel

- link: https://stackoverflow.com/questions/23754260/installing-specific-laravel-version-with-composer-create-project
- `composer create-project laravel/laravel=4.1.27 your-project-name --prefer-dist`

## Changes not reflecting

- if you think your changes are not reflecting then you can try any/all of the following
	- `php artisan cache:clear`
	- `php artisan config:cache`
  - `composer dump-autoload -o`
  - other things you can try are:
    - `php artisan clear-compiled`




