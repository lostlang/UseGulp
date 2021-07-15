const { series, parallel, src, dest } = require('gulp')
const pug = require('gulp-pug')
const rename = require('gulp-rename')

const paths = {
    pug: {
        src: 'src/**/*.pug',
    },
    build: {
        pug: 'build'
    },
    dev: {
        pug: 'dev'
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
            dest(paths.build.pug)
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
            dest(paths.dev.pug)
        )
}

exports.dev = series(
    pugDev,
)
