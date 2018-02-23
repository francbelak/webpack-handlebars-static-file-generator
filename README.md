# webpack-handlebars-static-file-generator

Setup for creating websites with ES6, handlebars templates, SASS easily (including image optimization, multi-lingual, and more features).

## Build Tasks

We use webpack as our build tool for generating **dev** bundles as well as **live** bundles.

### Installation

All necessary development dependencies can be installed by executing the following command.

> npm install


### Configuration

Duplicate **webpack.settings.sample.js** and name it **webpack.settings.js**. Make necessary settings there.

- absRefPrefix
 - dev: path to development setup (use "" empty string for relative handling)
 - live: path to live setup (use "" empty string for relative handling)
- reload (LiveReloadPlugin options)
 - protocol: http or https
 - port: free port for live reloading
 - hostname: you can use localhost
 - appendScriptTag: true (to automatically ad script tag)


### Available tasks

 1. **JS**: compiles ES6 to ES5 and uglifies the code
 2. **SASS**: compiles scss to css and uglifies the output
 3. **IMG**: optimies all images by compressing them
 4. **SVG**: generates spritemap from folder

|Command Line|Task description|
|--|--|
|`npm run dev`| starts the watch task for development (supports auto-reload) |
|`npm run dev-debug`| does not watch - execute development debug build without watcher |
|`npm run production`| generates the production build with local absRefPrefix |
|`npm run live`| generates the production build for deployment |

## Deploy

Duplicate **deploy.settings.sample.js** and name it **deploy.settings.js**. See https://github.com/simonh1000/ftp-deploy for more information.
