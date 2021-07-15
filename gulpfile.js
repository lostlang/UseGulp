const {series, parallel, watch, src, dest} = require('gulp');
const browserSync = require('browser-sync').create();
const rename = require('gulp-rename');
const pug = require('gulp-pug');
const sass = require('gulp-sass')(require('sass'));

const paths = {
  src: {
    pug: 'src/**/*.pug',
    sass: 'src/**/*.sass',
  },
  main: {
    pug: 'src/**/index.pug',
    sass: 'src/**/main.sass',
  },
  build: 'build',
  dev: 'dev',
};

/**
 * Get last dir name
 * @param {string} dirName directory file
 * @return {string} last directory
 */
function lastDirName(dirName) {
  array = dirName.split('\\');
  return array[array.length - 1];
};


// Pug
/**
 * Build pug files to html (prod)
 * @return {any} pipeline
 */
function pugBuild() {
  return src(paths.main.pug)
      .pipe(
          pug({
          }),
      )
      .pipe(
          rename(
              (path) => {
                return {
                  dirname: '',
                  basename: lastDirName(path.dirname),
                  extname: '.html',
                };
              },
          ),
      )
      .pipe(
          dest(paths.build),
      );
};

/**
 * Build pug files to html (dev)
 * @return {any} pipeline
 */
function pugDev() {
  return src(paths.main.pug)
      .pipe(
          pug({
            pretty: true,
          },
          ),
      )
      .pipe(
          rename(
              (path) => {
                return {
                  dirname: '',
                  basename: lastDirName(path.dirname),
                  extname: '.html',
                };
              },
          ),
      )
      .pipe(
          dest(paths.dev),
      )
      .pipe(
          browserSync.stream(),
      );
};

// Sass
/**
 * Build sass files to html (dev)
 * @return {any} pipeline
 */
function sassDev() {
  return src(paths.main.sass)
      .pipe(
          sass(),
      )
      .pipe(
          rename(
              {
                dirname: '',
                basename: 'main',
                extname: '.css',
              },
          ),
      )
      .pipe(
          dest(paths.dev),
      )
      .pipe(
          browserSync.stream(),
      );
};

// Watch
/**
 * Watcher for file
 */
function watcher() {
  watch(paths.src.pug, pugDev);
  watch(paths.src.sass, sassDev);
};

// Server
/**
 * Live reload browser
 */
function server() {
  browserSync.init({
    server: {
      baseDir: paths.dev,
    },
    notify: false,
  },
  );
};

const dev = parallel(
    pugDev,
    sassDev,
);

const build = parallel(
    pugBuild,
);

exports.dev = series(
    dev,
    parallel(
        watcher,
        server,
    ),
);

exports.build = series(
    build,
);
