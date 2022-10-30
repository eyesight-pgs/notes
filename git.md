# GIT

## config file

`~/.gitconfig` - config file location.<br>
Most of the time it can be modified by `git config --global <configsection>.<configname>`


## Commonly used commands explained

	link: https://forum.freecodecamp.org/t/push-a-new-local-branch-to-a-remote-git-repository-and-track-it-too/13222
	
## new branch

		-> go to a prefered branch
			-> git branch <new branch name>
			OR
			-> git checkout -b <new branch name>
			
## undo

	How to undo (almost) anything with Git 
	link: https://github.blog/2015-06-08-how-to-undo-almost-anything-with-git/

## Undo last commit

`git reset HEAD~` this will undo last commit and changes will be unstaged

link: https://stackoverflow.com/questions/927358/how-do-i-undo-the-most-recent-local-commits-in-git


## stage & unstage

`git add *` stage all files

`git add ./my-file.txt` stage single file

`git reset *` unstage all the files

`git reset ./my-file.txt` unstage single file


## add left out changes to last commit

  first stage the modified content, then:
  git commit --amend --no-edit
  It will add modfied content to existing commit (last commit)

## show - view details for any commit

  git show <commit>
  git show HEAD ## for last commit

## push with "--force " vs "--force-with-lease"

`--force-with-lease` is safer option than `--force`
`--force` - overwrites remote, remvoes other teammates changes if any.
`--force-with-lease` - overwrites remote, but does not remove other teammates changes if any.

## git revert

- revert back to previous commit after pushing it to remote:

```bash
git revert --hard Head~1
git push --force
```

- git revert back to some commit id after pushing to remote:

```bash
git revert --hard <commit-id>
git push --force
```

## pushing local branch to remote

```bash
git push -u origin "<branch-name>"
```

## git config

```sh
git config --local --list
git config --global --list
git config --local user.name "Foo Bar"
git config --local user.email "foo.bar@example.com"
git config --local --unset user.name
git config --glocal --edit # manually editing config
```

## adding git alias

```sh
git config --global alias.ps "push"
git config --global alias.psf "push --force"
git config --global alias.pl "pull"
git config --global alias.br "branch"
git config --global alias.ch "checkout"
git config --global alias.chb "checkout -b"
git config --global alias.co "config"
git config --global alias.col "config --local"
git config --global alias.cog "config --global"
git config --global alias.coll "config --local --list"
git config --global alias.cogl "config --global --list"
git config --global alias.colu "config --local --unset"
git config --global alias.cogu "config --global --unset"
git config --global alias.cole "config --local --edit"
git config --global alias.coge "config --global --edit"
git config --global alias.cm "commit"
git config --global alias.cma "commit --amend"
git config --global alias.cmane "commit --amend --no-edit"
git config --global alias.lg "log"
git config --global alias.lgo "log --oneline"
git config --global alias.lgo11 "log --oneline -11"
git config --global alias.ss "status"
git config --global alias.sh "stash"
git config --global alias.shp "stash pop"
git config --global alias.shl "stash list"
git config --global alias.shs "stash show"
git config --global alias.sw "show"
git config --global alias.swh "show HEAD"
git config --global alias.di "diff"
git config --global alias.dis "diff --staged"
git config --global alias.di- "diff --"
git config --global alias.dis- "diff --staged --"
```

## git difftools

`git-delta`

example usage:

```
[core]
	pager = delta

[interactive]
  diffFilter = delta --color-only --features=interactive

[delta]
  features = decorations
  side-by-side = true

[delta "interactive"]
  keep-plus-minus-markers = false

[delta "decorations"]
  commit-decoration-style = blue ol
  commit-style = raw
  file-style = omit
  hunk-header-decoration-style = blue box
  hunk-header-file-style = red
  hunk-header-line-number-style = "#067a00"
  hunk-header-style = file line-number syntax
```

## github PR diff

To get diff from github, put .diff at the end of PR's url

## appying patch

```bash
git apply --reject --whitespace=fix mychanges.patch
# link: https://stackoverflow.com/a/15375869
```

# line ending LF vs CRLF

link: https://stackoverflow.com/q/10418975

- Checkout Windows-style, commit Unix-style (recommended for windows)
	`git config --local core.autocrlf true`
- Checkout as-is, commit Unix-style (recommended for linux)
	`git config --local core.autocrlf input`
- Checkout as-is, commit as-is (not conversion by git)
	`git config --local core.autocrlf false`

# changing commit message of multiple commits

link: https://docs.github.com/en/pull-requests/committing-changes-to-your-project/creating-and-editing-commits/changing-a-commit-message
Displays a list of the last 3 commits on the current branch
```bash
$ git rebase -i HEAD~3
pick e499d89 Delete CNAME
pick 0c39034 Better README
pick f7fde4a Change the commit message but push the same commit.
```
Replace pick with reword before each commit message you want to change (in vi editor).
```bash
pick e499d89 Delete CNAME
reword 0c39034 Better README
reword f7fde4a Change the commit message but push the same commit.
```
then force push
```bash
git push --force origin example-branch
```

## git stash delete all

`git stash clear`


