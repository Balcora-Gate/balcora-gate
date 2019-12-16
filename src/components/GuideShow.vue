<template>
	<article class="guide-container">
		<header class="heading-info"><bread-crumb /></header>
		<section class="content">
			<header>
				<div class="title" v-html="unescapeHtml(guide.title)"></div>
				<div class="info">By: {{ guide.user }}</div>
				<div class="collab-info" v-if="guide.collaborators && guide.collaborators.length">
					Collaborators:
					<ul class="collaborators">
						<li class="collaborator-row" v-for="(collaborator_row, row_index) in compactArray(guide.collaborators, 4)" :key="row_index">
							<span v-for="(collaborator, index) in collaborator_row" :key="index">
								{{ collaborator }}
							</span>
						</li>
					</ul>
				</div>
				<ul v-if="user && (user === guide.user || (guide.collaborators ? guide.collaborators.includes(user) : false))" class="actions">
					<li class="action" v-for="(action, i) in filtered_actions" :key="i">
						[ <a href="javascript:void(0);" @click="action.cb">{{ action.display }}</a> ]
					</li>
				</ul>
			</header>
			<hr style="width: 50%">
			<div class="content-body" v-html="md_guide"></div>
		</section>
		<div id="popup-modal" v-if="show_modal">
			<password-confirm />
		</div>
	</article>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import axios from 'axios';
import { unescapeHtml, standardPurify } from 'lib/html_util';
import BreadCrumb from './BreadCrumb.vue';
import marked from 'marked';
import PasswordConfirm from './cmp/PasswordConfirm.vue';
import HLJS from 'highlight.js';
import Cookies from 'js-cookie';
import { compactArray } from 'lib/arr_util';
marked.setOptions({
	highlight: (code, lang) => {
		if (lang) return HLJS.highlight(lang, code).value;
		else return HLJS.highlightAuto(lang).value;
	}
});

type GuideAction = {
	display: string,
	op_only?: boolean,
	cb: Function
};

@Component({
	components: {
		BreadCrumb,
		PasswordConfirm
	},
	methods: {
		unescapeHtml,
		compactArray
	}
})
export default class BalcoraGuide extends Vue {
	guide: {[key: string]: string} = {};
	show_modal: boolean = false;
	actions: Array<GuideAction> = [];

	get md_guide (): string {
		if (this.guide.body) {
			return standardPurify(marked(unescapeHtml(this.guide.body)));
		} else {
			return `Loading...`;
		}
	}

	get user () {
		return Cookies.get(`user_name`);
	}

	get filtered_actions (): Array<GuideAction> {
		return this.actions.filter(action => {
			if (action.op_only) {
				if (this.user === this.guide.user) {
					return true;
				} else {
					return false;
				}
			} else {
				return true;
			}
		});
	}

	async mounted () {
		this.guide = (await axios.get(`${process.env.VUE_APP_API_URI}/guide?slug=${this.$route.params.slug}`)).data[0];
		this.actions = [
			{
				display: `edit`,
				cb: () => {
					this.$router.push(`/guide/${this.guide.slug}/edit`);
				}
			},
			{
				display: `delete`,
				op_only: true,
				cb: async () => {
					if (window.confirm(`Do you really want to delete '${this.guide.name}'?\n\nThis action is irreversible!`)) {
						this.show_modal = true;
						const modal_result = await new Promise((res, rej) => {
							this.$on(`valid_password`, () => res(`ok`));
							this.$on(`modal_cancel`, () => res(`cancel`));
						});
						console.log(modal_result);
						if (modal_result === `ok`) {
							try {
								const res = (await axios.delete(`${process.env.VUE_APP_API_URI}/guide/delete?slug=${this.guide.slug}`, { withCredentials: true }));
								this.$router.push(`/guide`);
							} catch (err) {
								console.log(err.message);
							}
						}
						this.show_modal = false;
					}
				}
			}
		];
	}
};
</script>

<style lang="scss">
@import "styles/_variables";
@import "styles/_mixins";
@import "styles/code-highlight";
.content {
	header {
		@include vertical-centered();
		.title {
			margin: 0;
			margin-bottom: 0.2em;
			font-size: 2em;
		}
		.info {
			font-size: 0.9em;
		}
		.collab-info {
			font-size: 0.7em;
			margin-top: 1em;
			@include vertical-centered();
			.collaborators {
				list-style: none;
				margin: 0;
				padding: 0;
				max-width: 20vw;
				display: flex;
				flex-direction: column;
				.collaborator-row {
					display: flex;
					flex-direction: row;
					justify-content: center;
					line-height: 1em;
					span {
						margin: 0 0.25em;
					}
				}
			}
		}
		.actions {
			display: flex;
			flex-direction: row;
			list-style: none;
			margin: 0;
			margin-top: 1em;
			padding: 0;

			* {
				margin-left: 0.1em;
				margin-right: 0.1em;
			}
		}
	}
	.content-body {
		margin-top: 1em;
		display: block;
		width: 70vw;
		padding: 1em;
		border: 2px solid $balcora-highlight-gray;
		border-top: 0;
		border-bottom: 0;
	}
}
#popup-modal {
	position: fixed;
	top: 0;
	left: 0;
	width: 100vw;
	height: 100vh;
	z-index: 99;
	@include vertical-centered();
	justify-content: center;
	display: flex;
}
</style>
