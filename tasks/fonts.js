import gulp from 'gulp';

const {src, dest} = gulp;

const fonts = () => {
  return src('./src/fonts/**', {encoding: false})
    .pipe(dest('./public/fonts'));
};

export default fonts;