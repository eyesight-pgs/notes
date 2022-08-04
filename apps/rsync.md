# rsync

## usefull links

- https://www.digitalocean.com/community/tutorials/how-to-use-rsync-to-sync-local-and-remote-directories


## dry run

```bash
rsync -anv <source-path-with-trailing-slash> <destination-path-without-trailing-slash>
```

here `n` is for dry run

`v` for verbose

## other options

`z` for compress while transfering data. useful when remote host is involved

`P` it combines both --progress and --partial

`--exclude` exclude files/folders
