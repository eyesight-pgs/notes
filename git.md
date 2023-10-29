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

  first stage the modified content, then:<br>
  `git commit --amend --no-edit`<br>
  It will add modfied content to existing commit (last commit)

## show - view details for any commit

  - `git show <commit>`
  - `git show HEAD ## for last commit`
  
  OR using `git diff`
  - `git diff commit-ish~ commit-ish` ex: `git diff HEAD~ HEAD`

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
git config --global --edit # manually editing config
```

## adding git alias

```sh
git config --global alias.ps "push"
git config --global alias.psf "push --force-with-lease"
git config --global alias.pl "pull"
git config --global alias.bi "bisect"
git config --global alias.bis "bisect start"
git config --global alias.big "bisect good"
git config --global alias.bib "bisect bad"
git config --global alias.bire "bisect reset"
git config --global alias.biru "bisect run"
git config --global alias.bil "bisect log"
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
git config --global alias.cmm "commit -m "
git config --global alias.cma "commit --amend"
git config --global alias.cmane "commit --amend --no-edit"
git config --global alias.lg "log"
git config --global alias.lgo "log --oneline --decorate --all --graph"
git config --global alias.lgo11 "log --oneline --decorate --all --graph -11"
git config --global alias.ss "status"
git config --global alias.sh "stash"
git config --global alias.shp "stash pop"
git config --global alias.shl "stash list"
git config --global alias.shs "stash show"
git config --global alias.shd "stash drop"
git config --global alias.shd0 "stash drop 0"
git config --global alias.sw "show"
git config --global alias.swh "show HEAD"
git config --global alias.di "diff"
git config --global alias.dis "diff --staged"
git config --global alias.di- "diff --"
git config --global alias.dis- "diff --staged --"
git config --global alias.smdf "submodule deinit -f ."
git config --global alias.smui "submodule update --init"
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
git apply --stat mychanges.patch
git apply --check mychanges.patch
git apply --reject --whitespace=fix mychanges.patch
```
- link: https://stackoverflow.com/questions/2249852/how-to-apply-a-patch-generated-with-git-format-patch
- link: https://stackoverflow.com/a/15375869

## cherry pick

`git cherry-pick commitSha`

```txt
master - a - b
   `- feature - c - d - e
   
git checkout master; git cherrypick e;

master - a - b - e
   `- feature - c - d - e   
```



# line ending LF vs CRLF

link: https://stackoverflow.com/q/10418975

- Checkout Windows-style, commit Unix-style (recommended for windows)
	`git config --local core.autocrlf true`
- Checkout as-is, commit Unix-style (recommended for linux)
	`git config --local core.autocrlf input`
- Checkout as-is, commit as-is (not conversion by git)
	`git config --local core.autocrlf false`
	
### changing line ending for all files in a folder (directory)

- `find . -type f -exec dos2unix {} \;`
- here: `.` is current directory, `-type f` is all file, `\;` is end of exec statement
- stackoverflow: https://stackoverflow.com/questions/7068179/convert-line-endings-for-whole-directory-tree-git

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

## git log format(pretty print, ancestry-path)

`git log --pretty=format:"%h%x09%an%x09%s" --ancestry-path <commit-ish-old>..<commit-ish-new> -- path/to/file/or/folder`

## search commit by content (string/regexp) (search for deleted lines)

- `git log -S <string> path/to/file`
- `git log -G <regex> path/to/file`

## git rebase

- `git rebase <base>` - this will rebase current branch on top of <base>. Here <base> is commit-sh.
- [reference-atlassian-git-rebase](https://www.atlassian.com/git/tutorials/rewriting-history/git-rebase)
- ex:
  ```shell
  # Create a feature branch based off of main
  git checkout -b feature_branch main
  # Edit files
  git commit -a -m "Adds new feature"

  # git rebase <base>
  git rebase main
  ```

## breaking monorepo with history (Splitting a subfolder out into a new repository)

- https://docs.github.com/en/get-started/using-git/splitting-a-subfolder-out-into-a-new-repository
- git-filter-repo
  - link to python script (raw): `https://raw.githubusercontent.com/newren/git-filter-repo/main/git-filter-repo`
  - save to `git-filter-repo.py`
  - running: `pyhton git-filter-repo.py`

## commit lint

link: https://github.com/conventional-changelog/commitlint

## github ssh

please check ssh.md for details

## submodule

```sh
# adding a submodule
git submodule add <git-repo-clone-url> <name>
git submodule add git@exaple.com

## resetting all submodules (delete all submodules & clone again)
git submodule deinit -f .
git submodule update --init
```

## find branch name from commit hash

- link: https://stackoverflow.com/questions/2706797/finding-what-branch-a-git-commit-came-from
- `git branch -a --contains <commit>`
- `git reflog show --all | grep a871742`
- `git log --merges <commit>..` - subsequent merge commit

## rename branch main to master (in local and remote)
```bash
git branch -m main master # main --> master in local
git branch # verify
git push -u origin master # create new branch in remote
# make master as default branch in remote (github)
git push origin :main # delete main branch in remote
```

## deleting a tag (in local and remote)
```bash
# delete local tag 'v1.0.0'
git tag -d v1.0.0
# delete same tag ('v1.0.0') in remote (like github)
git push origin :refs/tags/12345
```

