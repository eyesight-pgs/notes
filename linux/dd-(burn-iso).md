## dd (burn iso)

Burn ISO to pendrive


Find the pendrive (something like: /dev/sdx)
```bash
lsblk
```

Syntax:
```bash
sudo dd if=__path_to_iso_file__ of=/dev/sdx bs=4M status=progress oflag=sync
```

Example:
```bash
sudo dd if=ubuntu-24.04.3-desktop-amd64.iso of=/dev/sdc bs=4M status=progress oflag=sync
```

- if: input file - iso file
- of: output file - pendrive
- bs: block size - 4M = 4MB
- status=progress: show the progress details
- onflag=sync: flush all the changes to pendrive before command exits


