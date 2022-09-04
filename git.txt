---------- GIT ----------

--> Commonly used commands explained
	link: https://forum.freecodecamp.org/t/push-a-new-local-branch-to-a-remote-git-repository-and-track-it-too/13222
	
--> new branch
		-> go to a prefered branch
			-> git branch <new branch name>
			OR
			-> git checkout -b <new branch name>
			

-> UNDO
	How to undo (almost) anything with Git 
	link: https://github.blog/2015-06-08-how-to-undo-almost-anything-with-git/

## Undo last commit

`git reset HEAD~` this will undo last commit and changes will be unstaged

link: https://stackoverflow.com/questions/927358/how-do-i-undo-the-most-recent-local-commits-in-git

-> add left out changes to last commit
  first stage the modified content, then:
  git commit --amend --no-edit
  It will add modfied content to existing commit (last commit)

-> view details for any commit
  git show <commit>
  git show HEAD ## for last commit

