<template>
	<main class="entity-display-container">
		<header><bread-crumb /></header>
		<section class="content">
			<form method="get" class="main-form">
				<div class="form-group">
					<select v-model="entity_type" @change="fetchEntity">
						<option value="ship">Ship</option>
						<option value="subs">Subsystem</option>
						<option value="wepn">Weapon</option>
					</select>
					<input type="search" class="large" name="name" id="ship-name" v-on:keydown.enter.prevent="fetchEntity" v-model="entity_name">
				</div>
			</form>
			<div v-if="loading" class="fetch-loading">Loading...</div>
			<div v-for="(e_data, i) in data" :key="i" class="entity-display">
				<div class="entity_name">{{ e_data.name }}</div>
				<div v-for="(cat_data, cat_name) in existant_data(e_data)" :key="cat_name" class="entity-category">
					<b-button v-b-toggle="`${cat_name}_${i}`" class="btn-collapse">{{cat_name}}</b-button>
					<b-collapse :id="`${cat_name}_${i}`" class="entity-category-body">
						<table>
							<thead>
								<th>Attribute</th>
								<th>Value</th>
							</thead>
							<tbody>
								<tr v-for="(value, attribute) in cat_data" :key="attribute">
									<td>{{ attribute }}</td>
									<td>{{ value }}</td>
								</tr>
							</tbody>
						</table>
					</b-collapse>
				</div>
			</div>
		</section>
	</main>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import axios from 'axios';
import BreadCrumb from './BreadCrumb.vue';

@Component({
	components: {
		BreadCrumb
	}
})
export default class EntityDisplay extends Vue {
	private data: any = {};
	private entity_type: string = `ship`;
	private entity_name: string = '';
	private loading: boolean = false;

	existant_data (data: {[key: string]: any}) {
		return Object.entries(data).reduce((acc: {[key: string]: any}, [k, v]: [string, any]) => {
			if (v && typeof v === 'object') {
				acc[k] = v;
			}
			return acc;
		}, {});
	}

	private async fetchEntity () {
		this.loading = true;
		this.data = (await axios.get(`${process.env.VUE_APP_API_URI}/data?type=${this.entity_type}&name=${this.entity_name}`)).data;
		this.loading = false;
	}
};
</script>

<style lang="scss">
@import "styles/site";
.entity-display-container {

	.content {
		@include vertical-centered();
		margin-top: 1em;
	}
	.main-form {
		.form-group {
			display: flex;
			flex-direction: row;

			select {
				width: 9em;
			}

			input {
				width: 100%;
			}
		}
	}

	.entity-display {
		width: 80vw;
		@include vertical-centered();
		border: 1px solid $balcora-highlight-gray;
		.entity_name {
			margin: 0.5em 0 0 0;
			font-size: 1.4em;
		}

		.btn-collapse {
			border: none;
			background-color: inherit;
			color: $balcora-orange;
			font-size: 1.2em;
			font-weight: bolder;
		}

		button.collapsed::after {
			content: ' ▸';
		}

		button::after {
			content: ' ▾';
		}

		.entity-category {
			@include vertical-centered();

			.entity-category-body {
				transition: height 0.25s ease-in-out;
			}
		}
	}
}
</style>
