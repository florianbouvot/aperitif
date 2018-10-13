# Aperitif

Aperitif is a boilerplate for web projects.

* Compile Sass into CSS
* Compile Twig templates (+ json data)
* Minify and concatenate CSS, JS and optimize images
* Create SVG icons sprite
* Copy fonts files
* Built-in HTTP Server with live-reload and cross-device synchronization

## Getting Started

*Prerequisites : [Node.js](https://nodejs.org/) and [Gulp](http://gulpjs.com/)*

### 1. Clone or download this repository

### 2. Install dependencies

```
$ npm install
``` 

or

```
$ yarn install
```

### 3. Run gulp

Serve, watch for changes and automatically refresh across devices.

```
$ gulp
```

Build current project, ready for test or deployment.

```
$ gulp build
```

#### Others commands

* `gulp css`: Sass, Autoprefixer, CSSnano
* `gulp css-vendor`: Copy and convert `*.css` files to `*.scss`
* `gulp js`: Concat and Uglify
* `gulp html`: Load data from `data.json` and compile Twig templates
* `gulp images`: Compression with imagemin
* `gulp sprites`: Auto-generated SVG sprite from `.svg` icons
* `gulp fonts`: Copy fonts files
* `gulp clean`: Delete `dist` folder
* `gulp serve`: BrowserSync server with live-reload and cross-device synchronization

## License

MIT © [Florian Bouvot](https://github.com/florianbouvot)
