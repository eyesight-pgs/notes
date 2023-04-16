# yarn

# view path for globally installed packages
yarn global bin

#installing packages globally
yarn global add <package-name>
link: https://classic.yarnpkg.com/en/docs/cli/global

# setting ~/.yarn global path for installing packages
	
- `yarn config set prefix "~/.yarn"`
- in this case packages will be stored in "~/.yarn/bin" directory
- note: `"~/.yarn/bin"` needs to be added to PATH: `export PATH="${PATH}:~/.yarn/bin"`

# .npmrc file

- npm configurations are stored in `.npmrc` files and yarn respectes these values.
- there are majroyly 3 different levels of npm configs:
	- project level
	- user level
	- global level
	
	```sh
	# setting project level .npmrc
	npm config set -L project foo bar
	# this adds foo=bar in project's .npmrc file

	# user level
	npm config set -L user foo bar

	# global level
	npm config set -L global foo bar
	```
