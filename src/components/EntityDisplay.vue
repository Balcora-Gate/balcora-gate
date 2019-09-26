<template>
	<main class="entity-display-container">
		<header><bread-crumb /></header>
		<section class="content">
			<form method="get" class="main-form">
				<div class="form-group">
					<label for="name">Ship:</label>
					<input type="text" class="large" name="name" id="ship-name" v-on:keydown.enter.prevent="fetchShip" v-model="entity_name" >
				</div>
			</form>
			<div v-if="loading" class="fetch-loading">Loading...</div>
			<div v-if="Object.keys(data).length !== 0" class="entity-display">
				<div v-for="(cat_data, cat_name) in existant_data" :key="cat_name" class="entity-category">
					<b-button v-b-toggle="cat_name" class="btn-collapse">{{cat_name}}</b-button>
					<b-collapse :id="cat_name" class="entity-category-body">
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
	private entity_name: string = '';
	private loading: boolean = false;

	get existant_data () {
		return Object.entries(this.data).reduce((acc: {[key: string]: any}, [k, v]: [string, any]) => {
			if (v && typeof v === 'object') {
				acc[k] = v;
			}
			return acc;
		}, {});
	}

	private async fetchShip () {
		this.loading = true;
		this.data = (await axios.get(`http://localhost:3000/data?name=${this.entity_name}`)).data[0];
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
			flex-direction: column;

		}
	}

	.entity-display {
		width: 80vw;
		@include vertical-centered();
		border: 1px solid $balcora-highlight-gray;
		.btn-collapse {
			border: none;
			background-color: inherit;
			color: $balcora-orange;
			font-size: 1.4em;
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
