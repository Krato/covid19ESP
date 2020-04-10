<template>
    <div class="w-full">
        <div class="relative flex flex-col min-w-0 break-words w-full shadow-lg rounded bg-gray-900">
            <div class="rounded-t mb-0 px-4 py-3 bg-transparent">
                <div class="flex flex-wrap items-center">
                    <div class="relative w-full max-w-full flex-grow flex-1">
                        <h6 class="uppercase text-gray-200 mb-1 text-xs font-semibold">
                            Datos del virus por país
                        </h6>
                        <div class="flex flex-wrap">
                            <transition name="fade" mode="out-in">
                                <h2 class="text-white text-xl font-semibold"  :key="'country_total'">
                                    {{ subTitle }}
                                </h2>
                            </transition>
                        </div>
                    </div>
                    <div class="flex flex-wrap mt-2 md:mt-0 text-white text-xl self-start" v-on:click="close">
                        <i class="far fa-times-circle cursor-pointer"></i>
                    </div>
                </div>
            </div>
            <div class="p-4 flex-auto">
                <!-- Chart -->
                <div class="relative" style="height:350px">
                    <div v-if="!show" class="w-full h-full flex justify-center items-center">
                        <vue-loaders
                            name="ball-scale"
                            color="#90CDF4"
                            scale="1.2"
                        />
                    </div>
                    <chart
                        v-if="show"
                        :key="'country_chart_'+countrySelected"
                        width="100%"
                        height="100%"
                        type="line"
                        :options="options"
                        :series="series"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import _ from 'lodash'
import axios from 'axios'
import VueApexCharts from 'vue-apexcharts'
var es = require("apexcharts/dist/locales/es.json")
import 'vue-loaders/dist/vue-loaders.css'
import VueLoaders from 'vue-loaders'
import dayjs from 'dayjs'
import * as customParseFormat from 'dayjs/plugin/customParseFormat' // import plugin
dayjs.extend(customParseFormat)

export default {
    name: 'CountryCharts',
    components: {
        'chart': VueApexCharts,
        'vue-loaders': VueLoaders.component
    },
    props: {
        country: {
            required: false,
            default: 'all'
        },
        countries:{
            type: Array,
            required: true
        }
    },
    data: () => ({
        show: false,
        now: parseInt(Date.now()),
        url: 'https://corona.lmao.ninja/v2/historical/',
        countryData: false,
        today: false,
        countrySelected: null,
    }),
    computed: {

        series() {

            if (this.countryData && this.confirmed && this.deaths && this.recovered) {
                let confirmed = _.map(this.confirmed, (value, key) => ({
                    x: parseInt(new Date(key).getTime()),
                    y: value
                }))
                this.overrideLastDay(confirmed, 'cases')

                let deaths = _.map(this.deaths, (value, key) => ({
                    x: parseInt(new Date(key).getTime()),
                    y: value
                }))
                this.overrideLastDay(deaths, 'deaths')

                let recovered = _.map(this.recovered, (value, key) => ({
                    x: parseInt(new Date(key).getTime()),
                    y: value
                }))
                this.overrideLastDay(recovered, 'recovered')

                return [
                    {
                        name: 'Infectados',
                        data: _.sortBy(confirmed, 'x')
                    },
                    {
                        name: 'Recuperados',
                        data: _.sortBy(recovered, 'x')
                    },
                    {
                        name: 'Muertes',
                        data: _.sortBy(deaths, 'x')
                    }
                ]
            } 

            return []
        },

        options() {

            return {
                chart: {
                    id: 'by_country',
                    width: 'auto',
                    height: '100%',
                    type: 'line',
                    foreColor: '#fff',
                    toolbar: {
                        show: false
                    },
                    locales: [es],
                    defaultLocale: 'es',
                },
                // title: {
                //     text: this.chartTitle,
                //     align: 'left'
                // },
                colors: ['#FAF089', '#48BB78', '#F56565'],
                grid: {
                    borderColor: "#40475D",
                },
                stroke: {
                    curve: 'straight',
                    width: 3
                },
                xaxis: {
                    type: 'datetime',
                },
                tooltip: {
                    theme: 'dark',
                    x: {
                        formatter: (title) => new Date(title).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' }),
                        title: {
                            formatter: (title) => new Date(title).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' }),
                        }
                    },
                    y: {
                        formatter: (value) => new Intl.NumberFormat("es-ES").format(value)
                    }
                },
                dataLabels: {
                    enabled: false
                },
                legend: {
                    show: true,
                    floating: true,
                    horizontalAlign: 'right',
                    onItemClick: {
                        toggleDataSeries: true
                    },
                    position: 'top',
                    offsetY: -5,
                },
            }
        },

        confirmed() {
            if (this.countryData) {
                if (this.country.iso == 'all') {
                    return this.countryData.cases
                }
                return this.countryData.timeline.cases
            }

            return false
        },

        deaths() {
            if (this.countryData) {
                if (this.country.iso == 'all') {
                    return this.countryData.deaths
                }
                return this.countryData.timeline.deaths
            }

            return false
        },

        recovered() {
            if (this.countryData) {
                if (this.country.iso == 'all') {
                    return this.countryData.recovered
                }
                return this.countryData.timeline.recovered
            }

            return false
        },

        subTitle() {
            return this.country.country
        },

        isChartReady() {

            if (this.countryData != false &&
                this.confirmed != false &&
                this.deaths != false &&
                this.recovered != false) {

                return true
            }

            return false
        }
    },

    watch: {

        info: {
            immediate: true,
            handler (value) {
                if (value == null) {
                    this.show = false 
                }
            }
        },

        isChartReady(value) {
            if (value) {
                this.showChartFn()
            }
        },

        series(value) {
            if (value) {
                this.showChartFn()
            }
        },

        country: {
            immediate: true,
            handler (value) {
                if (value) {
                    this.countrySelected = value.iso3
                    this.historicalData()
                    this.showChartFn()
                }
            }
        }
    },

    mounted() {
        let now = new Date()
        let day = now.getDate()
        let month = now.getMonth()
        let year = now.getFullYear()
        this.now = dayjs(new Date(year, month, day))
    },
    methods: {
        showChartFn() {
            if (this.countryData != null) {
                this.$nextTick(() => {
                    setTimeout(() => {
                        this.show = true
                    }, 500)
                })
            }
        },

        historicalData() {
            axios.get(this.url + this.countrySelected).then(response => {

                let urlAll = 'https://corona.lmao.ninja/all'
                if (this.countrySelected != 'all') {
                    urlAll = 'https://corona.lmao.ninja/countries/' + this.countrySelected
                }

                axios.get(urlAll).then(data => {
                    this.today = data.data
                })

                this.countryData = response.data;
            }).catch(error => {
                console.log(error)
            });
        },

        overrideLastDay(data, key) {

            let lastDay = _.find(data, {x: this.now.valueOf()})
            if (lastDay) {
                lastDay.y = this.today[key]
            } else {
                data.push({
                    x: this.now.valueOf(),
                    y: this.today[key]
                })
            }
        },

        close() {
            this.$emit('close')
        }
    }
}
</script>
