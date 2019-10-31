<template>
	<main class="entity-diff-container">
		<form method="get" @submit.prevent="newArea">
			<input type="search" v-model="data_new_version_lookup">
			<button type="submit" :disabled="!data_new_version_lookup">New Diff</button>
		</form>
		<Split v-if="data_split_areas.length" class="pushable-split"
			:new_area_display_text="'New Diff'"
			:new_area_seeder="loadSomething"
			:key="data_split_areas.length">
			<SplitArea class="pushable-split-area"
				:size="100 / data_split_areas.length"
				v-for="(area, i) in data_split_areas" :key="i">
				<div class="pushable-split-area-header">
					<h3>{{ area.header }}</h3>
					<button role="button" class="area-clear-button" @click="delArea(i)">X</button>
				</div>
				<div class="pushable-split-area-content">
					{{ area.entity_data }}
				</div>
			</SplitArea>
		</Split>
	</main>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import Axios from 'axios';

type SplitAreaData = {
	header: string,
	entity_data: {
		[key: string]: any
	}
}

@Component({})
export default class EntityDiff extends Vue {
	data_api_url = `${process.env.VUE_APP_API_URI}/data?type=ship`;
	data_new_version_lookup: string = ``;
	data_split_areas: Array<SplitAreaData> = [];
	loadSomething () {
		console.log(`hey`);
	}

	async newArea () {
		const res = (await Axios.get(`${this.data_api_url}&name=${this.data_new_version_lookup}`)).data;
		for (const entity of res) {
			this.data_split_areas.push({
				header: entity.name,
				entity_data: entity
			});
		}
	}
};
</script>

<style lang="scss">
.split.pushable-split {
	height: 80vh;
	padding: 0 2em;

	.pushable-split-area {
		padding: 0.5em;
		.pushable-split-area-header {
			display: flex;
			width: 100%;
			justify-content: space-between;
		}
	}
}
</style>
