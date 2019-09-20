<template>
	<div class="guides-index-container">
		<header>
			<p>Guides submitted by the HWRM community!</p>
			<img src="@/assets/balcora-logo-small.png" alt="BALCORA" />
		</header>
		<section class="guide-list-container">
			<ul class="guide-list">
				<li v-for="guide in guides" :key="guide">
					<article class="guide">
						<header class="guide-header">
							<router-link :to="`guide/${guide.slug}`" v-html="unescapeHtml(guide.header)" />
						</header>
						<section class="guide-body" v-html="unescapeHtml(guide.body)">
						</section>
					</article>
				</li>
			</ul>
		</section>
	</div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import axios from 'axios';

import { unescapeHtml } from 'lib/html_util';

@Component({
	methods: {
		unescapeHtml
	}
})
export default class GuidesIndex extends Vue {
	guides: Array<{[key: string]: string}> = [];

	async mounted () {
		this.guides = (await axios.get(`http://localhost:3000/guide`)).data;
	}
};
</script>

<style lang="scss" scoped>
@import "styles/site";

header {
	@include vertical-centered();
	font-size: 2em;
	margin: 1.5em;
	margin-bottom: 1em;
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
		border: 1px solid rgba($balcora-orange, 0.6);
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
		}
	}
}
</style>
