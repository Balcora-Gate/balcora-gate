<template>
	<main id="home">
		<header id="home-banner">
			<img src="@/assets/balcora-logo-small.png" />
			<h1 class="title">BALCORA</h1>
			<p class="tagline">Homeworld made transparent.</p>
			<hr>
		</header>
		<nav id="home-community-links">
			<p>
				Links to other community resources:
			</p>
			<ul class="community-links clean-list">
				<li>
					<external-link href="https://discord.gg/homeworld">
						<img src="@/assets/discord-logo-small.png" alt="Official Discord" />
						Official Homeworld Discord
					</external-link>
				</li>
				<li>
					<external-link href="https://karosgraveyard.fandom.com/wiki/Karos_Graveyard_Wiki">
						<img src="@/assets/cog-wheel-green.png" alt="Karos Graveyard" />
						Modding Wiki
					</external-link>
				</li>
				<li>
					<external-link href="https://homeworld.fandom.com/wiki/Main_Page">
						<img src="@/assets/hw1c-logo.png" alt="Encyclopedia Hiigara">
						Ships / Lore Wiki
					</external-link>
				</li>
			</ul>
		</nav>
	</main>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import ExternalLink from '@/components/cmp/ExternalLink.vue';

@Component({
	components: {
		ExternalLink
	}
})
export default class Home extends Vue {};
</script>

<style lang="scss" scoped>
@import "styles/_mixins";
#home {
	margin: 10vh 24px;
	@include vertical-centered();
	& > * {
		@include vertical-centered();
	}
	#home-banner {
		.title {
			font-size: 3em;
			font-weight: bold;
			margin: 0;
		}
		.tagline {
			font-family: "Menlo", "Liberation Mono", "Consolas", "DejaVu Sans Mono", "Ubuntu Mono", "Courier New", "andale mono", "lucida console", monospace;
		}
	}
	#home-community-links {
		margin-top: 80px;
		.community-links {
			@include horizontal-centered();
			& > li {
				margin: 0 10px;
			}
			img {
				max-height: 64px;
				width: auto;
			}
		}
	}
}
</style>
