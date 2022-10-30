# Cross Origin Resource Sharing (CORS)

## Headers involved

Access-Control-Allow-Origin (origin URL)
Access-Control-Request-Method (comma separated) (Methods which are allowed to use by browser)
Access-Control-Allow-Headers (Custom Headers which are allowed to send by browser to server, Basic headers are allowed by default)
Access-Control-Expose-Headers (comma separated) (Headers which are allowed to read by browser)

## With NGINX proxy

```nginx.conf
user nginx;
events {
    worker_connections  1024;
}
http {
    server {
        listen 80;
        listen [::]:80;
        server_name localhost;
        location / {
            add_header 'Access-Control-Allow-Origin' 'http://localhost:4200'; # URL of frontend
            add_header 'Access-Control-Allow-Headers' 'content-type,authorization';
            add_header 'Access-Control-Expose-Headers' 'authorization,';
            add_header 'Access-Control-Request-Method' 'get,post,put,delete,option';
            proxy_pass http://host.docker.internal:11000/; # URL of backend
        }
    }
}
```

