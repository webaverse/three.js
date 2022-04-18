import path from 'path';
import glob from 'glob';
import fs from 'fs';

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

const files = glob.sync( '**/*.js', { cwd: jsmFolder, ignore: [
	// don't convert libs
	'libs/**/*',
	'loaders/ifc/**/*',
	'three-extras.js',
	// no non-module library
	// https://unpkg.com/browse/@webxr-input-profiles/motion-controllers@1.0.0/dist/
	'webxr/**/*',

	// no non-module library
	// https://unpkg.com/browse/web-ifc@0.0.17/
	'loaders/IFCLoader.js',

	'renderers/webgl/**/*',
	'renderers/webgpu/**/*',
	'renderers/nodes/**/*',
	'nodes/**/*',
	'loaders/NodeMaterialLoader.js',
	'offscreen/**/*',
] } );

console.log( files );

const file = makeFakeEntry( files );


export default {

	input: file,
	treeshake: true,
	minify: true,
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
