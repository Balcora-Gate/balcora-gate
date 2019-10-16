<template>
	<div class="dd-container">
		<button class="dd-head" v-if="button" @click="toggle" :class="{ active: show }">{{ head }}</button>
		<a v-else href="javascript:void(0);" class="dd-head" :class="{ active: show }" role="button" @click="toggle">{{ head }}</a>
		<ul class="dd-content" :class="{ show: show }">
			<slot/>
		</ul>
	</div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component({})
export default class Dropdown extends Vue {
	@Prop({
		required: true
	}) head!: string;
	@Prop({
		default: false
	}) button!: boolean;

	show: boolean = false;

	toggle () {
		this.show = !this.show;
	}
};
</script>

<style lang="scss">
@import "styles/_variables";
.dd-container {
	position: relative;
	.dd-content {
		display: none;
		position: absolute;
		top: 1.5em;
		left: -0.1em;
		list-style: none;
		padding: 0.2em 0.4em;
		background: $balcora-highlight-gray;
		border: 1px solid $balcora-content-white;
		// border-top: 1px solid rgba($balcora-content-white, 0.5);
		border-top: none;
		border-radius: 4px;
		border-top-left-radius: 0;
		border-top-right-radius: 0;
		min-width: 6em;
	}

	.dd-head::after {
		content: ' ▸';
	}

	.dd-head.active::after {
		content: ' ▾';
	}

	.show {
		display: block;
	}
}
</style>
