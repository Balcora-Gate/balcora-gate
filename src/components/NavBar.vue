<template>
	<header>
		<nav>
			<router-link to="/" class="navbar-logo-container"><img src="@/assets/balcora-logo-small.png" alt="BALCORA" class="navbar-logo"/></router-link>
			<a href="/">Home</a>
			<a href="#">2.3 Changelogs</a>
			<!-- <a href="#">Guides</a> -->
			<router-link to="/guide">Guides</router-link>
			<!-- <a href="/data">Game Info</a> -->
			<router-link to="/data">Game Info</router-link>
			<div class="right-links" v-if="user && user.length !== 0">
				<a href="#">{{ user }}</a>
				<a href="javascript:void(0);" @click="logoutUser">Logout</a>
			</div>
			<div class="right-links" v-else>
				<router-link to="/user/login">Login</router-link>
			</div>
		</nav>
	</header>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component, Prop, Watch } from 'vue-property-decorator';
import { allCookies } from 'lib/cookie_util';
import Axios from 'axios';
import Cookies from 'js-cookie';

@Component({})
export default class NavBar extends Vue {
	get user () {
		console.log(Cookies.get(`user_name`));
		return Cookies.get(`user_name`);
	}

	@Watch(`user`, { immediate: true, deep: true }) w (new_val: string, old_val: string) {
		console.log(`oh shit: ${new_val}`);
	}

	async logoutUser () {
		const response = await Axios.post(`${process.env.VUE_APP_API_URI}/user/logout`, {}, { withCredentials: true });
		console.log(response);
		if (response.status === 200) {
			const eraseCookieFromAllPaths = (name: string) => {
				// This function will attempt to remove a cookie from all paths.
				const pathBits = location.pathname.split('/');
				let pathCurrent = ' path=';

				// do a simple pathless delete first.
				document.cookie = name + '=; expires=Thu, 01-Jan-1970 00:00:01 GMT;';

				for (let i = 0; i < pathBits.length; i++) {
					pathCurrent += ((pathCurrent.substr(-1) !== '/') ? '/' : '') + pathBits[i];
					document.cookie = name + '=; expires=Thu, 01-Jan-1970 00:00:01 GMT;' + pathCurrent + ';';
				}
			};
			for (const cookie of Object.keys(allCookies())) {
				eraseCookieFromAllPaths(cookie);
			}
			window.location.href = `/`;
		}
	}
}
</script>

<style lang="scss" scoped>
@import "styles/_variables";
header {
	border-bottom: 4px solid $balcora-orange;
	height: 4rem;
	display: flex;
	justify-content: center;
	align-items: center;
	background-color: $balcora-highlight-gray;
}

header nav {
	background: none;
	display: flex;
	flex-direction: row;
	justify-content: left;
	align-items: center;
	height: 100%;
	max-width: 100%;
	width: 80vw;
	font-size: 1.2rem;
}

header nav > a {
	margin: 0.5em;
	padding-right: 1rem;
	text-transform: uppercase;
	border-right: 1px solid $balcora-content-white;
	color: $balcora-content-white;
	max-height: 80%;
	width: auto;
}

.navbar-logo-container {
	border: none;
	.navbar-logo {
		max-height: 3rem;
	}
}

.right-links {
	margin-left: auto;
	display: flex;
	flex-direction: row;
	* {
		margin-right: 1em;
	}
}
</style>
