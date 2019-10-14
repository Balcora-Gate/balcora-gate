<template>
	<article class="guide-container">
		<header class="heading-info"><bread-crumb /></header>
		<section class="content">
			<header>
				<div class="title" v-html="unescapeHtml(guide.title)"></div>
				<div class="info">By: {{ guide.user }}</div>
				<ul class="actions">
					<li class="action" v-for="(action, i) in actions" :key="i">
						<a href="javascript:void(0);" @click="action.cb">[ {{ action.display }} ]</a>
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
@Component({
	components: {
		BreadCrumb,
		PasswordConfirm
	},
	methods: {
		unescapeHtml
	}
})
export default class BalcoraGuide extends Vue {
	guide: {[key: string]: string} = {};
	show_modal: boolean = false;
	actions: Array<{
		[key: string]: any,
		display: string,
		cb: Function
		}> = [];

	get md_guide (): string {
		return standardPurify(this.guide.body);
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

<style lang="scss" scoped>
@import "styles/_variables";
@import "styles/_mixins";
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
