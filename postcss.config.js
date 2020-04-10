module.exports = {
    plugins: {
        tailwindcss: {},
        'vue-cli-plugin-tailwind/purgecss': {
        	whitelistPatterns: [
        		/^vgt-/,
        		/^tooltip$/
        	],
        },
    },
};
