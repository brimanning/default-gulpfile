var gulp = require('gulp');
var coffee = require('gulp-coffee');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var haml = require('gulp-haml');
var bower = require('gulp-bower');
var minifyCss = require('gulp-minify-css');
var del = require('del');

var jsfiles = [
  'bower_components/jquery/dist/jquery.js',
  'tmp/js/application.js'
]

var cachebuster = (new Date()).getTime()

function showError (error) {
  console.log(error.toString());
  this.emit('end');
}

gulp.task('clean', function() {
  del(['public/**/*.html', 'public/**/*.js', 'public/**/*.css']);
});

gulp.task('bower', function() { 
  return bower()
    .pipe(gulp.dest('./bower_components')) 
    .on('error', showError)
})

gulp.task('buildjs', ['clean'], function() {
  return gulp.src('src/coffee/**/*.coffee')
    .pipe(coffee())
    .pipe(concat('application.js'))
    .pipe(gulp.dest('./tmp/js'))
    .on('error', showError)
})

gulp.task('combinejs', ['bower', 'buildjs'], function() {
  return gulp.src(jsfiles)
    .pipe(uglify())
    .pipe(concat('index-' + cachebuster + '.js'))
    .pipe(gulp.dest('./public/js'))
    .on('error', showError)
})

gulp.task('buildcss', ['clean'], function() {
  return gulp.src('src/sass/example.scss')
    .pipe(sass())
    .pipe(minifyCss())
    .pipe(concat('index-' + cachebuster + '.css'))
    .pipe(gulp.dest('./public/css'))
    .on('error', showError)
})

gulp.task('buildhaml', function() {
  return gulp.src('src/haml/**/*.haml')
    .pipe(haml({
      compilerOpts: {
        locals: { cachebuster: cachebuster }
      }
    }))
    .pipe(gulp.dest('./public'))
    .on('error', showError)
})

gulp.task('build', ['buildhaml', 'combinejs', 'buildcss'])

gulp.task('watch', function() {
  gulp.watch(['src/coffee/**/*.coffee', 'src/sass/**/*.scss', 'src/haml/**/*.haml'], ['build']);
});

gulp.task('default', ['build']);
