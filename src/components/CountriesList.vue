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
              <div class="w-1/4 xl:w-1/5 flex flex-wrap justify-center items-center">
                <div class="w-full text-orange-400 font-bold">
                  {{ fixNumber(this.critical) }}
                </div>
                <div class="w-full text-xxs md:text-sm">
                  Críticos
                </div>
              </div>
          </div>

          <input type="text" v-model="search" placeholder="Busca por país" class="w-full search border border-gray-700 ">
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
            <div
              :key="index"
              class="country-list w-full flex flex-wrap  items-center text-center  border-b border-gray-700 cursor-pointer p-2"
              @click="changeCountry(country)"
            >
              <!-- <div class="flex flex-wrap  items-center bg-gray-900 rounded-md py-2"> -->
                <div class="country-flag w-auto md:w-1/5 flex flex-wrap items-center py-2 px-2 md:px-2">
                  <div class="w-full">
                    <template v-if="country.iso != 'others'">
                      <div class="hidden xl:block">
                        <country-flag v-if="country.iso3" :country="country.iso3" size="small" />
                      </div>
                      <div class="xl:hidden">
                        <country-flag  v-if="country.iso3" :country="country.iso3" />
                      </div>
                    </template>
                  </div>
                  <div class="w-full text-xs hidden xl:block  md:text-sm">
                    {{ country.country }}
                  </div>
                </div>
                <div class="w-auto md:w-1/5 flex flex-wrap items-center">
                  
                      <div class="w-full text-sm md:text-base text-yellow-300 font-bold">
                        {{ fixNumber(country.confirmed) }}
                      </div>
                      <div class="w-full text-xxs xl:text-sm">
                        Infectados
                      </div>
                  
                  
                </div>

                <div class="w-auto md:w-1/5 flex flex-wrap items-center">
                  
                      <div class="w-full text-sm md:text-base text-green-500 font-bold">
                        {{ fixNumber(country.recovered) }}
                      </div>
                      <div class="w-full text-xxs xl:text-sm">
                        Curados
                      </div>
                  
                  
                </div>

                <div class="w-auto md:w-1/5 flex flex-wrap items-center">
                  
                      <div class="w-full text-sm md:text-base text-red-500 font-bold">
                        {{ fixNumber(country.deaths) }}
                      </div>
                      <div class="w-full text-xxs xl:text-sm">
                        Muertes
                      </div>
                  
                  
                </div>

                <div class="w-auto md:w-1/5 md:flex flex-wrap items-center">
                  
                      <div class="w-full text-sm md:text-base text-orange-400 font-bold">
                        {{ fixNumber(country.critical) }}
                      </div>
                      <div class="w-full text-xxs xl:text-sm">
                        Críticos
                      </div>
                  
                  
                </div>

              <!-- </div> -->
            </div>
          </template>
        </vuescroll>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import _ from 'lodash'
import CountryFlag from 'vue-country-flag'
import vuescroll from 'vuescroll';

export default {
    name: 'CountriesList',
    components: {
        CountryFlag,
        vuescroll
    },
    data: () => ({
        search: null,
        show: false,
        scrollOptions: {
            scrollPanel: {
                scrollingX: false,
                easing: 'easeInQuad'
            },
            rail: {
                gutterOfSide: '5px',
                background: '#1a202c',
                keepShow: true,
                opacity: 0.5,
                size: '12px',
            },
            bar: {
                onlyShowBarOnScroll: false,
                background: '#718096',
                size: '16px',
                keepShow: true,
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

                return this.countries
            }

            return []
        },

        critical() {
            if (this.countryList) {
                return _.sumBy(this.countryList, 'critical');
            }

            return 0
        }
    },
    mounted() {
        //
    },
    methods: {
        fixNumber(value) {
            return new Intl.NumberFormat("es-ES").format(value)
        },

        changeCountry(country) {
            if (_.has(country, 'iso2')) {
                this.$emit('country', country.iso2)    
            }
        }
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


<style scoped>

</style>
