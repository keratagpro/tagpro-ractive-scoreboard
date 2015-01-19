Kera's Tagpro Scoreboard Userscript
====================

How to develop further:

1. Install NodeJS
2. Install Gulp Globally
```
npm install -g gulp
```
3. Install npm dependencies from `package.json`
```
npm install
```
4. Run Gulp + Watchify
```
gulp watch
```
5. Start writing code in the "src/" directory.

### Create the userscript file
```
gulp dist
```
This runs Browserify to get a `bundle.js`, uglifies it, adds a userscript header file (`userscript-header.txt`) in front of it and copies it to `dist/tagpro-scoreboard.user.js`.

### Publish the example page
```
gulp gh-pages
```
