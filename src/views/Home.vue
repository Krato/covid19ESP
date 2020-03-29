<template>
    <div class="p-4">
        
        <div class="flex flex-wrap -mx-4 h-screen">
            <div class="flex flex-wrap w-full lg:w-2/3 px-4 content-start">
                <div class="w-full flex flex-wrap justify-center">
                    <div class="w-2/5 md:w-3/5 lg:w-1/3 p-0 md:p-4 mb-6 lg:mb-0 text-white">
                        <logo class="svg_logo " />
                    </div>
                    <counter />
                </div>
                <div class="w-full flex flex-wrap mt-8 ">
                    <spain v-on:change-ca="changeCa" class="order-1" />
                    <country-details class="order-3 xl:order-2" :key="'country_'+selectedCountry" :iso="selectedCountry" v-if="showChart" @country="changeCountry" />

                    <spain-details  class="order-2 xl:order-3" :ca="selectedCA" @community="changeCAByName" />
                </div>
                <world-map :iso="selectedCountry" />
            </div>
            <div class="w-full lg:w-1/3 px-4 mt-8 lg:mt-0">
                <countries-list @country="changeCountry" class="" />
            </div>
        </div>
        <links />
        <help />
    </div>
</template>

<script>

import Logo from "@/assets/logo.svg";

import Counter from '@/components/Counter.vue';
import CountriesList from '@/components/CountriesList.vue'
import CountryDetails from '@/components/CountryDetails.vue'
import Help from '@/components/Help.vue'
import Links from '@/components/Links.vue'
import Spain from '@/components/Spain.vue'
import SpainDetails from '@/components/SpainDetails.vue'
import WorldMap from '@/components/Map.vue'


export default {
    name: 'Home',
    components: {
        Counter,
        CountriesList,
        CountryDetails,
        Spain,
        SpainDetails,
        WorldMap,
        Logo,
        Links,
        Help
    },
    data() {
        return {
            showChart: true,
            selectedCountry: 'ES',
            selectedCA: 'Total'
        }
    },
    methods: {
        changeCountry(iso) {
            this.selectedCountry = iso
        },
        changeCa(ca) {
            let name = ca.original
            if (ca.original == 'Castilla La Mancha') {
                name = 'Castilla-La Mancha'
            }
            this.selectedCA = name
        },
        changeCAByName(name) {
            this.selectedCA = name
        }
    }
}
</script>
