# sshfs

`sudo pacmanb -S sshfs`

example: mount: `sshfs phone:/data/data/com.termux/files/home/storage/shared/www ~/phone`, unmount: `fusermount -uz ~/phone`

syntax: mount: `sshfs user@host:port:path local-mount-path`, unmount: `fusermount -uz local-mount-path`



## example - mounting android sdcard folder using termux app

on phone:
get phone's ip address using `ifconfig`

username using `whoami`

set password using `passwd` (used for initial setup)

install openssh using `pkg install openssh`

start ssh server `sshd`


on laptop:
generate a ssh key in laptop: `ssh-keygen -t ed25519` and give a name like `some-key`

copy key to android phone: `ssh-copy-id -p 8022 -i ~/.ssh/some-key username-in-phone@ipaddr-of-phone`

ssh config
```config
Host phone
	Hostname <ip-address-of-phone>
	User <user-name-in-phone>
	Port 8022
	PreferredAuthentications publickey
	IdentityFile ~/.ssh/some-key
	IdentitiesOnly yes
```

mount and start using: `sshfs phone:/data/data/com.termux/files/home/storage/shared/www ~/phone`

unmount: `fusermount -uz ~/phone`






