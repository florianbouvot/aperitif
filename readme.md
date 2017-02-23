# Aperitif

Aperitif is a boilerplate for web projects.

* Sass support
* Compile Twig templates (+ data)
* Create SVG icons sprite
* Minify and concatenate CSS, JS and images
* Server with live-reloading and cross-device synchronization

## Getting Started

*Prerequisites : [Node.js](https://nodejs.org/) and [Gulp](http://gulpjs.com/)*

### 1. Download or clone this repository

### 2. Install dependencies

```
$ npm install
```

### 3. Run gulp

Serve, watch for changes and automatically refresh across devices.

```
$ gulp dev
```

Build current project, ready for test or deployment.

```
$ gulp build
```

#### Others commands

* `gulp css`: Sass, Autoprefixer, CSSnano
* `gulp js`: Concat and Uglify
* `gulp html`: Load data from `data.json` and compile Twig templates
* `gulp images`: Compression with imagemin
* `gulp sprites`: Auto-generated SVG sprite from `.svg` icons
* `gulp clean`: Delete `dist` folder
* `gulp serve`: BrowserSync server
* `gulp watch`: Watch source files

## License

MIT © [Florian Bouvot](https://github.com/florianbouvot)
