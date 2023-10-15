# https

Serve on https with ssl

```bash
# generate certificate
# / (root of FS)
# |- etc
#     |- nginx
#          |- ssl
#             |- nginx-selfsigned.key (new file)
#             `- nginx-selfsigned.crt (new file)
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /etc/nginx/ssl/nginx-selfsigned.key -out /etc/nginx/ssl/nginx-selfsigned.crt
```


```nginx.conf
server {
  listen 4444 ssl;
  # ...
  
  ssl_certificate /etc/nginx/ssl/nginx-selfsigned.crt;
  ssl_certificate_key /etc/nginx/ssl/nginx-selfsigned.key;
  #...
}
```


