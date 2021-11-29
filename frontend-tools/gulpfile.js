// a nice shorthand eg dest instead of gulp.dest 
const { src,dest,watch,series,task, parallel }  = require('gulp');
const sass                            = require('gulp-sass')(require('sass'));
const postcss                         = require('gulp-postcss');
const cssnano                         = require('cssnano');
//const purgecss                        = require('gulp-purgecss');
//const { default: gulpPurgecss }       = require('gulp-purgecss');
const terser                          = require('gulp-terser');
//const rename                          = require('gulp-rename');
//const concat                          = require('gulp-concat');

const { spawn }                       = require('child_process');
const del                             = require('del');
const browsersync                     = require('browser-sync').create();

const debug                           = require('gulp-debug');


/////////////// Tasks, Part 1 - CSS processing

// Compile SASS to CSS
function scssTask() {
    return src(
            'theme_resources/scss/theme.scss', 
            { sourcemaps: true, allowEmpty: true}
        )
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss([cssnano()]))
        .pipe(dest('build', { sourcemaps: '.'}));
}
task('scssTask', scssTask);

// Deliver all CSS  to Pelican static assets
function deliverCssTask() {
    return src([
        // vendor items
        // vanilla Bootstrap 5
        'node_modules/bootstrap/dist/css/bootstrap.min.css',
        // Bootswatch versions
        'node_modules/bootswatch/dist/*/bootstrap.min.css',
        // our craft
        'build/theme.css',
        ],
        { sourcemaps: true }
    )
    //.pipe(debug())
    .pipe(dest('../static/assets/css', { sourcemaps: '.'}));
}
task('deliverCssTask', deliverCssTask);


/////////////// Tasks, Part 2 - JS processing

// JS minify
function jsMinifyTask() {
    return src(
            'theme_resources/js/theme.js', 
            { sourcemaps: true,  allowEmpty: true }
        )
        .pipe(terser())
        .pipe(dest('build', { sourcemaps: '.'}));
}
task('jsMinifyTask', jsMinifyTask);

// Deliver all JS  to Pelican static assets directory
function deliverJsTask() {
    return src([
        // vendor items
        // vanilla Bootstrap
        'node_modules/bootstrap/dist/js/bootstrap.bundle.min.js',
        // our craft
        'build/*.js',
        ],
        { sourcemaps: true }
        )
    .pipe(dest('../static/assets/js', { sourcemaps: '.'}));
}
task('deliverJsTask', deliverJsTask);


/////////////// Misc tasks

// clean output directories
function cleanTask() {
    // the ** glob matches the parent also, so
    // we need to exclude it explicitly 
    return del(
        [
            'build/**',
            '!build',
            '../static/assets/css/**', 
            '!../static/assets/css',
            '../static/assets/js/**', 
            '!../static/assets/js'
        ], { force:true });
}
task('cleanTask', cleanTask)

// BrowserSync tasks
// It is not a Gulp plugin, so we need to have 
// a callback to tell Gulp when is the task over
function browserSyncServeTask(cb) {
    browsersync.init(
        {
            server: {
                baseDir: '../../../output'
            }
        }
    );
    cb();
}
task('browserSyncServeTask', browserSyncServeTask);

function browserSyncReloadTask(cb) {
    browsersync.reload();
    cb();
}
task('browserSyncReloadTask', browserSyncReloadTask)

// Tell Gulp to look for changes 
// and do a rebuild and refresh the browser
function watchTask(cb) {

    // Pelican 
    // templates were changed
    // or content was changed
    // or site config was changed
    watch( 
        [
            '../templates/**', 
            '../../../content/**',
            '../../../pelicanconf.py',
        ],
        series(
            pelicanBuildTask,
            browserSyncReloadTask
        )
    );

    // Theme CSS was changed
    watch( ['theme_resources/scss/**/*.scss'],
        series(
            scssTask,
            deliverCssTask,
            pelicanBuildTask,
            browserSyncReloadTask
        )
    );

    // Theme JS was changed
    watch( ['theme_resources/js/**/*.js'],
        series(
            jsMinifyTask,
            deliverJsTask,
            pelicanBuildTask,
            browserSyncReloadTask
        )
    );

    cb();
}
task('watchTask', watchTask);


// A task to trigger Pelican rebuild process
function pelicanBuildTask() {
    return spawn(
        '../../../build.sh', 
        ['../../..', 'dummy_param_2'], 
        { stdio: 'inherit' }
    );
}
task('pelicanBuildTask', pelicanBuildTask);


// Deliver Bootstrap Icons
function deliverBSIconsTask() {
    return src(['node_modules/bootstrap-icons/**/*'], { "base" : "./node_modules" })
    .pipe(dest('../static/assets'));
}
task('deliverBSIconsTask', deliverBSIconsTask);

// create an unnamed task to run when gulp-cli is called without arguments
exports.default = series(
    cleanTask,
    parallel(
        deliverBSIconsTask,
        series(scssTask,deliverCssTask),
        series(jsMinifyTask,deliverJsTask),
    ),
    pelicanBuildTask,
    watchTask,
    browserSyncServeTask
);


/////////////// Future ideas


// // purge unused CSS - it depends on the contents of the generated site!
// function purgecssTask() {
//     return gulp.src('theme_resources/theme-bundle.css')
//         .pipe(rename('theme-bundle-min.css'))
//         .pipe(purgecss({
//             content: ['index.html'],
//             //css: ['resources/site-orig.css'],
//             //output: 'resources/site-min.css',
//             rejected: false,
// 
//             safelist: {
//                 standard: [],
//                 deep: [],
//                 greedy: [/slider/],
//                 keyframes: [],
//                 variables: []
//             }
//         }))
//         .pipe(gulp.dest('../static/assets'))
//         ;
// }

//gulp.task('revslider-sass', function () {
//    return gulp.src('resources/revslider-custom.scss')
//        //.pipe(concat('resources/revslider-custom.scss'))
//        .pipe(sass().on('error', sass.logError))
//        .pipe(gulp.dest('resources'))
//    ;
//});