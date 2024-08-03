import gulp from 'gulp';
import minify from 'gulp-minify';

const {src, dest} = gulp;

const js = () => {
  return src('./src/js/**')
    .pipe(minify({
      ext: {
        min: '.js'
      },
      noSource: true
    }))
    .pipe(dest('./public/js'));
};

export default js;