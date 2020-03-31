<template>
  <div class="h-screen relative">
    <div class="list-countries flex flex-wrap justify-center overflow-y-auto rounded-lg bg-gray-800 shadow-lg">
        <div class="w-full flex flex-wrap items-center text-center border-b border-gray-700 p-2">
            <div class="w-full self-start py-2">
              <div class="xl:hidden flex justify-center font-bold" v-if="totals">
                Totales por países
              </div>
              <div class="py-2 w-full flex flex-wrap" v-if="totals">
                  <div class="hidden w-1/4 md:w-1/5 xl:flex flex-wrap items-center">
                    <div class="w-full text-center">
                      Totales
                    </div>
                  </div>
                  <div class="w-1/4 xl:w-1/5 flex flex-wrap justify-center items-center">
                      <div class="w-full text-yellow-300 font-bold">
                        {{ fixNumber(totals.confirmed) }}
                      </div>
                      <div class="w-full text-xxs md:text-sm">
                        Infectados
                      </div>
                  </div>
                  <div class="w-1/4 xl:w-1/5 flex flex-wrap justify-center items-center">
                    <div class="w-full text-green-500 font-bold">
                      {{ fixNumber(totals.recovered) }}
                    </div>
                    <div class="w-full text-xxs md:text-sm">
                      Curados
                    </div>
                  </div>
                  <div class="w-1/4 xl:w-1/5 flex flex-wrap justify-center items-center">
                    <div class="w-full text-red-500 font-bold">
                      {{ fixNumber(totals.deaths) }}
                    </div>
                    <div class="w-full text-xxs md:text-sm">
                      Muertes
                    </div>
                  </div>
                  <div class="w-1/4 xl:w-1/5 flex flex-wrap justify-center text-left items-center">

                        <div class="w-full text-xxs  md:text-xs text-yellow-300 font-bold whitespace-no-wrap">
                            + {{ fixNumber(todayCasesTotal) }} casos
                        </div>

                        <div class="w-full text-xxs  md:text-xs  text-red-500 font-bold whitespace-no-wrap">
                            + {{ fixNumber(todayDeathsTotal) }} muertes
                        </div>


                    <!-- <div class="w-full text-orange-400 font-bold">
                      {{ fixNumber(this.critical) }}
                    </div>
                    <div class="w-full text-xxs md:text-sm">
                      Críticos
                    </div> -->
                  </div>
                </div>

                <div class="w-full flex justify-around items-center bg-gray-900 border-gray-700">
                    <div class="w-full flex justify-around px-4 items-center">
                        <input type="text" v-model="search" placeholder="Busca por país" class="flex-grow w-full search  ">

                        <div class="flex-grow bg-gray-900 text-sm text-right">
                            <v-selectmenu v-model="order" ref="order" :data="menuOrder" align="right" :title="false" :query="false" type="advanced">
                                <button type="button" class="whitespace-no-wrap">
                                    <template v-if="order != 'none'">
                                        Ordenado por 
                                    </template>
                                    <span :class="getClassMenu(order)"> 
                                        {{ menuTexto[order] }}
                                    </span>
                                    <svg xmlns="http://www.w3.org/2000/svg" class="fill-current text-gray-300 inline align-middle" width="8" height="8" viewBox="0 0 24 24"><path d="M0 7.33l2.829-2.83 9.175 9.339 9.167-9.339 2.829 2.83-11.996 12.17z"/></svg>
                                    <!-- <img src="@/assets/select-arrows.png"> -->
                                </button>
                                <template #row="{ row }">
                                    <span :class="row.color" v-html="row.name"></span>
                                </template>
                            </v-selectmenu>

                        </div>
                    </div>
                    
                    
                </div>
              
            </div>
          </div>
          <div class="list-height w-full">
            <div v-if="!show" class="w-full h-full flex justify-center items-center">
                <vue-loaders
                    name="ball-scale"
                    color="#90CDF4"
                    scale="1.2"
                />
            </div>
            <vuescroll :ops="scrollOptions">
                <template v-for="(country, index) in countryList">
                    <country-row :key="'country_'+index" :country="country" :index="index" v-on:change="changeCountry" />
                </template>
            </vuescroll>
          </div>
        </div>

        <modal :title="selectedCountryName" :showing="shouldShowModal" @close="shouldShowModal = false" ref="ayuda" class="text-xs md:text-sm">
            <details-chart :iso="selectedCountryIso"></details-chart>
        </modal>
    </div>
</template>

<script>
import Vue from 'vue'
import { mapState } from 'vuex'
import _ from 'lodash'
import vuescroll from 'vuescroll'
import vSelectMenu from 'v-selectmenu'
import CountryRow from './CountryRow'
import Modal from './Modal'
import DetailsChart from './DetailsChart'

Vue.use(vSelectMenu, {
    language: 'es'
})

export default {
    name: 'CountriesList',
    components: {
        vuescroll,
        CountryRow,
        Modal,
        DetailsChart
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
            { id: 'confirmed', name: 'Infectados', color: 'text-yellow-300'},
            { id: 'recovered', name: 'Recuperados', color: 'text-green-500'},
            { id: 'deaths', name: 'Muertes', color: 'text-red-500'},
            { id: 'todayCases', name: 'Infectados hoy', color: 'text-yellow-300'},
            { id: 'todayDeaths', name: 'Muertes hoy', color: 'text-red-500'},
            // { id: 'critical', name: 'Críticos', color: 'text-orange-400'},
        ],
        menuTexto: {
            'none': 'Ordernar por',
            'confirmed': 'Infectados',
            'recovered': 'Recuperados',
            'deaths': 'Muertes',
            'todayCases': 'Infectados/Hoy',
            'todayDeaths': 'Muertes/Hoy',
            'critical': 'Críticos',
        },
        menuColor: {
            'confirmed': 'text-yellow-300',
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
        ...mapState({
            countries: state => state.countries,
            totals: state => state.totals,
        }),

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

        selectedCountryName() {
            if (this.selectedCountry) {
                return this.selectedCountry.country + ' - Históricos por días'    
            } 
            return ''
        }
    },
    mounted() {
        this.$refs.order.i18n.advanced_default = "Ordenar por";
    },
    methods: {
        fixNumber(value) {
            return new Intl.NumberFormat("es-ES").format(value)
        },

        changeCountry(country) {
            if (_.has(country, 'iso2')) {
                this.selectedCountry = country
                this.selectedCountryIso = country.iso2
                this.shouldShowModal = true
                // console.log(country)
                // this.$emit('country', country.iso2)    
            }
        },

        getClassMenu(order) {
            if (order) {
                return this.menuColor[order]
            }
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
