import { cleanDir } from './lib/fs';

/**
 * Cleans up the output (build) directory.
 */
const clean = () =>
  cleanDir('build/*', {
    nosort: true,
    dot: true,
    ignore: ['build/.git'],
  });

export default clean;
