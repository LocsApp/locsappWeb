var gulp = require('gulp'),
    rename = require('gulp-rename'),     // Renommage des fichiers
    sass = require('gulp-sass'),       // Conversion des SCSS en CSS
    minifyCss = require('gulp-minify-css'), // Minification des CSS
    uglify = require('gulp-uglify');     // Minification/Obfuscation des JS
    jade = require("gulp-jade");


gulp.task('css', function () {
    return gulp.src('./static/stylesheets/sass/*.scss')    // Prend en entrée les fichiers *.scss
        .pipe(sass())                      // Compile les fichiers
        .pipe(minifyCss())                 // Minifie le CSS qui a été généré
        .pipe(gulp.dest('./static/stylesheets/css/'));  // Sauvegarde le tout dans /src/style
});

gulp.task('js-uglify', function () {
    return gulp.src('./static/js/*.src.js')    // Prend en entrée les fichiers *.src.js
        .pipe(rename(function (path) {
            // Il y a différentes méthodes pour renommer les fichiers
            // Voir ici pour plus d'infos : https://www.npmjs.org/package/gulp-rename
            path.basename = path.basename.replace(".src", ".min");
        }))
        .pipe(uglify())
        .pipe(gulp.dest('./static/js/'));
});



gulp.task('templates', function() {
  var YOUR_LOCALS = {};

  gulp.src('./templates/*.jade')
    .pipe(jade({
      locals: YOUR_LOCALS
    }))
    .pipe(gulp.dest('./templates/'))
});

gulp.task('watch', function () {
    gulp.watch('./static/stylesheets/sass/*.scss', ['css']);
    gulp.watch('./static/js/*.src.js', ['js-uglify']);
    gulp.watch('./templates/*.jade', ['templates']);

});