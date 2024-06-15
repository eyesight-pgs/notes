# bash scripting

## check if last command was successful

TLDR:
  `$?`
  `if my_command; then...`
    
```bash
my_command;
if [ $? -eq 0 ]; then
  echo "success";
else
  echo "failed";
fi
```

other way:
```bash
if my_command; then
  echo "success";
else
  echo "failed"
fi
```


function call
```bash
hello() {
    echo "hello $1"
}
hello "Mr. Foo"
```

## bash prompt (PS1)
- change color: https://www.cyberciti.biz/faq/bash-shell-change-the-color-of-my-shell-prompt-under-linux-or-unix/
- git integration:
```bashrc
_red=$(tput setaf 1)
_green=$(tput setaf 2)
_blue=$(tput setaf 4)
_magenta=$(tput setaf 5)
_cyan=$(tput setaf 6)
_reset=$(tput sgr0)
_bold=$(tput bold)

# git prompt options
git_ps1_showdirtystate=true
git_ps1_showstashstate=true
git_ps1_showuntrackedfiles=true
git_ps1_showupstream=verbose
# git_ps1_stateseparator=' '
git_ps1_showconflictstate=yes
git_ps1_describe_style=branch
git_ps1_showcolorhints=true

source <path-to--git-prompt.sh>
PS1='\n${_CYAN}${_BOLD}\w${_MAGENTA}`__git_ps1`\n> ' # single quote must be used here
```




