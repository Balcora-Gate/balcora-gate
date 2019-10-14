module.exports = {
	devServer: {
		proxy: {
			'/api/*': {
				target: 'http://localhost:4041'
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
