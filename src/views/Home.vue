<template>
  <div class="p-4">
    <div class="flex flex-wrap -mx-4 h-screen">
      <div class="flex flex-wrap w-full lg:w-2/3 px-4">
		<div class="w-full flex flex-wrap justify-center">
			<logo class="w-3/5 lg:w-1/3 p-0 md:p-4 mb-4 lg:mb-0" />
			<counter />
		</div>
        <country-details
          v-if="showChart"
          :iso="selectedCountry"
        />
        <world-map :iso="selectedCountry" />
      </div>
      <div class="w-full lg:w-1/3 px-4 mt-8 lg:mt-0">
        <countries-list
          class=""
          @country="changeCountry"
        />
      </div>

			
      <!-- 
			<countries class="hidden mt-20"
			v-on:country="changeCountry" /> -->
    </div>
  </div>
</template>

<script>
import Vue from 'vue'

import Logo from "@/assets/logo.svg";

import Counter from '@/components/Counter.vue'
// import Countries from '@/components/Countries.vue'
import CountriesList from '@/components/CountriesList.vue'
import CountryDetails from '@/components/CountryDetails.vue'
import Mapa from '@/components/Map.vue'

import 'vue-loaders/dist/vue-loaders.css';
import VueLoaders from 'vue-loaders';
Vue.use(VueLoaders);

export default {
	name: 'Home',
	components: {
		'counter': Counter,
		// 'countries': Countries,
		'countries-list': CountriesList,
		'country-details': CountryDetails,
		'world-map': Mapa,
		'logo': Logo
	},
	data: () => ({
		showChart: true,
		selectedCountry: 'es', 
	}),
	methods: {
		changeCountry(iso) {
			this.selectedCountry = iso
		}
	}
}
</script>
