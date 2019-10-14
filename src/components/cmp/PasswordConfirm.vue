<template>
    <article class="password-confirm-modal-container">
        <form @submit.prevent="loginUser" class="login-user-form" method="post">
            <label for="user-pass">Password:</label>
            <input class="user-pass" name="user-pass" type="password" v-model="pass">
			<div class="actions">
				<button class="cancel" type="button" @click="cancel">Cancel</button>
				<button :disabled="form_error.length > 0" class="user-login" type="submit">Login</button>
			</div>
        </form>
        <div class="form-error" v-if="form_error.length > 0">
            <ul>
                <li :key="index" v-for="(error, index) in form_error">{{ error }}</li>
            </ul>
        </div>
		<div class="form-error" v-if="response_error">{{ response_error }}</div>
    </article>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import Axios from 'axios';
import Cookies from 'js-cookie';
import { validatePassword } from 'lib/string_util';

@Component({})
export default class PasswordConfirm extends Vue {
	pass: string = ``;
	response_error = ``;

	get form_error () {
		return validatePassword(this.pass, {
			length: 1,
			alpha: false,
			numeric: false,
			special: false,
			whitespace: false
		});
	}

	async mounted () {
		try {
			await Axios.get(`${process.env.VUE_APP_API_URI}/user/validate`);
		} catch (err) {
			console.log(`Invalid session (${err.message})`);
			window.location.href = `/`;
		}
	}

	cancel () {
		console.log(`cancelling`);
		this.$parent.$emit(`modal_cancel`);
	}

	async loginUser () {
		const payload = {
			name: Cookies.get(`user_name`),
			pass: this.pass
		};
		try {
			const response = await Axios.post(`${process.env.VUE_APP_API_URI}/user/passcheck`, payload, { withCredentials: true });
			if (response.status === 200) {
				this.$parent.$emit(`valid_password`);
				this.pass = ``;
			} else {
				throw new Error(`Unknown frontend error when attempting to login.`);
			}
			this.response_error = ``;
		} catch (err) {
			if (err.response.status === 401) {
				this.response_error = `Invalid password!`;
			} else {
				this.response_error = err.message;
			}
		}
	}
};
</script>

<style lang="scss" scoped>
@import "styles/_variables";
@import "styles/_mixins";
.password-confirm-modal-container {
	background-color: scale-color($color: $balcora-base-gray, $alpha: -10%);
	border: 1px solid $balcora-orange;
	border-radius: 4px;
	padding: 20px;
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

		.actions {
			display: flex;
			flex-direction: row;

			* {
				margin-left: 0.6em;
				margin-right: 0.6em;
			}
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
