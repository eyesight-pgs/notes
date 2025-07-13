# users-groups

cat /etc/shadow
cat /etc/group



## adding new user
```bash
useradd my_user -m -G wheel
# -m    creates home directory (without this home dir will not be created)
# -G    addition groups (by default group with username will be added)


# to delete (remove) a user
userdel my_user
```

## groups

some of the common group names are:
wheel, network, disk, storage, audio, video.

some more based on intalled app:
http, docker, rfkill

list all groups of an user: `groups my_user`

## usual groups
network docker postgres rfkill video storage disk audio wheel <my_username>





