# apt pakcage manager

## remove a package completely (with deps & data)

`sudo apt-get purge --auto-remove <package_name>`
- `purge`: Removes the "package" and its "configuration files".
- `--auto-remove`: Kicks out any "dependencies" installed just for this package.

`sudo apt-get clean`
- May be it removes cached .deb file downloaded by apt during installation.
