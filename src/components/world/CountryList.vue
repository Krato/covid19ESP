<template>
    <div class="w-full  xl:w-full mb-12 xl:mb-0 px-4 text-white">
        <div class="relative flex flex-col min-w-0 break-words bg-gray-900 w-full mb-6 shadow-lg rounded">
            <div class="rounded-t mb-0 py-3 border-0">
                <div class="flex flex-wrap items-center">
                    <div class="relative w-full px-4 max-w-full flex-grow lg:flex-1">
                        <h3 class="font-semibold text-base text-gray-200">
                            Mundo
                        </h3>
                        <h2 class="text-white text-xl font-semibold"  :key="'country_total'">
                            Listado por Países
                        </h2>
                    </div>
                    <div class="w-full lg:flex-1 flex-wrap mt-2 md:mt-0">
                        <div class="w-full flex justify-around px-4 items-center">
                            <input class="flex-grow w-full search " placeholder="Busca por país" type="text" v-model="search">
                            <div class="flex-grow bg-gray-900 text-sm text-right">
                                <v-selectmenu :data="menuOrder" :query="false" :title="false" align="right" ref="order" type="advanced" v-model="order">
                                    <button class="whitespace-no-wrap" type="button">
                                        <template v-if="order != 'none'">
                                            Ordenado por
                                        </template>
                                        <span :class="getClassMenu(order)">
                                            {{ menuTexto[order] }}
                                        </span>
                                        <svg class="fill-current text-gray-300 inline align-middle" height="8" viewbox="0 0 24 24" width="8" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M0 7.33l2.829-2.83 9.175 9.339 9.167-9.339 2.829 2.83-11.996 12.17z">
                                            </path>
                                        </svg>
                                        <!-- <img src="@/assets/select-arrows.png"> -->
                                    </button>
                                    <template #row="{ row }">
                                        <span :class="row.color" v-html="row.name">
                                        </span>
                                    </template>
                                </v-selectmenu>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="block h-screen w-full rounded-b  lg:px-2 lg:pb-4 ">

                <div class="w-full flex justify-center items-center pb-8" v-if="!noEmpty(countries)">
                    <vue-loaders color="#90CDF4" name="ball-scale" scale="1"></vue-loaders>
                </div>

                <vuescroll :ops="scrollOptions" v-if="noEmpty(countries)">
                    <template v-for="(country, index) in countryList">
                        <template v-if="country.country != 'World'">
                            <country-row :country="country" :index="index" :key="'country_'+index" v-on:selected="countryDetails">
                            </country-row>
                        </template>
                    </template>
                </vuescroll>
                
            </div>
        </div>
    </div>
</template>

<script>
import Vue from 'vue'

import _ from 'lodash'
import vuescroll from 'vuescroll'
import CountryRow from './CountryRow'
import vSelectMenu from 'v-selectmenu'
Vue.use(vSelectMenu, {
    language: 'es'
})

export default {
    name: 'CountriesList',
    props: {
        countries: {
            type: Array,
            required: true
        },
    },
    components: {
        vuescroll,
        CountryRow,
    },
    data: () => ({
        search: null,
        show: false,
        order: 'confirmed',
        shouldShowModal: false,
        selectedCountry: null,
        selectedCountryIso: null,
        menuOrder: [
            // { id: 'none', name: 'Orden por defecto', color: 'text-gray-400'},
            { id: 'confirmed', name: 'Confirmados', color: 'text-purple-300'},
            { id: 'active', name: 'Activos', color: 'text-yellow-300'},
            { id: 'recovered', name: 'Recuperados', color: 'text-green-500'},
            { id: 'deaths', name: 'Muertes', color: 'text-red-500'},
            { id: 'todayCases', name: 'Infectados hoy', color: 'text-yellow-300'},
            { id: 'todayDeaths', name: 'Muertes hoy', color: 'text-red-500'},
            // { id: 'critical', name: 'Críticos', color: 'text-orange-400'},
        ],
        menuTexto: {
            'none': 'Ordernar por',
            'confirmed': 'Confirmados',
            'active': 'Activos',
            'recovered': 'Recuperados',
            'deaths': 'Muertes',
            'todayCases': 'Infectados/Hoy',
            'todayDeaths': 'Muertes/Hoy',
            'critical': 'Críticos',
        },
        menuColor: {
            'confirmed': 'text-purple-300',
            'active': 'text-yellow-300',
            'recovered': 'text-green-500',
            'deaths': 'text-red-500',
            'todayCases': 'text-yellow-300',
            'todayDeaths': 'text-red-500',
            'critical': 'text-orange-400',
        },
        scrollOptions: {
            scrollPanel: {
                scrollingX: false,
                easing: 'easeInQuad'
            },
            rail: {
                gutterOfSide: '2px',
                background: '#1a202c',
                keepShow: false,
                opacity: 0.5,
                size: '8px',
            },
            bar: {
                onlyShowBarOnScroll: true,
                background: '#718096',
                size: '6px',
                keepShow: false,
                opacity: 1,
            }
        }
    }),
    computed: {

        countryList() {
            if (this.countries) {

                if (this.search) {
                    return this.countries.filter((item) => {
                        return item.country.toLowerCase().includes(this.search.toLowerCase())
                    })
                }

                return _.sortBy(this.countries, this.order).reverse();
            }

            return []
        },

        critical() {
            if (this.countryList) {
                return _.sumBy(this.countryList, 'critical');
            }

            return 0
        },

        todayCasesTotal() {
            if (this.countryList) {
                return _.sumBy(this.countryList, 'todayCases');
            }

            return 0
        },

        todayDeathsTotal() {
            if (this.countryList) {
                return _.sumBy(this.countryList, 'todayDeaths');
            }

            return 0
        },

        totales() {
            if (this.countryList) {
                return _.find(this.countryList, {'country': 'World'});
            }

            return null
        },

        selectedCountryName() {
            if (this.selectedCountry) {
                return this.selectedCountry.country + ' - Históricos por días'    
            } 
            return ''
        },

    },
    mounted() {
        // this.$refs.order.i18n.advanced_default = "Ordenar por";
    },
    methods: {
        fixNumber(value) {
            return new Intl.NumberFormat("es-ES").format(value)
        },

        countryDetails(country) {
            if (_.has(country, 'iso3')) {
                this.$emit('country-info', country)
            }
        },

        getClassMenu(order) {
            if (order) {
                return this.menuColor[order]
            }
        },

        noEmpty(value) {
            return (_.size(value) > 0)
        },
    },

    watch: {
        countryList(list) {
            if (list.length > 0) {
                this.show = true;
            }
        }
    }
}
</script>


<style>
ul.sm-results>li.sm-over {
    background: #2D3748 !important;
    color: inherit;
}
</style>
