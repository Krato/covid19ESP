<template>
    <div class="flex w-full xl:w-1/2 pl-2">
        <div class="flex w-full items-center shadow-lg bg-gray-800 rounded-lg p-2">
            <div class="w-full h-64">
                <div v-if="!show" class="w-full h-full flex justify-center items-center">
                    <vue-loaders
                        name="ball-scale"
                        color="#90CDF4"
                        scale="1.2"
                    />
                </div>
                <chart
                    v-if="show"
                    width="100%"
                    height="100%"
                    type="line"
                    :options="options"
                    :series="series"
                />
            </div>
        </div>
    </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import _ from 'lodash'
import VueApexCharts from 'vue-apexcharts'
var es = require("apexcharts/dist/locales/es.json")
import 'vue-loaders/dist/vue-loaders.css';
import VueLoaders from 'vue-loaders';

export default {
    name: 'CountryCharts',
    components: {
        'chart': VueApexCharts,
        'vue-loaders': VueLoaders.component
    },
    props: {
        iso: {
            required: false,
            default: 'all'
        }
    },
    data: () => ({
        show: false,
        now: parseInt(Date.now())
    }),
    computed: {
        ...mapState({
            info: state => state.data,
            totals: state => state.totals,
            daily: state => state.daily
        }),

        ...mapGetters(['confirmedByCountry', 'nowByCountry']),

        country() {
            if (this.info) {
                if (this.iso == 'all') {
                    return this.daily
                }
                
                return this.confirmedByCountry(this.iso)
            }

            return false
        },

        latest() {
            if (this.info) {
                if (this.iso != 'all') {
                    return this.nowByCountry(this.iso)
                }
            }

            return false
        },

        series() {

            if (this.country && this.confirmed && this.deaths && this.recovered) {
                let confirmed = _.map(this.confirmed, (value, key) => ({
                    x: parseInt(key),
                    y: value
                }))

                let deaths = _.map(this.deaths, (value, key) => ({
                    x: parseInt(key),
                    y: value
                }))

                let recovered = _.map(this.recovered, (value, key) => ({
                    x: parseInt(key),
                    y: value
                }))

                return [
                    {
                        name: 'Confirmados',
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
                title: {
                    text: this.chartTitle,
                    align: 'left'
                },
                colors: ['#FCCF31', '#17ead9', '#f02fc2'],
                grid: {
                    borderColor: "#40475D",
                },
                stroke: {
                    curve: 'straight'
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
                    offsetY: 0,
                },
            }
        },

        confirmed() {
            if (this.country) {
                let data;

                if (this.iso == 'all') {
                    data = this.country.confirmed
                } else {
                    data = this.country.confirmed.history
                }

                let confirmed = _.mapKeys(data, (value, key) => {
                    return parseInt(new Date(key).getTime())
                })

                if (this.iso != 'CN' && this.latest != false) {
                    this.$set(confirmed, this.now, this.latest.confirmed)
                }

                return confirmed
            }

            return false
        },

        deaths() {
            if (this.country) {
                let data;

                if (this.iso == 'all') {
                    data = this.country.deaths
                } else {
                    data = this.country.deaths.history
                }

                let deaths = _.mapKeys(data, (value, key) => {
                    return parseInt(new Date(key).getTime())
                })

                if (this.iso != 'CN') {
                    this.$set(deaths, this.now, this.latest.deaths)
                }

                return deaths
            }

            return false
        },

        recovered() {
            if (this.country) {

                let data;

                if (this.iso == 'all') {
                    data = this.country.deaths
                } else {
                    data = this.country.recovered.history
                }

                let recovered =  _.mapKeys(data, (value, key) => {
                    return parseInt(new Date(key).getTime())
                });

                if (this.iso != 'CN') {
                    this.$set(recovered, this.now, this.latest.recovered)
                }

                return recovered
            }

            return false
        },

        chartTitle() {
            if (this.latest != false) {
                return this.latest.country + ': Datos del virus por días'  
            }
            
            return 'Totales: Datos del virus por días'
        },

        isChartReady() {

            if (this.latest != false &&
                this.country != false &&
                this.confirmed != false &&
                this.deaths != false &&
                this.recovered != false) {

                return true
            }

            return false
        }
    },

    watch: {

        isChartReady(value) {
            if (value) {
                this.showChartFn()
            }
        },

        iso(value) {
            this.show = false
            if (value) {
                this.showChartFn()
            }
        }

    },

    mounted() {
        //
    },
    methods: {
        showChartFn() {
            this.$nextTick(() => {
                setTimeout(() => {
                    this.show = true
                }, 500)
            })
        }
    }
}
</script>
