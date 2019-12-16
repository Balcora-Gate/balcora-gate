<template>
	<main class="guides-index-container">
		<header><bread-crumb /></header>
		<section class="guide-list-container">
			<header>
				<p>Guides submitted by the HWRM community!</p>
				<img src="@/assets/balcora-logo-small.png" alt="BALCORA" />
			</header>
			<div class="guide-actions">
				<router-link v-if="user" to="/guide/create" tag="button">New Guide</router-link>
				<form class="guide-search-container" @submit.prevent="() => {}">
					<div class="guide-search-group">
						<label for="guide-search-title">Search titles:</label>
						<input type="search" name="guide-search-title" v-model="search_title">
					</div>
					<div class="guide-search-group">
						<label for="guide-search-user">Search posters:</label>
						<input type="search" name="guide-search-user" v-model="search_user">
					</div>
					<div class="guide-search-group">
						<button v-if="search_title || search_user"
							id="guide-search-str-copy"
							@click="copySearchURL"
							:data-clipboard-text="guide_search_str">
							Copy as shareable URL
						</button>
					</div>
				</form>
			</div>
			<ul class="guide-list">
				<li v-for="(guide, index) in searched_guides" :key="index">
					<article class="guide">
						<header class="guide-header">
							<div class="guide-header-info">
								<div>By: {{guide.user}}</div>
								<div class="guide-controls" v-if="user && user === guide.user">
									<span>[ <router-link :to="`guide/${guide.slug}/edit`">Edit</router-link> ]</span>
									<span>[ <a href="javascript:void(0);" @click="deleteGuide(guide)">Delete</a> ]</span>
								</div>
							</div>
							<router-link :to="`guide/${guide.slug}`" v-html="unescapeHtml(guide.title)" />
							<div class="guide-header-info" />
						</header>
						<section class="guide-body" v-html="`${snip(toMarkDown(unescapeHtml(guide.body)), 128)}...`">
						</section>
					</article>
				</li>
			</ul>
		</section>
		<div v-if="user" id="popup-modal">
			<password-confirm />
		</div>
	</main>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import axios from 'axios';
import Cookies from 'js-cookie';
import marked from 'marked';
import ClipboardJS from 'clipboard';

import { unescapeHtml } from 'lib/html_util';
import { snip } from 'lib/string_util';
import BreadCrumb from './BreadCrumb.vue';
import PasswordConfirm from './cmp/PasswordConfirm.vue';

type Guide = {
	_id: string,
	name: string,
	slug: string,
	body: string,
	title: string,
	user: string
};

@Component({
	components: {
		BreadCrumb,
		PasswordConfirm
	},
	methods: {
		unescapeHtml,
		snip
	}
})
export default class GuidesIndex extends Vue {
	guides: Array<Guide> = [];
	search_title: string = ``;
	search_user: string = ``;
	popup_modal_el: HTMLElement | undefined;

	get searched_guides () {
		if (this.search_title === `` && this.search_user === ``) {
			return this.guides;
		} else {
			const filterTitles = (g: Guide) => {
				return this.search_title ? g.title.toLowerCase().includes(this.search_title.toLowerCase()) : true;
			};
			const filterUsers = (g: Guide) => {
				return this.search_user ? g.user.toLowerCase().includes(this.search_user.toLowerCase()) : true;
			};
			return this.guides.filter(filterTitles).filter(filterUsers);
		}
	}

	get user () {
		return Cookies.get(`user_name`);
	}

	get guide_search_str () {
		return `${window.location.href}?title=${this.search_title}&user=${this.search_user}`;
	}

	toMarkDown (plain: string) {
		return marked(plain);
	}

	async deleteGuide (guide: { [key: string]: any }) {
		if (window.confirm(`Do you really want to delete '${guide.name}'?\n\nThis action is irreversible!`)) {
			if (this.popup_modal_el) {
				this.popup_modal_el.style.display = `flex`;
				const modal_result = await new Promise((res, rej) => {
					this.$on(`valid_password`, () => res(`ok`));
					this.$on(`modal_cancel`, () => res(`cancel`));
				});
				if (modal_result === `ok`) {
					try {
						const res = (await axios.delete(`${process.env.VUE_APP_API_URI}/guide/delete?slug=${guide.slug}`, { withCredentials: true }));
						this.fetchGuides();
					} catch (err) {
						console.log(err.message);
					}
				}
				this.popup_modal_el.style.display = `none`;
			}
		}
	}

	async fetchGuides () {
		this.guides = (await axios.get(`${process.env.VUE_APP_API_URI}/guide`, { withCredentials: true })).data;
	}

	copySearchURL () {
		const clip = new ClipboardJS(`#guide-search-str-copy`);
	}

	async mounted () {
		this.popup_modal_el = document.getElementById(`popup-modal`)!;
		this.fetchGuides();
		this.search_title = (this.$route.query.title) ? this.$route.query.title as string : ``;
		this.search_user = (this.$route.query.user) ? this.$route.query.user as string : ``;
	}
};
</script>

<style lang="scss" scoped>
@import "styles/site";

.guide-list-container {
	header {
		@include vertical-centered();
		font-size: 2em;
		margin: 1.5em;
		margin-bottom: 1em;
	}
	.guide-actions {
		margin: 1em 8vw 1em 8vw;
		display: flex;
		flex-direction: row;

		.guide-search-container {
			width: auto;
			margin: 0;
			margin-left: 1em;
			padding: 0.5em;
			display: flex;
			flex-direction: row;
			.guide-search-group {
				display: flex;
				flex-direction: column;
				justify-content: center;
				margin: 0 0.5em;
				label {
					font-size: 0.9em;
					margin: 0;
				}
				button {
					margin-top: auto;
					margin-bottom: 0;
					height: 2.3em;
				}
			}
		}
	}
	.guide-list {
		padding: 0;
		margin: 1em 8vw 1em 8vw;
		li {
			list-style: none;
			margin-bottom: 1em;
		}
		.guide {
			@include vertical-centered();
			// border: 1px solid rgba($balcora-orange, 0.6);
			border: 2px solid $balcora-highlight-gray;
			border-radius: 2px;
			padding: 1.5em;
			padding-top: 0.7em;
			.guide-header {
				border-bottom: 2px solid $balcora-highlight-gray;
				font-size: 2em;
				margin: 0;
				margin-bottom: 0.7em;
				padding: 0.3em;
				width: 100%;
				flex-direction: row;
				justify-content: space-between;

				.guide-header-info {
					font-size: 1rem;
					border-right: 1px solid $balcora-highlight-gray;
					padding: 0 1em 0 1em;
					display: flex;
					flex-direction: column;
					min-width: 7em;

					.guide-controls {
						margin: 0.2em;
						display: flex;
						flex-direction: column;
					}
				}
			}
		}
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
	display: none;
}
</style>
