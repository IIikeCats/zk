/*
 * @Author: mikey.zhaopeng 
 * @Date: 2019-02-18 08:50:25 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2019-02-18 10:00:23
 */

var gulp = require('gulp');
var sass = require('gulp-sass');
var server = require('gulp-webserver')
var zip = require('gulp-clean-css')
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var htmlmin = require('gulp-htmlmin');
var imagemin = require('gulp-imagemin');

var fs = require('fs'),
    path = require('path'),
    url = require('url');

//编译scss
gulp.task('cssa', function() {
    return gulp.src('./src/scss/**/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('./src/css'))
})

//监听
gulp.task('auto', function() {
    gulp.watch('./src/scss/**/*.scss', gulp.series('cssa'))
})

//服务
gulp.task('res', function() {
    return gulp.src('src')
        .pipe(server({
            open: true,
            middleware: function(req, res, next) {
                var pathname = url.parse(req.url).pathname;
                if (pathname === '/favicon.ico') {
                    return res.end('')
                } else {
                    pathname = pathname === '/' ? 'index.html' : pathname;
                    res.end(fs.readFileSync(path.join(__dirname, 'src', pathname)))
                }
            }
        }))
})

//压缩
gulp.task('zips', function() {
    return gulp.src('./src/css/**/*.css')
        .pipe(zip())
        .pipe(gulp.dest('./dist/css'))
})

//js
gulp.task('zipjs', function() {
    return gulp.src('./src/js/**/*.js')
        .pipe(uglify())
        .pipe(concat('all.js')) //合并
        .pipe(gulp.dest('./dist/js'))
})

//html
gulp.task('htmls', function() {
    return gulp.src('./src/**/*.html')
        .pipe(htmlmin())
        .pipe(gulp.dest('./dist'))
})