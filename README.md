# NPM Build Scripts

Build site using NPM scripts without Gulp or Grunt.

## Stack

### Client

- [jQuery](https://jquery.com/) - Kicking it old school
- [Modernizr](https://modernizr.com) - Browser feature detection (touch-events)

### Development

- [Handlebars](https://handlebarsjs.com/) - JavaScript based HTML template engine
- [Eleventy](https://www.11ty.io/) - Generate static HTML files using Handlebars templates
- [Webpack](https://webpack.github.io) - Automatic JavaScript common module chunk bundling and tree shaking
- [Babel](https://babeljs.io/) - Use the latest ECMAScript features
- [ESLint](http://eslint.org/) - Catch JavaScript syntax and style issues
- [Sass](http://sass-lang.com/) - Easier CSS dev with variables, nesting, partials, import, mixins, inheritance, and operators
- [PostCSS](http://postcss.org/) - Add vendor prefixes to CSS
- [BrowserSync](https://www.browsersync.io/) - Serve local dev files and live reload changes

## Project Structure

- **dist** - Files compiled by the NPM build pipeline
- **src** - Files that will pass through the NPM build pipeline and be output in the `dist` directory
	- **_partials** - Reusable Handlebars template partials (e.g. header, footer)
		- **layouts** - Layout templates
		- **svgs** - SVGs to be included inline
	- **fonts** - Copied over to the `dist` directory
	- **images** - Copied over to the `dist` directory
	- **scripts** - Scripts will be compiled with Webpack. See `webpack.config.js` for more details
		- `index.js` - File is the entrypoint for webpack and will be built to `/dist/js/index.js`
	- **styles** - Sass files in the root of this folder will end up in `dist/css`
- `dotfiles` - Various configs for the different parts of the stack

## Get Started

1. Install [Node v6.9+](https://nodejs.org/en/) globally if you don't have it already
1. Clone or download this repo
1. Using terminal change directories to the project root `cd /path/to/npm-build-scripts`
1. Install dependencies by running `npm install`
1. Run any of the available commands found below `npm run <command-name>`

## Commands


#### `build`

```
"npm run clean && npm-run-all build:assets build:html build:sass build:autoprefixer \"build:js -- --mode production\" asset-cache-bust"
```

- Clean out the `dist` directory
- Run all the `build` commands
- Run `build:js` in `production` mode

#### `dev`

```
"npm run clean && npm-run-all --parallel watch serve"
```

- Cleans out the `dist` directory
- Runs the `watch` and `serve` commands in parallel.

### `clean`

```
"rimraf dist && mkdir dist"
```

- Remove the `dist` directory
- Create a new, empty `dist` directory.

#### `watch`

```
"npm-run-all --parallel \"build:* -- --watch\""
```

- Run all the commands that start with `build:` and pass the `--watch` flag through

#### `serve`

```
"browser-sync start --server dist --files dist --no-ghost-mode --no-open"
```

- Serve all files in the `dist` directory
- Can be viewed at [http://localhost:3000/](http://localhost:3000/)
- Watch files and automatically sync and live-reload any changes
- Don't sync event's like scrolling (ghost mode)
- Don't automatically open the browser window

#### `build:assets`

```
"cpx \"src/**/*.!(hbs|scss|js)\" dist"
```

- Copy all the files from the `src` to `dist` directory
- Ignore files that are `.hbs`, `.scss`, or `.js`.
- Optionally watch the files for changes

#### `build:html`

```
"eleventy --config=eleventy.config.js"
```

- Use the `eleventy` library to compile all handlebar files (`.hbs`) into HTML files in the `dist` directory
- See `eleventy.config.js` for more details and the [Eleventy docs](https://www.11ty.io/docs/config/) for all the options
- Optionally watch the files for changes

#### `build:sass`

```
"node-sass-chokidar src/styles/ --source-map dist/css --output .temp --output-style compressed"
```

- Transpile `.scss` files from `src/styles` to `.temp` directory (where they will be autoprefixed)
- Output sourcemaps to `dist/css`
- Compress the output
- Optionally watch the files for changes

#### `build:autoprefixer`

```
"postcss .temp/*.css --use autoprefixer --dir dist/css"
```

- Add vendor prefixes to `.css` files in the `.temp` directory
- Output files to the `dist` directory
- Optionally watch the files for changes

#### `build:lint`

```
"esw src/scripts/{,**/}*.js"
```

- Lint the `.js` files in the `src/scripts` directory using ESLint
- Optionally watch the files for changes

#### `build:js`

```
"webpack"
```

- Compile all `.js` files from `src/scripts` using Babel and Webpack
- Optionally watch the files for changes
- See the `webpack.config.js` file for more details

#### `bust-cache`

```
"asset-cache-bust \"dist/**/*html\" --asset-root dist --verbose"
```

- Append a hash url parameter to CSS and JS links to bust the cache

## Development Workflow

1. Go through the [Get Started steps](#get-started) if you haven't already.
1. Using terminal change directories to the project root `cd /path/to/npm-build-scripts`
1. Run `npm run dev` in terminal.
1. View the site at [http://localhost:3000/](http://localhost:3000/)
1. Start editing files
1. BrowserSync will automatically reload CSS or refresh the page when other files changes.

### Static assets

Any static files in the `src` directory that are not `.hbs`, `.js`, or `.css` will automatically be copied over to the `dist` directory.

### JavaScript

You can use ES6 and use both relative imports or import libraries from npm.

#### Modernizr

You can use Modernizr to check if a device supports touch events or not.

```javascript
if (Modernizr.touchevents) {
  console.log('touch events');
} else {
  console.log('no touch events');
}
```

### CSS

Any SASS file ine the `src/styles/` folder will get compiled with [Sass](http://sass-lang.com/) and have vendor prefixes added using [PostCSS Next](http://cssnext.io/) then moved to
to `/dist/css/{filename}.css`. Import statements will be resolved as part of the build.

#### Modernizr

Modernizr will add CSS classes to the `<html>` tag showing if the device supports touch events on not.

```html
<html class="touchevents">
```

```html
<html class="no-touchevents">
```

### HTML

#### Front Matter

Meta data for a page found at the top of the markdown file in [YAML syntax](https://learnxinyminutes.com/docs/yaml/).

Locally assigned front matter values override things further up the layout chain

```
---
layout: "layouts/default.hbs"
title: "Example"
---
```

- **layout** - Path to the Handlebars layout template. (Relative to the `src/_partials` directory)
- **title** - The title for the page. Will be added to the `<title>` tag in the `<head>`

See the [Eleventy Documentation](https://www.11ty.io/docs/data/) for all the default keys. You can also add your own custom keys.

Data can then be used in the page like so:

```
<h1>{{title}}<h1>
```

#### Partials

Handlebar partials are stored in the `src/_partials` directory and must end with `.hbs`.

They can be used like so:

```handlebars
{{> my-partial }}
```

Where `my-partial` is the name of the file. E.g. `src/_partials/my-partial.hbs`.

You can pass data to a partial using key/value pairs:

```handlebars
{{> my-partial someKey="Some Value" }}
```

Then inside the partial you can use it like so:

```handlebars
// src/_partials/my-partial.hbs
<div class="my-partial">
  {{someKey}}
</div>
```

#### SVG Partials

Inline SVGs are treated just like any other partial and require the file name to end in `.hbs` and can be stored in the `src/_partials/svgs` directory.

You can then add them by using:

```handlebars
{{> svgs/arrow }}
```

To add a class to your SVG:

```handlebars
// in template
{{> svgs/arrow class="example-class"}}

// in svg partial
<svg class="{{ class }}">...</svg>
```

## Production Workflow

1. Using terminal change directories to the project root `cd /path/to/npm-build-scripts`
1. Run `npm run build` in terminal.
1. Do what you want with the production ready code in the `dist` directory.





