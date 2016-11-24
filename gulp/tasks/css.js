/*
 Compile LESS files, and generate sourcemaps.
 */

var CONFIG = require("../config");
var gulp = require("gulp");
var _ = require("lodash");
var less = require("gulp-less");
var AutoPrefixer = require("less-plugin-autoprefix");
var sourcemaps = require("gulp-sourcemaps");
var rename = require("gulp-rename");
var nameResolver = require("../util/nameResolver");
var pathResolver = require("../util/pathResolver");
var logger = require("../util/compileLogger");

var subtasks = CONFIG.tasks.css.files;
var autoprefix = new AutoPrefixer(CONFIG.tasks.css.autoprefixer);

const cssResolver = nameResolver.bind(null, 'css');

_.forOwn(subtasks, function (task, name) {
    var dest = CONFIG.root.dest;
    var taskPath = pathResolver.commonPaths(task.src, task.dest, CONFIG.root.src, CONFIG.root.dest);

    gulp.task(cssResolver(name), function (cb) {
        var srcs = gulp.src(pathResolver.flattenPaths([pathResolver.anyPath(taskPath.src.dir)]));

        return srcs
            .pipe(sourcemaps.init())
            .pipe(less({
                plugins: [autoprefix],
                relativeUrls: true
            }))
            .on('error', logger.pipeError.bind(null, cb))
            .pipe(sourcemaps.write())
            .pipe(rename(task.dest))
            .pipe(gulp.dest(dest));
    });
});

/*
 Main CSS task
 */
gulp.task('css', Object.keys(subtasks).map(cssResolver));
