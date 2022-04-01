# webpack-handlebars-static-file-generator

Setup for creating websites with ES6, handlebars templates, SASS easily (including image optimization, multi-lingual, and more features).

## Build Tasks

We use webpack as our build tool for generating **dev** bundles as well as **live** bundles.

### Installation

All necessary development dependencies can be installed by executing the following command.

> npm install


### Configuration

Set default language in webpack.settings.js to define which language should be used for root path.

- defaultLanguage: 'de' (located in data/de.json)

### Available tasks

 1. **JS**: compiles ES6 to ES5 and uglifies the code
 2. **SASS**: compiles scss to css and uglifies the output
 3. **IMG**: optimies all images by compressing them
 4. **SVG**: generates spritemap from folder

|Command Line|Task description|
|--|--|
|`npm start`| starts webpack dev server |
|`npm run serve`| generates the production build for deployment |
|`npm run deploy`| deploys the project |

## Deploy

Duplicate **deploy.settings.sample.js** and name it **deploy.settings.js**. See https://github.com/simonh1000/ftp-deploy for more information.

## Questions

In case of questions ask https://digitalists.at
