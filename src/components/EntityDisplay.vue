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
			<div v-else v-for="(e_data, i) in data" :key="i" class="entity-display">
				<entity-info :entity-data="e_data" :entity-type="entity_type" />
			</div>
		</section>
	</main>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import axios from 'axios';
import BreadCrumb from './cmp/BreadCrumb.vue';
import EntityInfo from './cmp/EntityInfo.vue';
import { Hardpoint, HARDPOINT_TYPE, Subsystem } from '../types/Entity';

@Component({
	components: {
		BreadCrumb,
		EntityInfo
	}
})
export default class EntityDisplay extends Vue {
	private data: any = {};
	private entity_type: string = `ship`;
	private entity_name: string = '';
	private loading: boolean = false;

	mounted () {
		this.$on(`new-search`, async (ev: { [key: string]: any }) => {
			this.entity_type = ev.type;
			this.entity_name = ev.name;
			this.loading = true;
			await this.fetchEntity();
			this.loading = false;
		});

		this.entity_type = this.$route.query.type === undefined ? `ship` : this.$route.query.type as string;
		this.entity_name = this.$route.query.name === undefined ? `` : this.$route.query.name as string;
		if (this.$route.query.type !== undefined || this.$route.query.name !== undefined) {
			this.loading = true;
			this.fetchEntity().then(() => {
				this.loading = false;
			});
		}
	}

	private async fetchEntity () {
		this.loading = true;
		this.data = (await axios.get(`${process.env.VUE_APP_API_URI}/data?type=${this.entity_type}&name=${this.entity_name}`)).data;
		await Promise.all(this.data.map(async (entity: { [key: string]: any }) => {
			if (this.entity_type === `ship`) {
				entity.weapons = await Promise.all([
					...Object.values(entity[`innate_weapons`]).map(name => ({ name: name, type: `innate` })),
					...await Promise.all(Object.values(entity[`hardpoints`] as { [key: string]: Hardpoint })
						.filter((hardpoint: Hardpoint) => hardpoint.type === HARDPOINT_TYPE['WEAPON'])
						.map(async (hardpoint: Hardpoint) => {
							const ref_sub = (await axios.get(`${process.env.VUE_APP_API_URI}/data?type=subs&name=${hardpoint.default_sub.toLowerCase().replace(/"/gm, ``)}`)).data[0] as Subsystem;
							return {
								name: ref_sub.weapon,
								type: `hardpoint`,
								subs: ref_sub.name
							};
						}))
				]);
			}
			return entity;
		}));
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
				@include vertical-centered();
			}
		}
	}
}
</style>
