# httpd

Apache web server

config file: `/etc/httpd/conf/httpd.conf`

## Adding a virtual host

Create a file for a virtual host in like `/etc/httpd/conf/extra/my-app.local`
and import it in main config file (`/etc/httpd/conf/httpd.conf`) like
`Include conf/extra/my-app.conf` (at the root of the http.conf)

```conf
Listen 12000
<VirtualHost *:12000>
  DocumentRoot "/path"
  ServerName some-name
  ErrorLog "/path"
  CustomLog "/path" common

  <Directory "/path">
    DirectoryIndex index.php index.html
    allow from all
    Require all granted
    Options none
  </Directory>
  RewriteEngine on

</VirtualHost>
```

logs will usually goes to /var/log/...


Processing php files: add following inside <Directory> block

```conf
<FileMatch \.php$>
    SetHandler "proxy:unix:/run/php-fpm/php-fpm.sock|fcgi:/localhost"
</FileMatch>
```
- unix:/run/php-fpm/php-fpm.sock - location-unix-socket-or-tcp-socket
- fcgi:/localhost - mode-of-communication



## Directory listing or index

```conf
<Directory "/path">
    Options +Indexes
</Directory>
```
set `Options none` to prevent directory listing


## Check why redirects (url rewrite) not working from .htaccess

```htaccess
# .htaccess file
<IfModule mod_rewrite.c>
RewriteEngine On
RewriteRule ^ http://example.com [L,R=301]
```
- this will redirect every request to http://example.com.
- if request is not redirected then troubleshoot with following
    - make sure mod_rewrite is enabled in /etc/httpd/conf/httpd.conf file
    - `LoadModule rewrite_module modules/mod_rewrite.so`
    - The above line should eb uncommented
- RewriteEngine should be on (within virtualHost block)
- set `AllowOverride all` inside <Directory> block






