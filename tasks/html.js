import gulp from 'gulp';
import htmlmin from 'gulp-htmlmin';

const {src, dest} = gulp;

const html = () => {
  return src('./src/**.html')
    .pipe(htmlmin({
      collapseWhitespace: true
    }))
    .pipe(dest('./public'));
};

export default html;