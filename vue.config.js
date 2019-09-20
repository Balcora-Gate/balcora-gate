module.exports = {
	devServer: {
		proxy: {
			'/': {
				target: 'http://localhost:8080',
				ws: false
			}
		}
	},
	configureWebpack: {
		resolve: {
			alias: {
				styles: '@/styles',
				lib: '@/js'
			}
		}
	}
};
