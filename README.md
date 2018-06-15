Lets Comunica Angular Framework Core
=============

This repository was organized within the [AngularJS 1.4.1](https://docs.angularjs.org/api) framework. This repo covers all the core functionalities that our company front-end projects basically needs.

Author: Lets Comunica

E-mail: fabio@letscomunica.com.br

**LAST VERSION: 0.0.8**

Installation
=====

Install in you angular project:

```bash
  npm install --save git+ssh://git@bitbucket.org/letscomunicadev/angular-framework-core.git#v0.0.8
```

Updates
=====

Made a modification? Test it at least in one project before submiting a version. It still needs unit testing and CI with projects. After everything seems perfectly up-to-date, run the following steps:

1\. Commit and push your updates using Let's Bitbucket credentials

2\. Change and commit a new tag version (always check and update the last version here and in package.json):

```bash
$ git tag -a vX.X.X -m "version_message"
```

3\. Push the new tag version to remote repository:

```bash
$ git push origin vX.X.X  # Version needs to be the same from commit
```

4\. Run npm installation with the newest version:

```bash
  npm install --save git+ssh://git@bitbucket.org/letscomunicadev/angular-framework-core.git#vX.X.X
```

Todo
----------
1\. Convert ng-includes from URL images to directives (in order to access templates from inside this module)

2\. Start gulp automation to render all src files to single lets-angular-framework-core.module.js in a minified version

3\. Separate input types in different directives

4\. Isolate scope to vm and change all scope parents and childs access

History
----------

**v0.0.8**

[09/06/18] Started repository
