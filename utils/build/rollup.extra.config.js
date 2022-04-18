import path from 'path';
import glob from 'glob';
import fs from 'fs';
import { files } from './rollup.examples.config';

const rootFolder = path.resolve( __dirname, '../../' );
const jsmFolder = path.resolve( __dirname, '../../examples/jsm' );
const outputPath = path.resolve( jsmFolder, 'three-extras.js' );

const makeFakeEntry = ( dependencies ) => {

	const dir = path.resolve( rootFolder, '.esmcache' );
	const file = path.resolve( dir, 'index.js' );
	if ( ! fs.existsSync( dir ) ) {

		fs.mkdirSync( dir );

	}

	let content = '';
	for ( const dependency of dependencies ) {

		content += `export * from "${path.join( jsmFolder, dependency )}"\n`;

	}

	fs.writeFileSync( file, content );
	return file;

};

const file = makeFakeEntry( files );


export default {

	input: file,
	treeshake: false,
	minify: false, // moved to compile time instead so output can be controlled
	external: ( a )=>{

		if ( a.includes( 'three.module.js' ) ) {

			return true;

		}

	},
	// external: () => true, // don't bundle anything
	plugins: [],
	output: {
		format: 'esm',
		file: outputPath,
	}
};
