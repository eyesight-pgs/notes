# yarn

## yarn config info
https://yarnpkg.com/configuration/yarnrc

## yarn config file location
Its usually ~/.yarnrc

Or we can find through:
yarn config list --verbose

## yarn also reads .npmrc file

- .npmrc file localtions: https://docs.npmjs.com/cli/v8/configuring-npm/npmrc?v=true#files
  - per-project config file (/path/to/my/project/.npmrc)
  - per-user config file (~/.npmrc)
  - global config file ($PREFIX/etc/npmrc)
  - npm builtin config file (/path/to/npm/npmrc)
- resetting npm registry location: `npm config set registry https://registry.npmjs.com/`

# global installation directory
- view path:
	yarn global bin
	link: https://classic.yarnpkg.com/en/docs/cli/global search for "Defining install location"
- setting custom global installation dir<br>
	`yarn config set prefix <filepath>`<br>
	ex:  yarn config set prefix ~/.yarn ===> it wil install packages to ~/.yarn/bin

## cache clean

```bash
# local
yarn cache clean

# global
yarn cache clean --mirror

# local & global
yarn cache clean --all
```


