module.exports = {
    pluginOptions: {
        svgLoader: {
            svgo: {
                plugins: [
                ]
            },
            removeTags: false
        }
    },
    configureWebpack: {
		externals: function (context, request, callback) {
			if (/xlsx|canvg|pdfmake/.test(request)) {
			return callback(null, "commonjs " + request);
			}
			callback();
		}
	}
}
