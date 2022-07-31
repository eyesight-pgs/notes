# yarn

# view path for globally installed packages
yarn global bin

#installing packages globally
yarn global add <package-name>
link: https://classic.yarnpkg.com/en/docs/cli/global

# setting ~/.yarn global path for installing packages
yarn config set prefix "~/.yarn"
in this case packages will be stored in "~/.yarn/bin" directory
note: "~/.yarn/bin" needs to be added to PATH
	export PATH="${PATH}:~/.yarn/bin"


