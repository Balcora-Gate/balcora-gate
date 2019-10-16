<template>
	<div class="guide-editor">
		<header class="guide-create-header">
			<div class="title">{{ page_title }}</div>
			<div class="info">{{ page_action }} as {{ user }}</div>
		</header>
		<form method="post" @submit.prevent="submitGuide" class="guide-creation-form vertical-centered">
			<input type="text" name="guide-name" v-model="data_name" placeholder="Guide name" class="guide-name">
			<input type="text" name="guide-title" v-model="data_title" placeholder="Title">
			<Split class="guide-body-splitter" :gutterSize="2">
				<SplitArea :size="50">
					<textarea class="guide-body-input" name="guide-body" v-model="data_body" placeholder="Share your knowledge!"></textarea>
				</SplitArea>
				<SplitArea class="guide-body-preview" :size="50">
					<div v-html="mddata_body"></div>
				</SplitArea>
			</Split>
			<div class="form-group">
				<button type="button" @click="cancelEdit">Cancel</button>
				<button type="submit" :disabled="form_error.length > 0">Submit</button>
			</div>
		</form>
		<div class="form-error" v-if="form_error.length > 0">
			<ul>
				<li v-for="(error, index) in form_error" :key="index">{{ error }}</li>
			</ul>
		</div>
		<div class="alert alert-warning response-error" v-if="res !== undefined">
			<div>Error status {{ res.status }}</div>
			<div>{{ res.message == 11000 ? `A guide with that name or title already exists!` : res.message }}</div>
		</div>
	</div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import marked from 'marked';
import Cookies from 'js-cookie';
import { standardPurify, unescapeHtml } from 'lib/html_util';
import axios, { AxiosResponse } from 'axios';
import HLJS from 'highlight.js';
marked.setOptions({
	highlight: (code, lang) => {
		if (lang) return HLJS.highlight(lang, code).value;
		else return HLJS.highlightAuto(code).value;
	}
});

@Component({
})
export default class GuideEditor extends Vue {
	@Prop({
		default: ``
	}) name!: string;
	@Prop({
		default: ``
	}) title!: string;
	@Prop({
		default: ``
	}) body!: string;
	@Prop({
		required: true
	}) page_title!: string;
	@Prop({
		required: true
	}) page_action!: string;
	@Prop({
		required: true
	}) http_verb!: string;

	data_name: string = ``;
	data_title: string = ``;
	data_body: string = ``;
	res_error: { status: number, message: string } = {
		status: 0,
		message: ``
	};

	beforeCreate () {
		if (Cookies.get(`user_name`) === undefined) {
			this.$router.go(-1);
		}
	}

	mounted () {
		this.data_name = this.name;
		this.data_title = this.title;
		this.data_body = unescapeHtml(this.body);
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
		return standardPurify(marked(this.data_body)) === marked(this.data_body);
	}

	get mddata_body (): string {
		return standardPurify(marked(this.data_body));
	}

	get form_error (): Array<string> {
		const errs: Array<string> = [];
		if (this.data_name.length === 0) {
			errs.push(`Guide must have a name`);
		}
		if (this.data_name === `create`) {
			errs.push(`Invalid name '${this.data_name}'`);
		}
		if (this.data_title.length === 0) {
			errs.push(`Guide must have a title`);
		}
		if (this.data_body.length === 0) {
			errs.push(`Guide must have some content`);
		}
		if (/<script>/gm.test(this.data_body)) {
			errs.push(`Guide body contains illegal HTML`);
		}
		return errs;
	}

	cancelEdit () {
		this.$router.push(`/guide`);
	}

	async submitGuide () {
		console.log(`submitting guide`);
		const payload = {
			name: this.data_name,
			slug: this.data_name.split(``).map(c => c.replace(/\s+/gm, `-`)).join(``),
			title: this.data_title,
			body: standardPurify(this.data_body)
		};
		try {
			switch (this.http_verb) {
			case `post`:
				await axios.post(`${process.env.VUE_APP_API_URI}/guide/create`, payload, { withCredentials: true });
				break;
			case `put`:
				await axios.put(`${process.env.VUE_APP_API_URI}/guide/edit/${this.$route.params.slug}`, payload, { withCredentials: true });
				break;
			}
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

<style lang="scss" >
@import "styles/_variables";
@import "styles/_mixins";
@import "styles/article-standard";
@import "styles/code-highlight";

.guide-editor {
	@include vertical-centered();
}

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
	width: 80vw;

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

		div hr {
			border: 1px solid $balcora-content-white;
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
	width: 50%;
}
.response-error {
	@include vertical-centered();
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
