<template>
	<main class="guides-index-container">
		<header><bread-crumb /></header>
		<section class="guide-list-container">
			<header>
				<p>Guides submitted by the HWRM community!</p>
				<img src="@/assets/balcora-logo-small.png" alt="BALCORA" />
			</header>
			<div class="guide-actions" v-if="user">
				<router-link to="/guide/create" tag="button">New Guide</router-link>
				<div class="guide-search-container">
					<label for="guide-search">Search:</label>
					<input type="search" name="guide-search" v-model="search">
				</div>
			</div>
			<ul class="guide-list">
				<li v-for="(guide, index) in searched_guides" :key="index">
					<article class="guide">
						<header class="guide-header">
							<router-link :to="`guide/${guide.slug}`" v-html="unescapeHtml(guide.name)" />
							<div class="guide-header-info">By: {{guide.user}}</div>
						</header>
						<section class="guide-body" v-html="`${snip(toMarkDown(unescapeHtml(guide.body)), 64)}...`">
						</section>
					</article>
				</li>
			</ul>
		</section>
	</main>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import axios from 'axios';
import Cookies from 'js-cookie';
import marked from 'marked';

import { unescapeHtml } from 'lib/html_util';
import { snip } from 'lib/string_util';
import BreadCrumb from './BreadCrumb.vue';

@Component({
	components: {
		BreadCrumb
	},
	methods: {
		unescapeHtml,
		snip
	}
})
export default class GuidesIndex extends Vue {
	guides: Array<{[key: string]: string}> = [];
	search: string = ``;

	get searched_guides () {
		if (this.search === ``) {
			return this.guides;
		} else {
			return this.guides.filter(g => g.name.includes(this.search));
		}
	}

	get user () {
		return Cookies.get(`user_name`);
	}

	toMarkDown (plain: string) {
		return marked(plain);
	}

	async mounted () {
		this.guides = (await axios.get(`${process.env.VUE_APP_API_URI}/guide`)).data;
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
			margin-left: 1em;
			display: flex;
			flex-direction: column;
			label {
				font-size: 0.9em;
				margin: 0;
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
				position: relative;

				.guide-header-info {
					position: absolute;
					left: 0;
					font-size: 1rem;
					border-right: 1px solid $balcora-highlight-gray;
					padding: 0 1em 0 1em;
				}
			}
		}
	}
}
</style>
