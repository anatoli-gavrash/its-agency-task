import gulp from 'gulp';

const {src, dest} = gulp;

const images = () => {
  return src('./src/images/**', {encoding: false})
    .pipe(dest('./public/images'));
};

export default images;