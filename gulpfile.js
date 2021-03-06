const {series, parallel, watch, src, dest} = require('gulp');
const browserSync = require('browser-sync').create();
const rename = require('gulp-rename');
const pug = require('gulp-pug');
const sass = require('gulp-sass')(require('sass'));

const paths = {
  src: {
    pug: 'src/pug/**/*.pug',
    sass: 'src/sass/**/*.sass',
    img: 'src/**/*.{png,jpg}',
  },
  main: {
    pug: 'src/**/index.pug',
    sass: 'src/**/main.sass',
  },
  build: 'build',
  dev: 'dev',
};

// Get last dir name
function lastDirName(dirName) {
  array = dirName.split('\\');
  return array[array.length - 1];
}

// Pug
function pugBuild() {
  return src(paths.main.pug)
      .pipe(pug({}))
      .pipe(
          rename((path) => {
            return {
              dirname: '',
              basename: lastDirName(path.dirname),
              extname: '.html',
            };
          }),
      )
      .pipe(dest(paths.build));
}

function pugDev() {
  return src(paths.main.pug)
      .pipe(
          pug({
            pretty: true,
          }),
      )
      .pipe(
          rename((path) => {
            return {
              dirname: '',
              basename: lastDirName(path.dirname),
              extname: '.html',
            };
          }),
      )
      .pipe(dest(paths.dev))
      .pipe(browserSync.stream());
}

// Sass
function sassDev() {
  return src(paths.main.sass)
      .pipe(sass())
      .pipe(
          rename({
            dirname: '',
            basename: 'main',
            extname: '.css',
          }),
      )
      .pipe(dest(paths.dev))
      .pipe(browserSync.stream());
}

// Image
function imageDev() {
  return src(paths.src.img)
      .pipe(dest(paths.dev))
      .pipe(browserSync.stream());
}

// Watch
function watcher() {
  watch(paths.src.pug, pugDev);
  watch(paths.src.sass, sassDev);
  watch(paths.src.img, imageDev);
}

// Server
function server() {
  browserSync.init({
    server: {
      baseDir: paths.dev,
    },
    notify: false,
  });
}

const dev = parallel(pugDev, sassDev, imageDev);

const build = parallel(pugBuild);

exports.dev = series(dev, parallel(watcher, server));

exports.build = series(build);
