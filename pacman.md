# pacman

## nuke a pakage
```bash
sudo pacman -Rns <package>
```
Completly uninstals a package

## check dependants
```bash
pactree -r <package>
```
I it will tell who needs mentioned <package>.

Installing pactree if not present: `sudo pacman -S pacman-contrib`

## check dependants of a file
```bash
pacman -Qo <path-to-file>
```
Ex: `pacman -Qo /usr/lib/firmware/nvidia/ad103`


