<template>
	<section class="guide-create-container vertical-centered">
		<header class="guide-create-header">New Guide</header>

		<form method="post" @submit.prevent="submitGuide" class="guide-creation-form vertical-centered">
			<input type="text" name="guide-name" v-model="name" placeholder="Guide name" class="guide-name">
			<input type="text" name="guide-title" v-model="title" placeholder="Title" >
			<textarea name="guide-body" cols="30" rows="10" v-model="body" placeholder="Share your knowledge!"></textarea>
			<button type="submit" :disabled="form_error.length > 0">Submit</button>
		</form>
		<div class="form-error" v-if="form_error.length > 0">
			<ul>
				<li v-for="(error, index) in form_error" :key="index">{{ error }}</li>
			</ul>
		</div>
		<div class="alert alert-warning" v-if="res !== undefined">{{ res }}</div>
	</section>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import axios, { AxiosResponse } from 'axios';
@Component({})
export default class GuideCreate extends Vue {
	name: string = ``;
	title: string = ``;
	body: string = ``;
	res_error: AxiosResponse | undefined;

	get res (): AxiosResponse | undefined {
		if (this.res_error && this.res_error.status !== 200) {
			return this.res_error;
		}
	}

	get form_error (): Array<string> {
		const errs: Array<string> = [];
		if (this.name.length === 0) {
			errs.push(`Guide must have a name`);
		}
		if (this.title.length === 0) {
			errs.push(`Guide must have a title`);
		}
		if (this.body.length === 0) {
			errs.push(`Guide must have some content`);
		}
		return errs;
	}

	async submitGuide () {
		const payload = {
			name: this.name,
			slug: this.name.split(``).map(c => c.replace(/\s+/gm, `-`)).join(``),
			title: this.title,
			body: this.body
		};
		const res = await axios.post(`${process.env.VUE_APP_API_URI}/guide/create`, payload, { withCredentials: true });
		if (res.status !== 200) {
			this.res_error = res;
		} else {
			this.$router.push(`/guide/${payload.slug}`);
		}
	}
};
</script>

<style lang="scss" scoped>
@import "styles/_variables";
@import "styles/article-standard";
.guide-create-container {
	.guide-create-header {
		font-size: 1.6em;
		margin: 1em 0 0 0;
	}
	.guide-creation-form {

		input, textarea {
			width: 100%;
			border-color: $balcora-highlight-gray;
			margin-bottom: 0.5em;
		}

		button {
			margin-top: 1em;
		}

		.guide-name {
			width: 40%;
			margin-right: 100%;
			margin-left: auto;
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
