<template>
	<section class="user-login-container">
		<header>Login</header>
		<form @submit.prevent="loginUser" method="post" class="login-user-form">
			<label for="user-name">Name:</label>
			<input type="text" name="user-name" class="user-name" v-model="name">
			<label for="user-pass">Password:</label>
			<input type="password" name="user-pass" class="user-pass" v-model="pass">
			<button type="submit" class="user-login" :disabled="form_error.length > 0">Login</button>
		</form>
		<div class="form-error" v-if="form_error.length > 0">
			<ul>
				<li v-for="(error, index) in form_error" :key="index">{{ error }}</li>
			</ul>
		</div>
	</section>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import Axios, { AxiosResponse } from 'axios';
import { allCookies } from 'lib/cookie_util';

@Component({})
export default class UserLogin extends Vue {
	name: string = ``;
	pass: string = ``;
	response?: AxiosResponse;

	get form_error (): Array<string> {
		const errs: Array<string> = [];
		if (!this.name || this.name.length === 0) {
			errs.push(`Username is required`);
		}
		if (!this.pass || this.pass.length === 0) {
			errs.push(`Password is required`);
		}
		return errs;
	}

	async loginUser () {
		const payload = {
			name: this.name,
			pass: this.pass
		};
		this.response = await Axios.post(`${process.env.VUE_APP_API_URI}/user/login`, payload, { withCredentials: true });
		if (this.response!.status === 200) {
			window.location.href = `/`;
		}
	}
};
</script>

<style lang="scss" scoped>
@import "styles/_mixins";
.user-login-container {
	header {
		font-size: 1.6em;
		margin: 1em 0 0 0;
	}
	@include vertical-centered();
	.login-user-form {
		width: 30vw;
		min-width: 20em;
		@include vertical-centered();

		label {
			margin-right: 100%;
			margin-left: auto;
		}
		input {
			margin-bottom: 1em;
			min-width: 15em;
		}
	}
	.form-error {
		border: 2px solid darkred;
		background-color: rgba(lighten(red, 15%), 0.5);
		border-radius: 3px;
		padding: 1em;
		* {
			margin: 0;
			padding: 0;
			list-style: none;
		}
	}
}
</style>
