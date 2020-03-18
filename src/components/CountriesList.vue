<template>
  <div class="h-screen relative">
    <div class="flex flex-wrap justify-center overflow-y-auto rounded-lg bg-gray-800 shadow-lg">
      <div class="w-full flex flex-wrap items-center text-center border-b border-gray-700 p-2">
        <div class="p-2 w-full self-start">
          <div class="p-2 w-full flex flex-wrap" v-if="totals">
              <div class="w-1/4 flex flex-wrap items-center p-2">
                Totales
              </div>
              <div class="w-1/4 flex flex-wrap items-center p-2">
                <div class="w-full text-yellow-300 font-bold">
                  {{ fixNumber(totals.confirmed) }}
                </div>
                <div class="w-full text-sm">
                  Confirmados
                </div>
              </div>
              <div class="w-1/4 flex flex-wrap items-center p-2">
                <div class="w-full text-green-500 font-bold">
                  {{ fixNumber(totals.recovered) }}
                </div>
                <div class="w-full text-sm">
                  Recuperados
                </div>
              </div>
              <div class="w-1/4 flex flex-wrap items-center p-2">
                <div class="w-full text-red-500 font-bold">
                  {{ fixNumber(totals.deaths) }}
                </div>
                <div class="w-full text-sm">
                  Muertes
                </div>
              </div>
          </div>

          <input type="text" v-model="search" placeholder="Busca por país" class="w-full search border border-gray-700 ">
        </div>
      </div>
      <div class="list-height w-full overflow-y-auto">

        <div v-if="!show" class="w-full h-full flex justify-center items-center">
            <vue-loaders
                name="ball-scale"
                color="#90CDF4"
                scale="1.2"
            />
        </div>

        <template v-for="(country, index) in countryList">
          <div
            :key="index"
            class="w-full flex flex-wrap  items-center text-center border-b border-gray-700 cursor-pointer p-2"
            @click="changeCountry(country)"
          >
            <div class="w-1/4 flex flex-wrap items-center p-2">
              <div class="w-full">
                <template v-if="country.iso != 'others'">
                  <country-flag v-if="country.iso3" :country="country.iso3" size="small" />
                </template>
              </div>
              <div class="w-full">
                {{ country.country }}
              </div>
            </div>
            <div class="w-1/4 flex flex-wrap items-center">
              <div class="w-full text-yellow-300 font-bold">
                {{ fixNumber(country.confirmed) }}
              </div>
              <div class="w-full text-sm">
                Confirmados
              </div>
            </div>

            <div class="w-1/4 flex flex-wrap items-center">
              <div class="w-full text-green-500 font-bold">
                {{ fixNumber(country.recovered) }}
              </div>
              <div class="w-full text-sm">
                Recuperados
              </div>
            </div>

            <div class="w-1/4 flex flex-wrap items-center">
              <div class="w-full text-red-500 font-bold">
                {{ fixNumber(country.deaths) }}
              </div>
              <div class="w-full text-sm">
                Muertes
              </div>
            </div>

            <!-- <div class="w-1/5 flex flex-wrap items-center">
                            <div class="w-full text-red-600 font-bold">
                                {{ fixNumber(country.serious) }}
                            </div>
                            <div class="w-full text-sm">
                                Graves
                            </div>
                        </div> -->
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import _ from 'lodash'
import CountryFlag from 'vue-country-flag'

export default {
    name: 'CountriesList',
    components: {
        CountryFlag
    },
    data: () => ({
        search: null,
        show: false
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
