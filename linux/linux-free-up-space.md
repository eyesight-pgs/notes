# linux free up space

```bash
# journal - To see the size of the log
`journalctl --disk-usage`

# journal - To delete, the 1d represents that it will delete logs more than a day older
journalctl --vacuum-time=1d

# Delete thumbnail cache without a cleaner software:
rm -r ~/.cache/thumbnails/*

# Delete yay cache
yay -Sc

# yarn cache clean
yarn cache clean --all
```


