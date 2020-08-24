# Maintenance Notice:

This project was started as a volunteer effort by a group of people in Indianapolis, IN. After two years of working on it, it became harder and harder to pull in and retain talent to work on it consistently. Though there were passionate individuals interested, many lived an hour or more away and couldn't meet in person weekly to work on it. Attempts were made to work remotely, but efforts languished. Years have passed with little work on this project. Though we had big plans, higher priorities have won out. The last release of Koa11y still works as a basic reporting tool, however the built in A11y guidelines are already out of date. The project remains online, for others to reference or fork. the released version may not be compatible with the latest Unix based OS's that do not prioritize backwards compatibility.

* * *

<img src="http://open-indy.github.io/Koa11y/_img/wordmark.png" alt="Koa11y Logo">

# Koa11y

### Koa11y is a desktop app that allows you to automatically detect accessibility (a11y) issues on webpages.

<p align="center"><img src="http://open-indy.github.io/Koa11y/_img/screenshot-win.png" alt="Screenshot of Koa11y"></p>

To download Koa11y, visit the website:

* http://open-indy.github.io/Koa11y

* * *

Koa11y is built with:

* [Pa11y](http://pa11y.org)
* [NW.js](http://nwjs.io)
* [Vue.js](http://vuejs.org)
* [jQuery](http://jquery.com)
* [Sass](http://sass-lang.com)
* [Bootstrap](http://getbootstrap.com)
* [Bootswatch (Flatly)](https://bootswatch.com/flatly)
* [nw-contextmenu](https://github.com/b1rdex/nw-contextmenu)

* * *

# Development/Code Contributing

Koa11y is written in JavaScript, Sass, and HTML. It uses [NW.js](http://docs.nwjs.io/en/latest) to interact with the OS and to be cross-platform.

## To Open Dev Tools in Koa11y

* Right-Click on the logo in the app.

## To run source code locally (Win/OSX)

1. Install [Node](http://nodejs.org) (V4.0.0 or above)
1. Download or clone this repo
1. Run `npm install`
1. Run `npm start`

## To run source code locally (Ubuntu)

1. Download or Clone this repo and go to it in the terminal.
1. Update apt-get: `sudo apt-get update`
1. Install Node.js: `sudo apt-get install nodejs`
1. Install NPM: `sudo apt-get install npm`
1. Create a symbolic link for node `sudo ln -s /usr/bin/nodejs /usr/bin/node`
1. Run `node -v` to check if you have a version of Node that is 4.0.0 or above, if not, [consult this](https://nodejs.org/en/download/package-manager).
1. Download dependencies: `npm install`
1. Run the app: `npm start`

If that works, then in the future you can just run `npm start` to run the app, the rest is all setup.
