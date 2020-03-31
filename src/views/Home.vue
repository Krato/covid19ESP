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

                    <spain-last-five-days  class="order-2 xl:order-2" :ca="selectedCA" @community="changeCAByName" />

                    <country-details class="hidden order-3 xl:order-3" :key="'country_'+selectedCountry" :iso="selectedCountry" v-if="showChart" @country="changeCountry" />

                    <spain-details class="order-4 xl:order-4" :ca="selectedCA" @community="changeCAByName" />
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
import Vue from 'vue'

import Logo from "@/assets/logo.svg";

import Counter from '@/components/Counter.vue'
// import Countries from '@/components/Countries.vue'
import CountriesList from '@/components/CountriesList.vue'
import CountryDetails from '@/components/CountryDetails.vue'
import Mapa from '@/components/Map.vue'
import Spain from '@/components/Spain.vue'
import SpainDetails from '@/components/SpainDetails.vue'
import SpainLastFiveDays from '@/components/SpainLastFiveDays.vue'
import Links from '@/components/Links.vue'
import Help from '@/components/Help.vue'

import 'vue-loaders/dist/vue-loaders.css'
import VueLoaders from 'vue-loaders'
Vue.use(VueLoaders);

export default {
    name: 'Home',
    components: {
        'counter': Counter,
        // 'countries': Countries,
        'countries-list': CountriesList,
        'country-details': CountryDetails,
        'spain': Spain,
        'spain-details': SpainDetails,
        'spain-last-five-days': SpainLastFiveDays,
        'world-map': Mapa,
        'logo': Logo,
        'links': Links,
        'help': Help
    },
    data: () => ({
        showChart: true,
        selectedCountry: 'ES',
        selectedCA: 'Total',
        selectedCALastDays: 'Total',
        hide: true
    }),
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
        },
        changeCAByNameLast(name) {
            this.selectedCALastDays = name
        }
    }, 
    mounted() {
        // this.$toasted.clear()      
        // this.$toasted.show("<div class='block'>Actualizado Hoy a las 18:20</div>", { 
        //     theme: "toasted-primary", 
        //     position: "top-center", 
        //     duration : 3000
        // });

    }
}
</script>
