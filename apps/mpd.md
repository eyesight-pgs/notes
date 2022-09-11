# mpd

After configuring mpd for 1st time there will be no songs.
To add songs run `mpc --host=/home/USER_NAME/.config/mpd/socket update`

## start mpd for debugging problems

mpd --no-daemon --stdout --verbose
config file: ~/.config/mpd/mpd.conf

## mpc

basic commands:
mpc help
mpc --host=/home/USER_NAME/.config/mpd/socket
mpc --host=/home/USER_NAME/.config/mpd/socket search title "my fav.. song"
mpc --host=/home/USER_NAME/.config/mpd/socket search title "my fav.. song" | mpc --host=/home/USER_NAME/.config/mpd/socket add
mpc --host=/home/USER_NAME/.config/mpd/socket play
mpc --host=/home/USER_NAME/.config/mpd/socket pause
mpc --host=/home/USER_NAME/.config/mpd/socket volume +5
mpc --host=/home/USER_NAME/.config/mpd/socket volume 50

## ncmpcpp

config file: ~/.config/ncmpcpp/ncmpcpp.conf

