<template>
	<header id="navbar-container">
		<nav class="nav">
			<ul>
			<router-link to="/" class="navbar-logo-container"><img src="@/assets/balcora-logo-small.png" alt="BALCORA" class="navbar-logo"/></router-link>
			<a href="/" class="n-link">Home</a>
			<a v-if="false" href="#" class="n-link">2.3 Changelogs</a>
			<!-- <a href="#">Guides</a> -->
			<router-link to="/guide" class="n-link">Guides</router-link>
			<!-- <a href="/data">Game Info</a> -->
			<router-link to="/data/reference" class="n-link">Data lookup</router-link>
			<div class="right-links" v-if="user && user.length !== 0">
				<a href="#">{{ user }}</a>
				<a href="javascript:void(0);" @click="logoutUser">Logout</a>
			</div>
			<div class="right-links" v-else>
				<router-link to="/user/login">Login</router-link>
				<router-link to="/user/register">Register</router-link>
			</div>
			</ul>
		</nav>
	</header>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component, Prop, Watch } from 'vue-property-decorator';
import { allCookies } from 'lib/cookie_util';
import Axios from 'axios';
import Cookies from 'js-cookie';
import Dropdown from '../cmp/Dropdown.vue';
// @ts-ignore
import DropdownItem from '../cmp/DropdownItem.vue';

@Component({
	components: {
		Dropdown,
		DropdownItem
	}
})
export default class NavBar extends Vue {
	get user () {
		return Cookies.get(`user_name`);
	}

	async logoutUser () {
		const response = await Axios.post(`${process.env.VUE_APP_API_URI}/user/logout`, {}, { withCredentials: true });
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

<style lang="scss">
@import "styles/_variables";
@import "styles/menu_items";
#navbar-container {
	border-bottom: 4px solid $balcora-orange;
	height: 60px;
	display: flex;
	justify-content: center;
	align-items: center;
	background-color: $balcora-highlight-gray;

	nav {
		height: 100%;
	}

	nav > ul {
		background: none;
		display: flex;
		flex-direction: row;
		justify-content: left;
		align-items: center;
		height: 100%;
		max-width: 100%;
		width: 80vw;
		font-size: 1.2rem;
		list-style: none;

		.n-link {
			margin: 0.5em;
			padding-right: 1em;
			text-transform: uppercase;
			border-right: 1px solid $balcora-content-white;
			color: $balcora-content-white;
			max-height: 80%;
			width: auto;

			&.dd-container {
				width: 9em;
				.dd-head {
					color: $balcora-content-white;
				}
				.dd-content {
					text-transform: none;
					width: calc(10em + 1px);
					left: calc(-1em - 1px);
					top: 1.2em;
					padding-top: 2em;
				}
			}
		}

		.navbar-logo-container {
			border: none;
			.navbar-logo {
				max-height: 3rem;
			}
			margin-right: 1em;
		}

		.right-links {
			margin-left: auto;
			display: flex;
			flex-direction: row;
			* {
				margin-right: 1em;
			}
		}
	}
}
</style>
