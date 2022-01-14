# ssh

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
