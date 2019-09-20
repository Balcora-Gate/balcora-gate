import Vue from 'vue';
import VueRouter from 'vue-router';
import BootstrapVue from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import App from './App.vue';
import EntityDisplay from './components/EntityDisplay.vue';
import BalcoraArticle from './components/BalcoraArticle.vue';
const router = new VueRouter({
	routes: [
		{
			path: `/`,
			component: BalcoraArticle
		},
		{
			path: `/data`,
			component: EntityDisplay
		}
	]
});
Vue.config.productionTip = false;
Vue.use(VueRouter);
Vue.use(BootstrapVue);
new Vue({
	router: router,
	render: h => h(App)
}).$mount('#app');
// # sourceMappingURL=main.js.map
