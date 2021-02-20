import resolve from '@rollup/plugin-node-resolve'; // locate and bundle dependencies in node_modules (mandatory)
import { terser } from "rollup-plugin-terser"; // code minification (optional)

export default [{
	input: 'src/astra.js',
	output: [
		{
			format: 'umd',
			name: 'ASTRA',
			file: 'build/astra.js'
		}
	],
	plugins: [ resolve(), terser() ]
},
{
	input: 'src/orbital_elements.js',
	output: [
		{
			format: 'umd',
			name: 'ORB_ELEM',
			file: 'build/orbital_elements.js'
		}
	],
	plugins: [ resolve(), terser() ]
},
{
	input: 'src/bennu.js',
	output: [
		{
			format: 'umd',
			name: 'BENNU',
			file: 'build/bennu.js'
		}
	],
	plugins: [ resolve(), terser() ]
},
{
	input: 'src/planet_size_comp.js',
	output: [
		{
			format: 'umd',
			name: 'PLANETSIZE',
			file: 'build/planet_size_comp.js'
		}
	],
	plugins: [ resolve(), terser() ]
},
{
	input: 'src/sky.js',
	output: [
		{
			format: 'umd',
			name: 'SKY',
			file: 'build/sky.js'
		}
	],
	plugins: [ resolve(), terser() ]
},
{
	input: 'src/3d_periodictable.js',
	output: [
		{
			format: 'umd',
			name: 'PERIOD',
			file: 'build/3d_periodictable.js'
		}
	],
	plugins: [ resolve(), terser() ]
}
];
