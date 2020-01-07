<template>
	<article class="content">
		<header v-if="article.title" class="title" v-html="unescapeHtml(article.title)"></header>
		<div v-if="article.body" class="content-body" v-html="unescapeHtml(article.body)"></div>
	</article>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import axios from 'axios';

import { unescapeHtml } from 'lib/html_util';

@Component({
	methods: {
		unescapeHtml: unescapeHtml
	}
})
export default class BalcoraArticle extends Vue {
	private article: String = ``;

	private async mounted () {
		const slug = this.$route.params.slug;
		this.article = (await axios.get(`${process.env.VUE_APP_API_URI}/article?slug=${slug || 'home'}`, { withCredentials: true })).data[0];
	}
};
</script>

<style lang="scss">
@import "styles/article-standard";
</style>
