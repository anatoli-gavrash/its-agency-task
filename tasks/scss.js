import gulp from 'gulp';
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
import autoPrefixer from 'gulp-autoprefixer';
import csso from 'gulp-csso';

const {src, dest} = gulp;
const sass = gulpSass(dartSass);

const scss = () => {
  return src('./src/**.scss')
    .pipe(sass())
    .pipe(autoPrefixer({
      overrideBrowserslist: ['last 2 versions']
    }))
    .pipe(csso({ comments: false }))
    .pipe(dest('./public'));
};

export default scss;