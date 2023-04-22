# docker



-  GOOD DOCUMENTS ABOUT ALL DOCKER COMMANDS
   - link: https://github.com/moby/moby/tree/10c0af083544460a2ddc2218f37dc24a077f7d90/docs/reference/commandline

    
- .dockerignore
    ```
    # ignpore everything
    *

    # allow following folders
    !/public/**
    !/src/**

    # allow following files
    !/package.json
    !/.docker/nginx-default.conf
    ```




- How to exit out of docker interactive tty? (docker run -it .....)
    - Ctrl+D // may its only for container running `cat` command
    - just exit from shell. thats it.
    
- How to export & import an image
    - docker save --output cat-2.tar cat:2 // export
    - docker load --input cat-2.tar // import
    
    
- save & load (for image)
    ```bash
    docker save --output filename.tar
    ```
    ```bash
    docker load --input filename.tar
    ```

- export & import (export is for container & import is complicated)

    - export
    ```bash
    docker export --output filename.tar
    ```

    - import
    ```bash
    docker import filename.tar imagen_name:version_name

    # ex:
    docker import filename.tar cat:2
    ```

    the above command just creates new images in our system. to get the container back we need to run the `docker run` command.
    Some how entry point is not there in imported image. so while running the new container we need to specify the command explicitly

    ```bash
    docker run --interactive --tty --name cotnainer-name image_name:version_name command_to_run

    # ex:
    docker run --interactive --tty --name cotnainer-cat cat:2 /bin/cat
    ```

## inspect

- A greate tool to inpect any resource in docker. Use like: `docker inspect <resourc-id>`
    - ex:
        - `docker inspect <image-name>`
        - `docker inspect <image-id>`
        - `docker inspect <container-name'>`
        - `docker inspect <container-id>`
        - `docker inspect <network-name>`

## network

- `docker network ls` list all networks

- `docker network create my-nw` creates a custom bridge network.
- It will create default gateway ip like: 172.17.0.1 and all new docker containers
created will have next ip addresses like 172.17.0.2, 172.17.0.3 .
- To create a contain with custom bridge n/w run docker create command with --network option like:
`docker create --network my-nw --name my-container archlinux`. Its very easy to refer other
containers in same custom bridge network...like: `ping my-container2`

- `docker inspect <network-name>`

## copy files to docker

`docker cp my-file.ext my-container:/my/path/`

## view logs

- `docker logs my-container`
- `docker logs my-container | tail`

## do not invalidate CACHE on version bump in package.json

If we update version field in package.json, even though dependencies are not changed, the `RUN yarn` step's CACHE will be invalidated & it will run again.
Which consume lot of time.

Easy solution is to use the multstage build + jq to extract dependencies & devDependencies. Here is one example:

```Dockerfile
# Builder stage
FROM node:18 AS builder
RUN apt-get update
RUN apt-get install -y jq
WORKDIR /hello-world
COPY package.json /tmp/package.json
RUN jq '{ dependencies, devDependencies }' < /tmp/package.json > /tmp/deps.json

# Runtime stage
FROM node:18
WORKDIR /hello-world
COPY .npmrc .
COPY yarn.lock .
COPY --from=builder /tmp/deps.json ./package.json
RUN yarn
COPY . .
CMD ["yarn", "start"]
```


## Ubuntu & Debian - asking for input during docker build!

```console
apt-get upadte
1. India    2. US   3. Aus
...
Geographic area: 
```

- proprt to select `Geographic area:`
- soln: use `ARG DEBIAN_FRONTEND=noninteractive` in Docekrfile
- link: https://github.com/Netflix/security_monkey/issues/1197#issuecomment-706606645

- While installing packages

```console
apt-get install nginx
Do you want to install [Y/n]:

# soln: use -y
# apt-get install -y nginx
```



