<template>
	<main class="guide-create-container">
		<header><bread-crumb /></header>
		<section class="guide-create vertical-centered">
			<guide-editor page_title="New Guide" page_action="Posting" http_verb="post"/>
		</section>
	</main>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import BreadCrumb from './BreadCrumb.vue';
import GuideEditor from './cmp/GuideEditor.vue';

@Component({
	components: {
		BreadCrumb,
		GuideEditor
	}
})
export default class GuideCreate extends Vue {
};
</script>

<style lang="scss" scoped>
</style>
