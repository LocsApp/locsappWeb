var gulp = require('gulp'),
    rename = require('gulp-rename'),     // Renommage des fichiers
    sass = require('gulp-sass'),       // Conversion des SCSS en CSS
    minifyCss = require('gulp-minify-css'), // Minification des CSS
    uglify = require('gulp-uglify'),     // Minification/Obfuscation des JS
    plumber = require('gulp-plumber'),    // Ne pas s'arrêter en cas d'erreurs
    livereload = require('gulp-livereload');
jade = require("gulp-jade");


gulp.task('css', function () {
    return gulp.src('./static/stylesheets/*.scss')    // Prend en entrée les fichiers *.scss
        .pipe(plumber())
        .pipe(sass())                      // Compile les fichiers
        .pipe(minifyCss())                 // Minifie le CSS qui a été généré
        .pipe(gulp.dest('../prod/static/stylesheets/'))  // Sauvegarde le tout dans /src/style
        .pipe(livereload());
});


gulp.task('js', function () {
    return gulp.src(['./static/js/*.src.js', './static/js/**/**/*.src.js'])    // Prend en entrée les fichiers *.src.js
        .pipe(plumber())
        .pipe(rename(function (path) {
            // Il y a différentes méthodes pour renommer les fichiers
            // Voir ici pour plus d'infos : https://www.npmjs.org/package/gulp-rename
            path.basename = path.basename.replace(".src", ".min");
        }))
        .pipe(uglify())
        .pipe(gulp.dest('../prod/static/js/'))
        .pipe(livereload());
});


gulp.task('templates', function () {
    var YOUR_LOCALS = {};

    gulp.src(['./static/templates/*.jade'])
        .pipe(plumber())
        .pipe(jade({
            locals: YOUR_LOCALS
        }))
        .pipe(gulp.dest('../prod/static/templates/'))
        .pipe(livereload());
});


gulp.task('default', function() {
    livereload({start: true});
    livereload.listen();

    gulp.watch('./static/stylesheets/*.scss', ['css']);
    gulp.watch(['./static/js/*.src.js', './static/js/**/**/*.src.js'], ['js']);
    gulp.watch('./static/templates/*.jade', ['templates']);
});

