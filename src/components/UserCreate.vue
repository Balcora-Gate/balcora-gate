<template>
	<main class="user-create-container">
		<header><bread-crumb /></header>
		<section class="user-create">
			<header>Register</header>
			<form @submit.prevent="submitUser" method="post" class="create-user-form">
				<label for="user-name">Name:</label>
				<input type="text" name="user-name" class="user-name" v-model="name">
				<label for="user-email">Email:</label>
				<input type="email" name="user-email" class="user-email" v-model="email">
				<label for="user-pass">Password:</label>
				<input type="password" name="user-pass" class="user-pass" v-model="pass">
				<button type="submit" class="user-submit" :disabled="form_error.length > 0">Register</button>
			</form>
			<div class="form-error" v-if="form_error.length > 0">
				<ul>
					<li v-for="(error, index) in form_error" :key="index">{{ error }}</li>
				</ul>
			</div>
		</section>
	</main>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import Axios, { AxiosResponse } from 'axios';
import BreadCrumb from './cmp/BreadCrumb.vue';
import { validatePassword } from '../js/string_util';

@Component({
	components: {
		BreadCrumb
	}
})
export default class UserCreate extends Vue {
	name: string = ``;
	pass: string = ``;
	email: string = ``;
	join_date?: Date;
	response?: AxiosResponse;

	get form_error (): Array<string> {
		const errs: Array<string> = [];
		if (!this.name || this.name.length === 0) {
			errs.push(`Username is required`);
		}
		if (!this.pass || this.pass.length === 0) {
			errs.push(`Password is required`);
		} else {
			const pass_errs = validatePassword(this.pass);
			if (pass_errs.length > 0) {
				errs.push(...pass_errs);
			}
		}
		if (!this.email || this.email.length === 0) {
			errs.push(`Email is required`);
		}
		return errs;
	}

	async submitUser () {
		const payload = {
			name: this.name,
			pass: this.pass,
			email: this.email,
			join_date: new Date().toISOString()
		};
		try {
			const response = await Axios.post(`${process.env.VUE_APP_API_URI}/user/create`, payload, { withCredentials: true });
			if (response.status === 200) {
				window.location.href = `/`;
			} else {
				throw new Error(`Unknown frontend error when attempting to login.`);
			}
		} catch (err) {
			console.log(`error: ${err.message}`);
		}
	}
};
</script>

<style lang="scss" scoped>
@import "styles/_mixins";
.user-create {
	header {
		font-size: 1.6em;
		margin: 1em 0 0 0;
	}
	@include vertical-centered();
	.create-user-form {
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
