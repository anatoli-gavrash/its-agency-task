import { deleteAsync } from 'del';

const clean = () => deleteAsync('./public/**');

export default clean;