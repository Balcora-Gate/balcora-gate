<template>
	<article class="modal-container" v-if="active">
		<slot @success="success" @cancel="cancel"></slot>
	</article>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component({})
export default class Modal extends Vue {
	active: boolean = false;
	@Prop({}) successCallback: Function = () => {
		this.active = false;
	}
	@Prop({}) cancelCallback: Function = () => {
		this.active = false;
	}
	success () {
		this.$emit(`success`);
	}
	cancel () {
		this.$emit(`cancel`);
	}
};
</script>

<style lang="scss">

</style>
