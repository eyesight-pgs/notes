# ssh

## generate new key pair

ssh-keygen -o

# generating new SSH key pair for github for Windows

ssh-keygen -t ed25519 -C "your_email@example.com"

## check is agent is running

eval $(ssh-agent -s)

## add identity to agent

ssh-add /home/username/.ssh/file-name

## check if identity added

ssh-add -l -E sha256 

## test ssh connection

ssh -vvvT git@github.com 


## config

	file path: ~/.ssh/config
	file content looks like
	```ssh
	Host hostname1
	    SSH_OPTION value
	    SSH_OPTION value

	Host hostname2
		SSH_OPTION value

	Host *
	    SSH_OPTION value
	```

	example:
	```ssh
	Host github.com
		User git
		Hostname github.com
		PreferredAuthentications publickey
		IdentityFile github-ed25519
	```


## Problem: newly generated ssh key not working with github

link: https://stackoverflow.com/a/62842368 (actual solution)

link: https://stackoverflow.com/a/67869162 (config file values)

ssh config file path on linux: `/home/[usename]/.ssh/config`

ssh config file path on windows: `C:\Users\\[User]\\.ssh\config`

```ssh
Host [git.domain.com]
User [user]
Port [number]
IdentitiesOnly=yes
PreferredAuthentications publickey
PasswordAuthentication no
IdentityFile /home/_USER_NAME_/.ssh/[name_of_PRIVATE_key_file]
```

ex:

```ssh
Host github.com
  User git
  Port 22
  IdentitiesOnly=yes
  PreferredAuthentications publickey
  PasswordAuthentication no
  IdentityFile /home/_USER_NAME_/.ssh/github_ed25519
```
