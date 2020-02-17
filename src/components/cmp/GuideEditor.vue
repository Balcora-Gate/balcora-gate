<template>
	<div class="guide-editor">
		<header class="guide-create-header">
			<div class="title">{{ page_title }}</div>
			<div class="info">{{ page_action }} as {{ page_user }}</div>
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
			<div class="collaboration" v-if="page_user === user">
				<label for="collaborator-input"><abbr title="Collaborators are additional users who will have editing permissions for this guide">Collaborators:</abbr></label>
				<vue-tags-input
					name="collaborator-input"
					placeholder="Add collaborators..."
					class="collaborator-input"
					v-model="collab_vti.model_tag"
					:tags="collab_vti.tags"
					@tags-changed="new_tags => collab_vti.tags = new_tags"
					:autocomplete-items="collab_vti.autocomplete_tags"
					:add-only-from-autocomplete="true" />
			</div>
			<div class="guide-tags" v-if="page_user === user">
				<label for="guide-tags-input"><abbr title="Tags help users search for your guide">Guide tags:</abbr></label>
				<vue-tags-input
					name="guide-tags-input"
					placeholder="Add guide tags..."
					class="guide-tags-input"
					v-model="guide_vti.model_tag"
					:tags="guide_vti.tags"
					@tags-changed="new_tags => guide_vti.tags = new_tags"
					:autocomplete-items="filtered_gt_autocomplete"
					:add-only-from-autocomplete="true" />
			</div>
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
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import marked from 'marked';
import Cookies from 'js-cookie';
import { standardPurify, unescapeHtml } from 'lib/html_util';
import axios, { AxiosResponse } from 'axios';
// @ts-ignore
import VueTagsInput from '@johmun/vue-tags-input';
import HLJS from 'highlight.js';

import { VTITag, VTIConfig } from '@/types/VTI';

marked.setOptions({
	highlight: (code, lang) => {
		if (lang) return HLJS.highlight(lang, code).value;
		else return HLJS.highlightAuto(code).value;
	}
});

@Component({
	components: {
		VueTagsInput
	}
})
export default class GuideEditor extends Vue {
	@Prop({
		default: ``
	}) name!: string;
	@Prop({
		required: true
	}) user!: string;
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
	@Prop({
		default: () => ([])
	}) collaborators!: Array<string>;
	@Prop({
		default: () => ([])
	}) tags!: Array<VTITag>;

	data_name: string = ``;
	data_title: string = ``;
	data_body: string = ``;
	res_error: { status: number, message: string } = {
		status: 0,
		message: ``
	};

	collab_vti = new VTIConfig();

	guide_vti = new VTIConfig();
	// guide_tag: string = ``;
	// guide_tags: Array<VTITag> = [];
	// guide_tags_autocomplete: Array<VTITag> = [];
	// guide_tags_debounce?: number;

	@Watch(`collab_tag`)
	fetchUserTags (val: Array<string>, old_val: Array<string>) {
		const dataUrl = `${process.env.VUE_APP_API_URI}/user`;
		if (this.collab_vti.model_tag.length) {
			clearTimeout(this.collab_vti.debounce);
			this.collab_vti.debounce = setTimeout(async () => {
				const users = (await axios.get(`${dataUrl}?name=${val}`)).data as Array<any>;
				this.collab_vti.tags = users.map(user => ({ text: user.name as string }));
			}, 300);
		}
	}

	@Watch(`guide_tag`)
	fetchGuideTags (val: Array<string>, old_val: Array<string>) {
		const dataUrl = `${process.env.VUE_APP_API_URI}/guide-tag`;
		if (this.guide_vti.model_tag.length) {
			clearTimeout(this.guide_vti.debounce);
			this.guide_vti.debounce = setTimeout(async () => {
				const guide_tags = (await axios.get(`${dataUrl}`)).data as Array<any>;
				this.guide_vti.autocomplete_tags = guide_tags;
			}, 300);
		}
	}

	beforeCreate () {
		if (Cookies.get(`user_name`) === undefined) {
			this.$router.go(-1);
		}
	}

	mounted () {
		this.data_name = this.name;
		this.data_title = this.title;
		this.data_body = unescapeHtml(this.body);
		this.collab_vti.tags = this.collaborators.map(user => ({
			text: user
		}));
		this.guide_vti.tags = this.tags;
	}

	get filtered_gt_autocomplete () {
		return this.guide_vti.autocomplete_tags.filter(gt => gt.text.toLowerCase().includes(this.guide_vti.model_tag.toLowerCase()));
	}

	get res () {
		if (this.res_error.status !== 0 && this.res_error.status !== 200) {
			return this.res_error;
		}
	}

	get page_user (): string {
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
		if (/[\W]+/i.test(this.data_name)) {
			// have to re-test to allow these through, js regex sucks
			if (!(/[-_ ]+/i.test(this.data_name))) {
				errs.push(`Invalid name: cannot contain special characters`);
			}
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
		const payload = {
			name: this.data_name,
			slug: this.data_name.split(``).map(c => c.replace(/\s+/gm, `-`)).join(``),
			title: this.data_title,
			body: standardPurify(this.data_body),
			collaborators: this.collab_vti.tags.map(tag => tag.text),
			tags: this.guide_vti.tags
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
@import "styles/vti";

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
		margin-bottom: 0.5em;
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

	.collaboration,
	.guide-tags {
		width: 100%;
		@include vertical-centered();
		label {
			font-size: 0.8em;
			margin-top: 0.3em;
			margin-bottom: 0.1em;
		}
		.collaborator-input,
		.guide-tags-input {
			width: 100%;
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
