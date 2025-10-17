import { writeFileSync } from 'fs';
import { join } from 'path';

const nojekyllPath = join(process.cwd(), 'dist', '.nojekyll');
writeFileSync(nojekyllPath, '', 'utf8');
console.log('✓ .nojekyll file created');
