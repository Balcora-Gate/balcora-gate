<template>
	<main class="guide-create-container">
		<header><bread-crumb /></header>
		<section class="guide-create vertical-centered">
			<guide-editor page_title="New Guide"
				page_action="Posting"
				http_verb="post"
				:user="user"/>
		</section>
	</main>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import BreadCrumb from './BreadCrumb.vue';
import GuideEditor from './cmp/GuideEditor.vue';
import Cookies from 'js-cookie';

@Component({
	components: {
		BreadCrumb,
		GuideEditor
	}
})
export default class GuideCreate extends Vue {
	get user () {
		return Cookies.get(`user_name`);
	}
};
</script>

<style lang="scss" scoped>
</style>
