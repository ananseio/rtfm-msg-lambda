import * as ps from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

const projRoot = path.resolve(__dirname, '..');

const pkg = JSON.parse(fs.readFileSync(path.resolve(projRoot, 'package.json')).toString());
pkg.main = 'index.js';
pkg.types = 'index.d.js';
delete pkg.private;
delete pkg.devDependencies;
pkg.dependencies = Object.assign(
  {},
  ...Object.keys(pkg.peerDependencies || {})
    .map(dep => ({ [dep]: pkg.dependencies[dep] }))
);
delete pkg.peerDependencies;

const publicPkgPath = path.resolve(projRoot, 'dist/public/package.json');
fs.writeFileSync(publicPkgPath, JSON.stringify(pkg, null, 2));

process.chdir(path.resolve(projRoot, 'dist/public'));
const { status } = ps.spawnSync('npm', ['publish'], { stdio: 'inherit' });

fs.unlinkSync(publicPkgPath);
process.exit(status);
