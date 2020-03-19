<template>
    <div class="flex items-center shadow-lg bg-gray-800 rounded-lg w-full lg:w-2/3">

        <div class="w-full h-full flex justify-center items-center" v-if="!spain">
            <vue-loaders color="#90CDF4" name="ball-scale" scale="1.2">
            </vue-loaders>
        </div>

        <div class="w-full flex flex-wrap items-center text-center" v-if="spain">
            <div class="w-full md:w-1/4">
                <div class="flex justify-center items-center px-2">
                    <h2 class="text-xl font-bold p-2">
                        Datos en España
                    </h2>
                </div>
            </div>
            <div class="hidden md:flex w-full md:w-1/4 flex flex-wrap items-center font-bold">
                <div class="hidden md:flex flex-wrap">
                    <div class="w-full ">
                        Confirmados
                    </div>
                    <div class="w-full text-yellow-300 text-2xl">
                        <animated-number :duration="1000" :format-value="formatValue" :round="true" :value="spain.confirmed">
                        </animated-number>
                    </div>
                    <div class="w-full text-sm" v-if="spain.newCases">
                        <span class="text-orange-400">
                            {{ spain.newCases }}
                        </span>
                        nuevos casos
                    </div>
                </div>
            </div>




            <div class="w-full md:w-2/4 flex flex-wrap items-center justify-center">

                <div class="w-full flex md:hidden flex-wrap self-stretch items-center justify-center font-bold p-1">
                    <div class="flex flex-wrap justify-center items-center w-full bg-gray-900 rounded-md p-2">
                        <div class="text-yellow-300 text-2xl mr-1">
                            <animated-number :duration="1000" :format-value="formatValue" :round="true" :value="spain.confirmed">
                            </animated-number>
                        </div>
                        casos confirmados
                    </div>
                </div>

                <div class="w-full flex md:hidden flex-wrap self-stretch items-center justify-center font-bold p-1" v-if="spain.newCases">
                    <div class="w-full bg-gray-900 rounded-md p-2">
                        <span class="text-orange-400">
                            {{ spain.newCases }}
                        </span>
                        nuevos casos
                    </div>
                </div>
                
                <div class="w-1/2 flex flex-wrap self-stretch items-center justify-center font-bold p-1">
                    <div class="w-full bg-gray-900 rounded-md p-2">
                        <div class="w-full">
                            Activos
                        </div>
                        <div class="w-full text-yellow-300">
                            <animated-number :duration="1000" :format-value="formatValue" :round="true" :value="spain.active">
                            </animated-number>
                        </div>
                    </div>
                </div>
                <div class="w-1/2 flex flex-wrap self-stretch items-center justify-center font-bold p-1">
                    <div class="w-full bg-gray-900 rounded-md p-2">
                        <div class="">
                            Muertes
                        </div>
                        <div class="w-full text-red-500">
                            <animated-number :duration="1000" :format-value="formatValue" :round="true" :value="spain.deaths">
                            </animated-number>
                        </div>
                    </div>
                </div>
                <div class="w-1/2 flex flex-wrap self-stretch items-center justify-center font-bold p-1">
                    <div class="w-full bg-gray-900 rounded-md p-2">
                        <div class="">Recuperados</div>
                        <div class="w-full text-green-500">
                            <animated-number :duration="1000" :format-value="formatValue" :round="true" :value="spain.recovered">
                            </animated-number>
                        </div>
                    </div>
                </div>
                <div class="w-1/2 flex flex-wrap self-stretch items-center justify-center font-bold p-1">
                    <div class="w-full bg-gray-900 rounded-md p-2">
                        <div class="">
                            Críticos
                        </div>
                        <div class="w-full text-orange-400">
                            <animated-number :duration="1000" :format-value="formatValue" :round="true" :value="spain.serious">
                            </animated-number>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

import { mapState, mapGetters } from 'vuex'
import AnimatedNumber from "animated-number-vue";

export default {
    name: 'Counter',

    components: {
        AnimatedNumber
    },

    computed: {
        ...mapState({
            info: state => state.totals,
            // worldometer: state => state.worldometer
        }),

        ...mapGetters(['nowByCountry']),

        spain() {
            if (this.worldometer != false) {
                return this.nowByCountry('es')
            }

            return false
        },
    },

    methods: {
        formatValue(value) {
            return new Intl.NumberFormat("es-ES").format(value);
        }
    }
}
</script>
