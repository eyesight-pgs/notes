# herbstluftwm

## enable natural scrolling in herbstluftwm
```bash
xinput set-prop "$(xinput list --name-only | grep -i 'touchpad')" "libinput Natural Scrolling Enabled" 1
```
