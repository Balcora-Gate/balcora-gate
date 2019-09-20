<template>
	<div class="guide-container">
		<article class="content">
			<header class="title" v-html="unescapeHtml(guide.header)"></header>
			<div class="content-body" v-html="unescapeHtml(guide.body)"></div>
		</article>
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
export default class BalcoraGuide extends Vue {
	guide: {[key: string]: string} = {};

	async mounted () {
		this.guide = (await axios.get(`http://localhost:3000/guide?slug=${this.$route.params.slug}`)).data[0];
	}
};
</script>

<style lang="scss">
@import "styles/article-standard";
</style>
