# Contribution
## Introduction

It is assumed that you know a little about node.js, git and threejs. If not, [here's some help to get started with git](https://help.github.com/en/github/using-git) and [here’s some help to get started with node.js.](https://nodejs.org/en/docs/guides/getting-started-guide/). For threejs you can visit [threejs.org](https://threejs.org/).

* Install [Node.js](https://nodejs.org/)
* Install [Git](https://git-scm.com/)
* [Fork](https://help.github.com/en/github/getting-started-with-github/fork-a-repo) Astra Solaris
* Open your OS’s terminal
* Change into the directory you’d like
* Clone your forked repo

      git clone https://github.com/[yourgithubname]/AstraSolaris.git

* Go into the AstraSolaris directory.
        
      cd ./AstraSolaris

* Install the dependencies

      npm install

## Next Steps

As per the npm standard, ‘start’ is the place to begin the package.

    npm start

This script will start a local server similar to [astrasolaris.org](https://www.astrasolaris.org/), but instead will be hosted on your local machine. Browse to http://localhost:5000/ to check it out.


If you’d like to make a minified version of the build files i.e. ‘build/astra.js’ run:
        
    npm run build

Build files are generated from src directory.

## Making changes

When you’ve decided to make changes, start with the following:

* Update your local repo
        
      git pull https://github.com/SEscobedo/AstraSolaris.git
      git push

* Make a new branch from the dev branch
        
      git checkout dev
      git branch [mychangesbranch]
      git checkout [mychangesbranch]

* Add your changes to your commit.
* Push the changes to your forked repo.
* Open a Pull Request (PR)

## Important notes:

* Don't include any build files to your commit.
* Making changes may require changes to the documentation. To update the docs in other languages, simply copy the English to begin with. Put tranlated site and documentation in a directory at site/[nameoflanguage].
* it's good to also add an example and screenshot for it, for showing how it's used and for end-to-end testing.
* If you add some assets for the examples (models, textures, sounds, etc), make sure they have a proper license allowing for their use here, less restrictive the better. It is unlikely for large assets to be accepted.
* If some issue is relevant to patch / feature, please mention it with hash (e.g. #9) in a commit message to get cross-reference in GitHub.
* The html file of all new projects using three.js will be located at app/gallery directory. javascript code for this projects will be stored in src directory.
* Once done with a patch / feature do not add more commits to a feature branch
* Create separate branches per patch or feature.
* If you make a PR but it is not actually ready to be pulled into the dev branch then please [convert it to a draft PR](https://docs.github.com/en/github/collaborating-with-issues-and-pull-requests/changing-the-stage-of-a-pull-request#converting-a-pull-request-to-a-draft).

This project is currently contributed to mostly via everyone's spare time. Please keep that in mind as it may take some time for the appropriate feedback to get to you. If you are unsure about adding a new feature, it might be better to ask first to see whether other people think it's a good idea. You can do this at github discussions https://github.com/SEscobedo/AstraSolaris/discussions.
