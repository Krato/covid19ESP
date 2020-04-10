const extensionsUsingCSS = ['vue', 'html'];

module.exports = {
    plugins: {
        tailwindcss: {},
        'vue-cli-plugin-tailwind/purgecss': {
        	content: [
        		`./@(public|src)/**/*.@(${extensionsUsingCSS.join('|')})`,
        		`./node_modules/vue-good-table/src/**/*.vue`
    		],
        	whitelistPatterns: [
        		/^vgt-/,
        		/vgt-$/,
        		/^vgt-$/,
        		/^tooltip$/
        	],
        },
    },
};
