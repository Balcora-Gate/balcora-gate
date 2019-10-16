import Vue from 'vue';
import VueRouter from 'vue-router';
import { CollapsePlugin } from 'bootstrap-vue/src/components/collapse';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import Cookies from 'js-cookie';
import Axios from 'axios';

import App from './App.vue';

import EntityDisplay from './components/EntityDisplay.vue';
import EntityDiff from './components/EntityDiff.vue';
import BalcoraArticle from './components/BalcoraArticle.vue';
import GuideIndex from './components/GuidesIndex.vue';
import GuideShow from './components/GuideShow.vue';
import GuideCreate from './components/GuideCreate.vue';
import GuideEdit from './components/GuideEdit.vue';
import UserCreate from './components/UserCreate.vue';
import UserLogin from './components/UserLogin.vue';
import Split from 'vue-split-panel';
import VueHighlightJS from 'vue-highlight.js';

Vue.config.productionTip = false;
Vue.use(VueRouter);
Vue.use(CollapsePlugin);
Vue.use(Split);
Vue.use(VueHighlightJS);

const router = new VueRouter({
	routes: [
		{
			path: `/`,
			component: BalcoraArticle
		},
		{
			path: `/data/reference`,
			component: EntityDisplay
		},
		{
			path: `/data/diff`,
			component: EntityDiff
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
				console.log(Cookies.get(`user_name`) !== undefined);
				Cookies.get(`user_name`) !== undefined ? next() : next(false);
			}
		},
		{
			path: `/guide/:slug/edit`,
			component: GuideEdit,
			beforeEnter: async (to, from, next) => {
				const user_name = Cookies.get(`user_name`);
				const guide_poster = (await Axios.get(`${process.env.VUE_APP_API_URI}/guide?slug=${to.params.slug}`)).data[0].user;
				console.log(user_name);
				console.log(guide_poster);
				if (user_name === guide_poster) {
					next();
				} else {
					next(false);
				}
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
