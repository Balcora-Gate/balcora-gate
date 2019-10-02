const gulp = require('gulp');
const sass = require('gulp-sass');

const src_path = `./public/stylesheets/src/*.scss`;
const dest_path = `./public/stylesheets`;

gulp.task('sass', function (done) {
	gulp.src(src_path)
		.pipe(sass())
		.pipe(gulp.dest(dest_path));
	done();

});

gulp.task('watch', function () {
	gulp.watch(src_path, gulp.series(['sass']));
});

gulp.task('default', gulp.series(['sass']));