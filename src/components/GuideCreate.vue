<template>
	<main class="guide-create-container">
		<header><bread-crumb /></header>
		<section class="guide-create vertical-centered">
			<header class="guide-create-header">
				<div class="title">New Guide</div>
				<div class="info">Posting as {{ user }}</div>
			</header>

			<form method="post" @submit.prevent="submitGuide" class="guide-creation-form vertical-centered">
				<input type="text" name="guide-name" v-model="name" placeholder="Guide name" class="guide-name">
				<input type="text" name="guide-title" v-model="title" placeholder="Title" >
				<Split class="guide-body-splitter" :gutterSize="2">
					<SplitArea :size="50">
						<textarea class="guide-body-input" name="guide-body" v-model="body" placeholder="Share your knowledge!"></textarea>
					</SplitArea>
					<SplitArea :size="50">
						<div class="guide-body-preview" v-html="md_body"></div>
					</SplitArea>
				</Split>
				<button type="submit" :disabled="form_error.length > 0">Submit</button>
			</form>
			<div class="form-error" v-if="form_error.length > 0">
				<ul>
					<li v-for="(error, index) in form_error" :key="index">{{ error }}</li>
				</ul>
			</div>
			<div class="alert alert-warning response-error" v-if="res !== undefined"><div>Error status {{ res.status }}</div><div>{{ res.message == 11000 ? `A guide with that name or title already exists!` : res.message }}</div></div>
		</section>
	</main>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import axios, { AxiosResponse } from 'axios';
import BreadCrumb from './BreadCrumb.vue';
import marked from 'marked';
import Cookies from 'js-cookie';
import { standardPurify } from 'lib/html_util';

@Component({
	components: {
		BreadCrumb
	}
})
export default class GuideCreate extends Vue {
	name: string = ``;
	title: string = ``;
	body: string = ``;
	res_error: { status: number, message: string } = {
		status: 0,
		message: ``
	};

	beforeCreate () {
		if (Cookies.get(`user_name`) === undefined) {
			this.$router.go(-1);
		}
	}

	get res () {
		if (this.res_error.status !== 0 && this.res_error.status !== 200) {
			return this.res_error;
		}
	}

	get user (): string {
		return Cookies.get(`user_name`) || ``;
	}

	get sanitized (): boolean {
		return standardPurify(marked(this.body)) === marked(this.body);
	}

	get md_body (): string {
		return standardPurify(marked(this.body));
	}

	get form_error (): Array<string> {
		const errs: Array<string> = [];
		if (this.name.length === 0) {
			errs.push(`Guide must have a name`);
		}
		if (this.name === `create`) {
			errs.push(`Invalid name '${this.name}'`);
		}
		if (this.title.length === 0) {
			errs.push(`Guide must have a title`);
		}
		if (this.body.length === 0) {
			errs.push(`Guide must have some content`);
		}
		if (!this.sanitized || /<script>/gm.test(this.body)) {
			errs.push(`Guide body contains illegal HTML`);
		}
		return errs;
	}

	async submitGuide () {
		const payload = {
			name: this.name,
			slug: this.name.split(``).map(c => c.replace(/\s+/gm, `-`)).join(``),
			title: this.title,
			body: standardPurify(this.body)
		};
		try {
			const res = await axios.post(`${process.env.VUE_APP_API_URI}/guide/create`, payload, { withCredentials: true });
			this.$router.push(`/guide/${payload.slug}`);
		} catch (err) {
			this.res_error = {
				status: err.response.status,
				message: err.response.data
			};
		}
	}
};
</script>

<style lang="scss" scoped>
@import "styles/_variables";
@import "styles/_mixins";
@import "styles/article-standard";
.guide-create-container {
	.guide-create-header {
		@include vertical-centered();
		* {
			margin: 0;
		}
		.title {
			font-size: 2em;
			margin-bottom: 0.2em;
		}

		.info {
			font-size: 0.9em;
		}
	}

	.guide-create {
		margin-bottom: 2em;
	}

	.guide-creation-form {
		width: 70vw;

		input {
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

		.guide-body-splitter {
			height: 45vh;
		}

		.guide-body-input {
			resize: none;
			height: 100%;
			width: 100%;
			border: 2px solid $balcora-highlight-gray;
			border-right: none;
			font-family: "Menlo", "Liberation Mono", "Consolas", "DejaVu Sans Mono", "Ubuntu Mono", "Courier New", "andale mono", "lucida console", monospace;
		}

		.guide-body-preview {
			color: $balcora-content-white;
			background-color: $balcora-dark-gray;
			border: 2px solid $balcora-highlight-gray;
			border-left: none;
			border-radius: 3px;
			padding: 0.3em 10px 0.3em 10px;
			width: 100%;
			height: 100%;
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
	.response-error {
		@include vertical-centered();
	}
}
</style>

<style lang="scss">
@import "styles/_variables";
.split {
	resize: vertical;
	.split {
		resize: none;
	}
}
.gutter {
	background: $balcora-highlight-gray !important; // jeez
}
</style>
