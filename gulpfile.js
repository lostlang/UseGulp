const { series, parallel, watch, src, dest } = require('gulp')
const pug = require('gulp-pug')
const rename = require('gulp-rename')
const browserSync = require('browser-sync').create()

const paths = {
    pug: {
        src: 'src/**/*.pug',
    },
    build: {
        html: 'build'
    },
    dev: {
        html: 'dev'
    }
}

// Last dir name
function lastDirName(dirName){
    array = dirName.split('\\')
    return array[array.length - 1]
}


// Pug 

function pugBuild() {
    return src(paths.pug.src)
        .pipe(
            pug({
            })
        )
        .pipe(
            rename(
                (path) => {
                    return {
                      dirname: '',
                      basename: lastDirName(path.dirname),
                      extname: '.html'
                    }
                }
            )
        )
        .pipe(
            dest(paths.build.html)
        )
}

function pugDev() {
    return src(paths.pug.src)
        .pipe(
            pug({
                pretty:true
            })
        )
        .pipe(
            rename(
                (path) => {
                    return {
                      dirname: '',
                      basename: lastDirName(path.dirname),
                      extname: '.html'
                    }
                }
            )
        )
        .pipe(
            dest(paths.dev.html)
        )
        .pipe(
            browserSync.stream()
        )
}

// Watch

function watcher(){
    watch(paths.pug.src, pugDev)
}

// Server
function server(){
    browserSync.init({
            server: {
                baseDir: paths.dev.html,
            },
            notify: false
        }
    )
}

const dev = series (
    pugDev
)

exports.default = series(
    dev,
    parallel(
        watcher,
        server
    )
)
