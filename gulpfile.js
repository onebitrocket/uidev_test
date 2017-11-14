//////////////////////////////////////////////////////////////////////////////////////////
//  LOAD MODULES
//////////////////////////////////////////////////////////////////////////////////////////
var gulp = require('gulp'),
$ = require('gulp-load-plugins')();


//////////////////////////////////////////////////////////////////////////////////////////
//  SET GLOBALS
//////////////////////////////////////////////////////////////////////////////////////////
var buildname = 'mypersonalself',
  stylesheetname = 'styles',
  mainJsFile = 'main',
  source = './source/',
  build = './build/';

//////////////////////////////////////////////////////////////////////////////////////////
//  PLUMBER ERROR HANDLING
//////////////////////////////////////////////////////////////////////////////////////////
var plumberErrorHandler = { errorHandler: $.notify.onError({
    title: 'Gulp',
    message: 'Error: <%= error.message %>'
  })
};

//////////////////////////////////////////////////////////////////////////////////////////
//  LOADED
//////////////////////////////////////////////////////////////////////////////////////////
gulp.task('loaded', function () {
  console.log($);
});


//////////////////////////////////////////////////////////////////////////////////////////
//  JS
//////////////////////////////////////////////////////////////////////////////////////////
gulp.task('js', function () {

  // fallback vendor head js
  gulp.src('./bower.json')
  .pipe($.plumber(plumberErrorHandler))
  .pipe($.mainBowerFiles('**/*.js', {
    includeDev: 'exclusive',
    group: 'fallback'
  }))
  .pipe($.concat('fallback.js'))
  .pipe($.uglify())
  .pipe($.rename({
    suffix: ".min",
  }))
  .pipe(gulp.dest(build  + 'js'))


  return gulp.src([source + 'js/**/' + mainJsFile + '.js'])
  .pipe($.plumber(plumberErrorHandler))
  .pipe($.concat(mainJsFile + '.js'))
  .pipe($.uglify())
  .pipe($.rename({
    suffix: ".min",
  }))
  .pipe(gulp.dest(build  + 'js'))

});

//////////////////////////////////////////////////////////////////////////////////////////
//  LESS to CSS
//////////////////////////////////////////////////////////////////////////////////////////
gulp.task('less', function () {

  return gulp.src(source + 'less/less.less')
  .pipe($.plumber(plumberErrorHandler))
  .pipe($.less())
  .pipe($.concat(stylesheetname + '.css'))
  .pipe($.rename({
    basename: stylesheetname,
    suffix: '.min',
  }))
  .pipe($.pixrem({
    replace: false, atrules: true, html: true
  }))
  .pipe($.autoprefixer({
    browsers: ['last 22 versions'],
    cascade: false
  }))
  .pipe($.combineMq())
  .pipe($.cleanCss({
    inline: ['remote'],
    keepBreaks: false,
    advanced: false,
    aggressiveMerging: false
  }))
  .pipe(gulp.dest(build + 'css'))

});


//////////////////////////////////////////////////////////////////////////////////////////
//  HTML
//////////////////////////////////////////////////////////////////////////////////////////

// REGEX EXTRACT STRING
function extractTitle( str ){
  var ret = "";
  if ( /"/.test( str ) ){
    ret = str.match( /<title>(.*)<\/title>/ )[1];
  } else {
    ret = str;
  }
  return ret;
}
// CUSTOM HANDLER FOR GULP-INLINE-SOURCE - REPLACES SVG <TITLE> VALUE WITH SVG TITLE ATTR VALUE
var sourceTitle = function(source, context, next) {
  if (source.fileContent
    && !source.content
    && (source.type == 'image')) {
      var svgTitleTag = (extractTitle( source.fileContent ).length > 0) ? extractTitle( source.fileContent ) : '' ;
        source.fileContent = source.fileContent.replace(svgTitleTag , source.attributes.title );
       next();
  } else {
    next();
  }
}

gulp.task('html', function() {
  liveSource = [source + '**/*.+(html)', '!' + source + '[partials]/*.+(html)'];
  return gulp.src(liveSource)
    .pipe($.plumber(plumberErrorHandler))
    .pipe($.injectPartials({
        removeTags: true
    }))
    .pipe($.inlineSource({
      rootpath: source,
      handlers: sourceTitle
    }))
    .pipe(gulp.dest(build))
});


//////////////////////////////////////////////////////////////////////////////////////////
//  IMAGES
//////////////////////////////////////////////////////////////////////////////////////////
gulp.task('images', function() {

  return gulp.src(source + 'images/**/*.+(png|jpg|jpeg|gif)')
    .pipe($.plumber(plumberErrorHandler))
    .pipe(gulp.dest(build + 'images'))
});

//////////////////////////////////////////////////////////////////////////////////////////
//  SPRITES
//////////////////////////////////////////////////////////////////////////////////////////
gulp.task('sprites', function() {

  return gulp.src(source + 'svgs/**/*.svg')
  .pipe($.plumber(plumberErrorHandler))
  .pipe($.svg2png())
  .pipe($.rename({
    extname: '.png'
  }))
  .pipe(gulp.dest(build + 'images/ui'))
});

//////////////////////////////////////////////////////////////////////////////////////////
//  WATCH
//////////////////////////////////////////////////////////////////////////////////////////
gulp.task('watch', ['tasks'], function() {
  gulp.watch(source + 'less/**/*.less', ['less']);
  gulp.watch(source + 'js/**/*.js', ['js']);
  gulp.watch(source + '**/*.+(html)', ['html']);
  gulp.watch(source + 'images/**/*.+(png|jpg|jpeg|gif)', ['images']);
  gulp.watch(source + 'svgs/**/*.+(svg)', ['sprites']);
});

//////////////////////////////////////////////////////////////////////////////////////////
//  TASKS
//////////////////////////////////////////////////////////////////////////////////////////
gulp.task('tasks', ['js','less','html','images','sprites'], function() {
  console.log('gulp build tasks done');
});


//////////////////////////////////////////////////////////////////////////////////////////
//  DEFAULT
//////////////////////////////////////////////////////////////////////////////////////////
gulp.task('default', ['watch', 'tasks'], function() {
  console.log('gulp default task done');
});
