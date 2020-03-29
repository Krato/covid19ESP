<template>
    <div
        :key="index"
        class="country-list w-full flex flex-wrap  items-center text-center  border-b border-gray-700 cursor-pointer p-2 relative"
        @click="changeCountry(country)"
        v-hover-intent="showExtraData.bind(null, index)"
        @mouseleave="hideExtraInfo"
        :class="{'show-extra': showMoreInfo == index}"
    >   
        <div ref="extra" class="more-info absolute h-full left-0 bg-gray-900 flex flex-wrap justify-between lg:justify-start items-center w-0 z-10">    
            <transition name="fade">
                <div class="block-info country-flag w-auto md:w-1/5 flex-wrap items-center"
                    :class="{'hidden': !showExtraItems, 'flex': showExtraItems && (showMoreInfo == index)}">
                  <div class="w-full">
                    <!-- <template v-if="country.iso3 == 'cruise'">
                        <cruise></cruise>
                    </template> -->
                    <template v-if="country.iso != 'others'">
                      <div class="hidden xl:block" v-if="country.iso3 != null">
                        <country-flag :test="country" :country="country.iso3" size="small" />
                      </div>
                      <div class="xl:hidden" v-if="country.iso3 != null">
                        <country-flag :test="country" :country="country.iso3" />
                      </div>
                    </template>
                  </div>
                  <div class="w-full text-xs hidden xl:block  md:text-sm">
                    {{ country.country }}
                  </div>
                </div>
            </transition>

            <transition name="fade" leave-stagger="0">
                <div class="block-info w-auto md:w-1/5 flex-wrap items-center" v-if="showExtraItems && (showMoreInfo == index)">
                  
                      <div class="w-full text-sm md:text-base text-yellow-300 font-bold">
                        {{ fixNumber(country.active) }}
                      </div>
                      <div class="w-full text-xxs xl:text-sm">
                        Activos
                      </div>
                </div>
            </transition>

            <transition name="fade" leave-stagger="0">
                <div class="block-info w-auto md:w-1/5 flex-wrap items-center" v-if="showExtraItems && (showMoreInfo == index)">
                  
                      <div class="w-full text-sm md:text-base text-orange-400 font-bold">
                        {{ fixNumber(country.critical) }}
                      </div>
                      <div class="w-full text-xxs xl:text-sm">
                        Críticos
                      </div>
                </div>
            </transition>

            <transition name="fade" leave-stagger="0">
                <div class="block-info w-auto md:w-1/5 flex-wrap items-center pr-4 md:pr-0" v-if="showExtraItems && (showMoreInfo == index)">
                  
                      <div class="w-full text-xxs xl:text-xs text-yellow-300 font-bold whitespace-no-wrap">
                        {{ fixNumber(country.casesPerOneMillion) }} Infectados / Millón
                      </div>
                      <div class="w-full text-xxs xl:text-xs text-red-500 font-bold whitespace-no-wrap">
                        {{ fixNumber(country.deathsPerOneMillion) }} Muertes / Millon
                      </div>
                </div>
            </transition>

            <transition name="fade" leave-stagger="0">
                <div class="block-info w-auto md:w-1/5">

                </div>
            </transition>

            

        </div>
      <!-- <div class="flex flex-wrap  items-center bg-gray-900 rounded-md py-2"> -->
        <div class="country-flag w-auto md:w-1/5 flex flex-wrap items-center">
          <div class="w-full">
            <!-- <template v-if="country.iso3 == 'cruise'">
                <cruise></cruise>
            </template> -->
            <template v-if="country.iso != 'others'">
              <div class="hidden xl:block" v-if="country.iso3 != null">
                <country-flag :test="country" :country="country.iso3" size="small" />
              </div>
              <div class="xl:hidden" v-if="country.iso3 != null">
                <country-flag :test="country" :country="country.iso3" />
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

        <div class="w-auto md:w-1/5 md:flex flex-wrap items-center text-left">

            <div class="w-full text-xxs text-yellow-300 font-bold whitespace-no-wrap">
                + {{ fixNumber(country.todayCases) }} casos
            </div>

            <div class="w-full text-xxs  text-red-500 font-bold whitespace-no-wrap">
                + {{ fixNumber(country.todayDeaths) }} muertes
            </div>
            <!-- <div class="w-full text-xxs xl:text-sm">
            Críticos
            </div> -->
          
              <!-- <div class="w-full text-sm md:text-base text-orange-400 font-bold">
                {{ fixNumber(country.critical) }}
              </div>
              <div class="w-full text-xxs xl:text-sm">
                Críticos
              </div> -->
          
          
        </div>

      <!-- </div> -->
    </div>
</template>
<script>
import Vue from 'vue'
import CountryFlag from 'vue-country-flag'
import HoverIntent from 'vue2-hover-intent'
Vue.directive('hover-intent', HoverIntent)

export default {
    name: 'CountryRow',
    components: {
        CountryFlag,
    },
    props: {
        country: {
            type: Object,
            required: true
        },
        index: {
            type: Number,
            required: true
        }
    },
    data: () => ({
        showMoreInfo: null,
        showExtraItems: false,
    }), 

    mounted() {
        this.$nextTick(() => {
            let element = this.$refs.extra;

            this.registerTransitionEndEvent(element, () => {
                if (element.offsetWidth > 100) {
                    this.showExtraItems = true
                }

                if (element.offsetWidth == 0) {
                    this.showExtraItems = false
                }
            })
        })
    },

    methods: {
        fixNumber(value) {
            return new Intl.NumberFormat("es-ES").format(value)
        },

        changeCountry(country) {
            setTimeout(() =>{
                this.$emit('change', country)
            }, 500)
        },

        showExtraData(index) {
            this.showMoreInfo = index
        },

        hideExtraInfo() {
            this.showExtraItems = false
            this.showMoreInfo = null
        },
        registerTransitionEndEvent(obj, callback){
            var transitions = {
                'WebkitTransition' : 'webkitTransitionEnd',
                'MozTransition'    : 'transitionend',
                'MSTransition'     : 'msTransitionEnd',
                'OTransition'      : 'oTransitionEnd',
                'transition'       : 'transitionend'
            };
            for(var t in transitions){
                if(obj.style[t] !== undefined){
                    obj.addEventListener(transitions[t], function(event){
                        callback(event);
                    }, false);
                    break;
                }
            }
        }
    }
}

</script>