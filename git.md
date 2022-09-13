# GIT

## Commonly used commands explained

	link: https://forum.freecodecamp.org/t/push-a-new-local-branch-to-a-remote-git-repository-and-track-it-too/13222
	
## new branch

		-> go to a prefered branch
			-> git branch <new branch name>
			OR
			-> git checkout -b <new branch name>
			

## UNDO

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

## git config

```sh
git config --local --list
git config --global --list
git config --local user.name "Foo Bar"
git config --local user.email "foo.bar@example.com"
git config --local --unset user.name
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









