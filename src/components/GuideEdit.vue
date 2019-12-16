<template>
	<main class="guide-create-container">
		<header><bread-crumb /></header>
		<section class="guide-create vertical-centered">
			<guide-editor v-if="!loading" :page_title="`Edit guide`" :page_action="`Editing`" http_verb="put"
				:name="guide_fields.name"
				:user="guide_fields.user"
				:title="guide_fields.title"
				:body="guide_fields.body"
				:collaborators="guide_fields.collaborators" />
		</section>
	</main>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import BreadCrumb from './BreadCrumb.vue';
import GuideEditor from './cmp/GuideEditor.vue';
import Axios from 'axios';

@Component({
	components: {
		BreadCrumb,
		GuideEditor
	}
})
export default class GuideEdit extends Vue {
	data_guide_fields: {[key: string]: any} = {};
	loading: boolean = true;
	get guide_fields () {
		return this.data_guide_fields;
	}
	async mounted () {
		try {
			this.data_guide_fields = (await Axios.get(`${process.env.VUE_APP_API_URI}/guide?slug=${this.$route.params.slug}`)).data[0];
			this.loading = false;
		} catch (err) {
			console.log(err);
			this.$router.go(-1); // TODO
		}
	}
};
</script>

<style lang="scss" scoped>
</style>
