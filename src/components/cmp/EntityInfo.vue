<template>
	<div class="entity-info-container">
		<b-button v-b-toggle="`${entityData.name}`" class="btn-collapse">{{ entityData.name }}</b-button>
		<b-collapse :id="`${entityData.name}`" class="entity-info-collapse-display">
			<div class="main-entity-info-container">
				<div class="main-entity-info">
					<template v-if="entityType === `ship`">
						<span>Ship class: <code>{{ entityData.attribs.DisplayFamily.replace(/\W/gm, ``) }}</code></span>
						<div class="main-entity-info-secondary">
							<ul class="entity-primary-stats">
								<li>
									<ul class="entity-primary-stats-column">
										<li>Hitpoints: <span class="entity-primary-stat-value"><code>{{ entityData.attribs.maxhealth }}</code></span></li>
										<li>Max forward speed: <span class="entity-primary-stat-value"><code>{{ entityData.attribs.mainEngineMaxSpeed }}</code></span></li>
										<li>Max strafe speed: <span class="entity-primary-stat-value"><code>{{ entityData.attribs.thrusterMaxSpeed }}</code></span></li>
									</ul>
								</li>
								<li>
									<ul class="entity-primary-stats-column">
										<li>Build cost: <span class="entity-primary-stat-value"><code>{{ entityData.attribs.buildCost }}ru</code></span></li>
										<li>Build time: <span class="entity-primary-stat-value"><code>{{ entityData.attribs.buildTime }}s</code></span></li>
										<li>Armour type: <span class="entity-primary-stat-value"><code>{{ entityData.attribs.ArmourFamily }}</code></span></li>
									</ul>
								</li>
							</ul>
						</div>
					</template>
					<template v-else-if="entityType === `wepn`">
						<span>Effect: <code>{{ entityData.result.effect.replace(/\W/gm, ``) }}</code> (to <code>{{ entityData.result.target.replace(/\W/gm, ``) }}</code>)</span>
						<div class="main-entity-info-secondary">
							<ul class="entity-primary-stats">
								<li>
									<ul class="entity-primary-stats-column">
										<li>Min effect: <span class="entity-primary-stat-value"><code>{{ entityData.result.min_effect_val }}</code></span></li>
										<li>Max effect: <span class="entity-primary-stat-value"><code>{{ entityData.result.max_effect_val }}</code></span></li>
										<li>Effect type: <span class="entity-primary-stat-value"><code>{{ entityData.config.fire_type.replace(/\W/gm, ``) }}</code></span></li>
										<li>Shots per second: <span class="entity-primary-stat-value"><code>{{ calcShotsPerSecond(entityData.config) }}</code></span></li>
									</ul>
								</li>
								<li>
									<ul class="entity-primary-stats-column">
										<li>Range: <span class="entity-primary-stat-value"><code>{{ entityData.config.fire_range }}</code></span></li>
										<li>Weapon type: <span class="entity-primary-stat-value"><code>{{ entityData.config.type.replace(/\W/gm, ``)  }}</code></span></li>
										<li>Projectile speed: <span class="entity-primary-stat-value"><code>{{ entityData.config.projectile_speed }}</code></span></li>
										<li>Spawn effect:
											<span class="entity-primary-stat-value">
												<code>
													<template v-if="entityData.result.effect.replace(/\W/gm, ``) === `SpawnWeaponFire`">
														<a href="javascript:void(0);" @click="emitNewSearch(entityData.result.spawned_weapon_effect.replace(/W/gm, ``), `wepn`)">{{ entityData.result.spawned_weapon_effect.replace(/W/gm, ``) }}</a>
													</template>
												</code>
											</span>
										</li>
									</ul>
								</li>
							</ul>
						</div>
					</template>
					<template v-else-if="entityType === `subs`">
						<span>Type: <code>{{ entityData.attribs.type.replace(/\W/gm, ``) }}</code></span>
						<div class="main-entity-info-secondary">
							<ul class="entity-primary-stats">
								<li>
									<ul class="entity-primary-stats-column">
										<li>Health: <span class="entity-primary-stat-value"><code>{{ entityData.attribs.maxhealth }}</code></span></li>
										<li>Regen time: <span class="entity-primary-stat-value"><code>{{ entityData.attribs.regentime }}</code></span></li>
									</ul>
								</li>
								<li>
									<ul class="entity-primary-stats-column">
										<li>Build cost: <span class="entity-primary-stat-value"><code>{{ entityData.attribs.costToBuild }}</code></span></li>
										<li>Build time: <span class="entity-primary-stat-value"><code>{{ entityData.attribs.timeToBuild  }}</code></span></li>
									</ul>
								</li>
							</ul>
						</div>
					</template>
				</div>
			</div>
			<b-button v-b-toggle="`${entityData.name}_all_info`" class="btn-collapse">All info</b-button>
			<b-collapse :id="`${entityData.name}_all_info`">
				<hr class="all-info-hr">
				<div v-for="(cat_data, cat_name) in existant_data" :key="cat_name" class="entity-category">
					<b-button v-b-toggle="`${cat_name}_${entityData.name}`" class="btn-collapse">{{cat_name}}</b-button>
					<b-collapse :id="`${cat_name}_${entityData.name}`" class="entity-category-body">
						<table class="cat-display-tbl">
							<thead>
								<template v-if="cat_name === `attribs`">
									<th>Attribute:</th>
									<th>Value:</th>
								</template>
								<template v-if="cat_name === `abilities`">
									<th>Ability:</th>
									<th>Params:</th>
								</template>
								<template v-if="cat_name === `emp`">
									<th>Attribute:</th>
									<th>Value:</th>
								</template>
								<template v-if="cat_name === `hardpoints`">
									<th>Hardpoint:</th>
									<th>Attribute:</th>
								</template>
								<template v-else-if="cat_name === `weapons`">
									<th>Weapon name:</th>
									<th>Host subsystem:</th>
								</template>
							</thead>
							<tbody>
								<tr v-for="(value, attribute) in cat_data" :key="attribute">
									<template v-if="cat_name === `hardpoints`">
										<td>{{ value[`name`] }}</td>
										<td>
											<ul class="clean-list">
												<li>
													Type: <code>{{ value[`type`] }}</code>
												</li>
												<li>
													Default sub: <a href="javascript:void(0);" @click="emitNewSearch(value[`default_sub`], `subs`)">{{ value[`default_sub`].replace(/\W/gm, ``) }}</a>
												</li>
												<li v-for="(sub, sub_index) in Object.entries(value).filter(kv => kv[0].includes(`potential`)).map(kv => kv[1]).filter(p_sub => p_sub.replace(/\W/gm, ``))" :key="sub_index">
													Potential sub {{ sub_index }}: <a href="javascript:void(0);" @click="emitNewSearch(sub.replace(/\W/gm, ``), `subs`)">{{ sub }}</a>
												</li>
											</ul>
										</td>
									</template>
									<template v-else-if="cat_name === `weapons`">
										<td>
											<a href="javascript:void(0);" @click="emitNewSearch(value[`name`], `wepn`)">{{ value[`name`].replace(/"/gm, ``) }}</a>
										</td>
										<td>
											<ul class="clean-list">
												<li v-if="value[`subs`]">
													<a href="javascript:void(0);" @click="emitNewSearch(value[`subs`], `subs`)">{{ value[`subs`].replace(/"/gm, ``) }}</a>
												</li>
											</ul>
										</td>
									</template>
									<template v-else>
										<td>{{ attribute }}</td>
										<td><code>{{ value }}</code></td>
									</template>
								</tr>
							</tbody>
						</table>
					</b-collapse>
				</div>
			</b-collapse>
		</b-collapse>
	</div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { ENTITY_TYPE } from '@/types/Entity';

@Component({})
export default class EntityInfo extends Vue {
	@Prop({
		required: true
	}) entityData!: { [key: string]: string };

	@Prop({
		required: true
	}) entityType!: ENTITY_TYPE;

	get existant_data () {
		return Object.entries(this.entityData).reduce((acc: {[key: string]: any}, [k, v]: [string, any]) => {
			const non_display_cats = [ `innate_weapons` ];
			if (v && typeof v === 'object' && !non_display_cats.includes(k) && Object.values(v).length !== 0) {
				acc[k] = v;
			}
			return acc;
		}, {});
	}

	calcShotsPerSecond (wepn_config: { [key: string]: any }) {
		const fire_burst_duration = parseFloat(wepn_config.fire_burst_duration);
		const time_between_shots = parseFloat(wepn_config.time_between_shots);
		const time_between_bursts = parseFloat(wepn_config.time_between_bursts);
		return (() => {
			if (fire_burst_duration === 0) {
				return (1 / time_between_shots);
			} else {
				return ((fire_burst_duration / time_between_shots) / time_between_bursts);
			}
		})().toFixed(2);
	}

	emitNewSearch (name: string, type: string) {
		this.$parent.$emit(`new-search`, { name: name.replace(/\W/gm, ``).toLowerCase(), type });
	}
};
</script>

<style lang="scss" scoped>
@import "styles/_variables";
@import "styles/_mixins";
.entity-info-container {
	width: 100%;
	@include vertical-centered();
	.entity-info-collapse-display {
		width: 100%;
		@include vertical-centered();
		.main-entity-info-container {
			width: 80%;
			@include vertical-centered();
			.main-entity-info {
				margin: 0;
				padding: 0;
				width: 100%;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				.main-entity-info-secondary {
					display: flex;
					flex-direction: row;
					justify-content: center;
					align-items: center;
					.entity-thumbnail {
						margin: 1em;
					}
					.entity-primary-stats {
						display: flex;
						flex-direction: row;
						li {
							margin: 0 10px;
						}
					}
					.entity-primary-stats-column {
						width: 320px;
						li {
							margin: 5px 10px;
							.entity-primary-stat-value {
								float: right;
							}
						}
					}
					.entity-primary-stats,
					.entity-primary-stats-column {
						font-size: 18px;
						list-style: none;
						margin: 0;
						padding: 0;
					}
				}
			}
		}
	}

	.all-info-hr {
		border: 1px solid $balcora-highlight-gray;
		margin: 3px 0;
	}

	.cat-display-tbl {
		min-width: 50%;
		max-width: 90%;

		thead {
			text-align: center;
			border-bottom: 1px solid $balcora-highlight-gray;
		}

		tbody {
			border-left: 1px solid $balcora-highlight-gray;
			border-right: 1px solid $balcora-highlight-gray;

			tr {
				td {
					padding: 5px 20px;
					white-space: nowrap;
				}

				td:first-child {
					border-right: 1px solid $balcora-highlight-gray;
				}
			}

			tr:nth-child(even) {
				background-color: $balcora-highlight-gray;

				td:first-child {
					border-right: 1px solid $balcora-base-gray;
				}
			}
		}
	}
}
</style>
