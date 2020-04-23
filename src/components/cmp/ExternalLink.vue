<template>
	<a class="external-link" :href="href" target="_blank" rel="noopener noreferrer" title="Link to external site">
		<template v-if="text !== undefined && text !== null">
			{{ text }}
		</template>
		<slot v-else />
	</a>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component({})
export default class ExternalLink extends Vue {
	@Prop({
		required: true
	}) href!: string;
	@Prop({
		required: false,
		default: null
	}) text?: string;
};
</script>

<style lang="scss" scoped>
.external-link {
	&:hover {
		color: rgb(203, 54, 233);
	}
}
</style>
