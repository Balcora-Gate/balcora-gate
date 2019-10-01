import Vue from 'vue';
import VueRouter from 'vue-router';
import BootstrapVue from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import Cookies from 'js-cookie';

import App from './App.vue';

import EntityDisplay from './components/EntityDisplay.vue';
import BalcoraArticle from './components/BalcoraArticle.vue';
import GuideIndex from './components/GuidesIndex.vue';
import GuideShow from './components/GuideShow.vue';
import GuideCreate from './components/GuideCreate.vue';
import UserCreate from './components/UserCreate.vue';
import UserLogin from './components/UserLogin.vue';
import Split from 'vue-split-panel';

Vue.config.productionTip = false;
Vue.use(VueRouter);
Vue.use(BootstrapVue);
Vue.use(Split);

const router = new VueRouter({
	routes: [
		{
			path: `/`,
			component: BalcoraArticle
		},
		{
			path: `/data`,
			component: EntityDisplay
		},
		{
			path: `/guide`,
			component: GuideIndex,
			meta: {
				middleware: () => {
					console.log(document.cookie);
				}
			}
		},
		{
			path: `/guide/create`,
			component: GuideCreate,
			beforeEnter: (to, from, next) => {
				// const cookies = document.cookie.split(`;`).reduce((acc: {[key: string]: string}, kv_pair: string) => {
				// 	const [key, val] = kv_pair.split(`=`);
				// 	acc[key] = val;
				// 	return acc;
				// }, {});
				// console.log(cookies);
				const getCookie = (name: string) => {
					const v = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
					return v ? v[2] : null;
				};
				console.log(getCookie(`user_name`));
				getCookie(`user_name`) ? next() : next(false);
			}
		},
		{
			path: `/guide/:slug`,
			component: GuideShow
		},
		{
			path: `/user/register`,
			component: UserCreate
		},
		{
			path: `/user/login`,
			component: UserLogin,
			beforeEnter: (to, from, next) => {
				Cookies.get(`user_name`) ? next(false) : next();
			}
		}
	]
});

new Vue({
	router: router,
	render: h => h(App)
}).$mount('#app');
