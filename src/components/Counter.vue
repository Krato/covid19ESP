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
                        Infectados
                    </div>
                    <div class="w-full text-yellow-300 text-2xl">
                        <animated-number :duration="1000" :format-value="formatValue" :round="true" :value="confirmed">
                        </animated-number>
                    </div>
                    <div class="w-full text-sm" v-if="todayCases">
                        <span class="text-orange-400">
                            {{ todayCases }}
                        </span>
                        nuevos casos
                    </div>
                </div>
            </div>




            <div class="w-full md:w-2/4 flex flex-wrap items-center justify-center">

                <div class="w-full flex md:hidden flex-wrap self-stretch items-center justify-center font-bold p-1">
                    <div class="flex flex-wrap justify-center items-center w-full bg-gray-900 rounded-md p-2">
                        <div class="text-yellow-300 text-2xl mr-1">
                            <animated-number :duration="1000" :format-value="formatValue" :round="true" :value="confirmed">
                            </animated-number>
                        </div>
                        casos confirmados
                    </div>
                </div>

                <div class="w-full flex md:hidden flex-wrap self-stretch items-center justify-center font-bold p-1" v-if="todayCases">
                    <div class="w-full bg-gray-900 rounded-md p-2">
                        <span class="text-orange-400">
                            {{ todayCases }}
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
                            <animated-number :duration="1000" :format-value="formatValue" :round="true" :value="active">
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
                            <animated-number :duration="1000" :format-value="formatValue" :round="true" :value="deaths">
                            </animated-number>
                        </div>
                    </div>
                </div>
                <div class="w-1/2 flex flex-wrap self-stretch items-center justify-center font-bold p-1">
                    <div class="w-full bg-gray-900 rounded-md p-2">
                        <div class="">Curados</div>
                        <div class="w-full text-green-500">
                            <animated-number :duration="1000" :format-value="formatValue" :round="true" :value="recovered">
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
                            <animated-number :duration="1000" :format-value="formatValue" :round="true" :value="critical">
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
import axios from 'axios'
import countapi from 'countapi-js'
import Papa from 'papaparse'
import AnimatedNumber from "animated-number-vue"
import _ from 'lodash'

export default {
    name: 'Counter',

    components: {
        AnimatedNumber
    },

    data: () => ({
        show: false,
        totals: false,
        confirmed: 0,
        active: 0,
        recovered: 0,
        deaths: 0, 
        critical: 0,
        todayCases: 0,
        todayDeaths: 0
    }),

    computed: {
        ...mapState({
            info: state => state.totals,
            countries: state => state.countries
        }),

        ...mapGetters(['nowByCountry']),

        spain() {
            if (this.countries != false) {
                return this.nowByCountry('es')
            }

            return false
        },
    },

    methods: {
        formatValue(value) {
            return new Intl.NumberFormat("es-ES").format(value);
        },

        parseDataFromCsv(csv) {
            let data = Papa.parse(csv, {
                delimiter: ",",
                newline: "\n"
            }).data;
            
            data = _.toArray(data)
            if (data.length > 2) {
                let datos = []
                let obj = _.zipObject( data[0], data[1] );

                datos = _.transform(obj, (data, value, key) => {
                    data[key.trim().toLowerCase()] = value 
                });

                return datos
            }

            return false
        }
    },

    watch: {
        info(value){
            if (value) {
                let last = new Date(this.info.lastUpdate);
                let hour = ("0" + last.getHours()).slice(-2);
                let minutes = ("0" + last.getMinutes()).slice(-2);

                let lastTime = hour + ':' + minutes
                this.$toasted.clear()
                this.$toasted.show("<div class='block'>Actualizado Hoy a las "+lastTime+"</div>", { 
                    theme: "toasted-primary", 
                    position: "top-center", 
                    duration : 3000
                });
            }
        },

        spain: {
            immediate: true,
            handler (value) {
                if (value != false) {
                    this.confirmed = value.confirmed
                    this.active = value.active
                    this.recovered = value.recovered
                    this.deaths = value.deaths
                    this.critical = value.serious
                    this.todayCases = value.newCases
                }
            }
        },

        totals: {
            immediate: true,
            handler (value) {
                if (value != false) {
                    if (value.casos && (value.casos) > this.confirmed ) {
                        this.confirmed = value.casos

                        this.active = value.casos - value.recuperados - value.defunciones
                    }
                    if (value.recuperados && (value.recuperados) > this.recovered ) {
                        this.recovered = value.recuperados
                    }
                    if (value.defunciones && (value.defunciones) > this.deaths ) {
                        this.deaths = value.defunciones
                    }
                    if (value.hospitalizados && (value.hospitalizados) > this.critical ) {
                        this.critical = value.hospitalizados
                    }
                    if (value.casos24h && (value.casos24h) > this.todayCases ) {
                        this.todayCases = value.casos24h
                    }
                }
            }
        },
    },

    created()
    {
        let gotcha = 'U2FsdGVkX19nTPOTksKGw8JGYiMmWrrANkHUgv0ay9Ha0c5xWL123qf9X5MJBzH90rrwCLe14QoBE7yOeBhc9tUYrluWGGIgZ5XTDvaPpNM='
        let secret = this.CryptoJS.AES.decrypt(gotcha, "FCJDq6rELyrCas4").toString(this.CryptoJS.enc.Utf8)

        let axiosHeaders = {
            headers: { 'secret-key': secret }
        };

        countapi.hit('api-total-spain').then((result) => {
            if (result.value % 100 == 0) {
                axios.get('https://cors-anywhere.herokuapp.com/https://covid19.isciii.es/resources/data.csv', {}, { timeout: 2000 }).then(response => {
                    
                    let totals = this.parseDataFromCsv(response.data)
                    
                    if (totals != false) {

                        this.totals = totals

                        axios.put('https://api.jsonbin.io/b/5e7bcd9a862c46101abe0e59', {data: totals}, axiosHeaders).then(() => {
                        }).catch(error => {
                            console.log(error)
                        });
                    }
                }).catch(() => {
                    axios.get('https://api.jsonbin.io/b/5e7bcd9a862c46101abe0e59/latest', axiosHeaders).then(response => {
                        this.totals = response.data.data
                    }).catch(error => {
                        console.log(error)
                    });
                });
            } else {
                axios.get('https://api.jsonbin.io/b/5e7bcd9a862c46101abe0e59/latest', axiosHeaders).then(response => {
                    this.totals = response.data.data
                }).catch(error => {
                    console.log(error)
                });
            }
        })
    }
}
</script>
