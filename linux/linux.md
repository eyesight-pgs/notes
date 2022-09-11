# linux

## print cpu frequency

`cat /sys/devices/system/cpu/cpu*/cpufreq/scaling_cur_freq`

## add new group to an user & use new group without re-login

[link](https://superuser.com/a/345051)
ex:
  current user: user1
  new group: group2
  run: `sudo usermod -aG group2 user1`
  to work with new group without relogin, start new shell like this:
    `newgrp group2`

## network

`ip address show`

`ip -4 -br a` show minimal information

`ip routes`

`bridge link`

## other

`cp -L my-symbolic-link /my/path`: copy content of symbolic link

## alias

alias clr='clear'
alias d='docker'
alias k='kubectl'
alias g='git'
alias wl='nmcli d wifi list'
alias wcon='nmcli d wifi connect'
alias n='nvim'



