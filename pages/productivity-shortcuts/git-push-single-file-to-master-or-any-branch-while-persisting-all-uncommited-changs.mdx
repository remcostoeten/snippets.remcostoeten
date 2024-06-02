---
title: Push file to master or any branch while persisting all uncommitted changes
description: Sometimes you want to push a single file to the master branch or any branch while persisting all uncommitted changes. Not that hard, but can lead to fuck ups, so automate it baby.
---

# Git - Push Single File to Master or Any Branch While Persisting All Uncommitted Changes

It's a sequence of commands which first stash the current changes, then checkout to the master branch, apply the changes of the specific file from the stash, add the specific file to the staging area, commit the changes, push the changes to the master branch, checkout back to the original branch, and finally apply the stashed changes.


> **Note:** This snippet pushes directly to master. Please change according to your needs.


```shell filename='in yo terminal' copy
git stash
git checkout master
git stash apply
git add interesting-future-implementations.md
git commit -m "Your commit message"
git push origin master
git checkout -
```

But since we real giga-chads out here we obviously automate it with a function. I use zsh.

vim `~/.zshrc`

```zsh filename='~/.zshrc' copy
# I prefix my functions with fnc_ to make them easier to find

fnc_commit_file_to_master_with_message() {
  # Get the current branch name
  local current_branch=$(git rev-parse --abbrev-ref HEAD)

  # Stash all changes
  git stash --all

  # Checkout to the master branch
  git checkout master

  # Apply the changes of the specific file from the stash
  git checkout stash@{0} -- "$1"

  # Add the specific file to the staging area
  git add "$1"

  # Commit the changes
  git commit -m "$2"

  # Push the changes to the master branch
  git push origin master

  # Checkout back to the original branch
  git checkout $current_branch

  # Apply the stashed changes
  git stash pop
}

alias singlecommit="fnc_commit_file_to_master_with_message"
  # Or alias pushfilemaster="fnc_commit_file_to_master_with_message"
```

Usage:

```shell filename='in yo terminal' copy
# First argument is the file name, second is the commit message
singlecommit "a-file-name.tsx" "Your commit message"```
# or whatever alias you chose  #
```

I can understand such sequence of commands can be terrifying,especially when pushing to master so if you want to dry run it, you can do so by adding `echo` before each command. (dry-run = showing results without executing.)

```zsh filename='~/.zshrc' copy
fnc_commit_file_to_master_dry_run() {
  # Get the current branch name
  local current_branch=$(git rev-parse --abbrev-ref HEAD)
  echo "Current branch is $current_branch"

  # Stash all changes
  echo "git stash --all"

  # Checkout to the master branch
  echo "git checkout master"

  # Apply the changes of the specific file from the stash
  echo "git checkout stash@{0} -- $1"

  # Commit the changes
  echo "git commit -m \"$2\""

  # Push the changes to the master branch
  echo "git push origin master"

  # Checkout back to the original branch
  echo "git checkout $current_branch"

  # Apply the stashed changes
  echo "git stash pop"
}

alias dryrun-commit="fnc_commit_file_to_master_dry_run"
```

Would be best to add another argument which is the branch name instead of hardcoding master, but I'll leave that to you. If you implement that Though, please make a PR [here](https://github.com/remcostoeten/snippets.remcostoeten). :heartpulse:
