# yarn

## yarn config info
https://yarnpkg.com/configuration/yarnrc

# yarn config file location
Its usually ~/.yarnrc

Or we can find through:
yarn config list --verbose

# global installation directory
- view path:
	yarn global bin
	link: https://classic.yarnpkg.com/en/docs/cli/global search for "Defining install location"
- setting custom global installation dir<br>
	`yarn config set prefix <filepath>`<br>
	ex:  yarn config set prefix ~/.yarn ===> it wil install packages to ~/.yarn/bin



