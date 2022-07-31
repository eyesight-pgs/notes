# mount unmount


## mounting

```bash
sudo mount <source> <destination>
```

here source is device file
and destnation is target folder


## unmounting

```bash
sudo umount <destination>
```

if target is busy

```bash
sudo lsof | grep <destination folder name>
# ex: sudo lsof | grep pendrive
```


