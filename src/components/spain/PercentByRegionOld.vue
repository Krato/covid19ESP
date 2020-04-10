<template>
    <div class="w-full xl:w-6/12 px-4">
        <div class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-gray-900">
            <div class="rounded-t mb-0 px-4 py-3 bg-transparent">
                <div class="flex flex-wrap items-center">
                    <div class="relative w-full max-w-full flex-grow flex-1">
                        <h6 class="uppercase text-gray-200 mb-1 text-xs font-semibold">
                            Porcentajes por Comunidad
                        </h6>
                        <div class="flex flex-wrap">
                            <transition name="fade" mode="out-in">
                                <h2 class="text-white text-xl font-semibold" :key="'casos_totales'" v-if="type == 'confirmed'">
                                    Casos confirmados
                                </h2>
                                <h2 class="text-white text-xl font-semibold"  :key="'eecovered'" v-if="type == 'recovered'">
                                    Casos recuperados
                                </h2>
                            </transition>
                        </div>
                    </div>
                    <div class="flex flex-wrap mt-2 md:mt-0">
                        <div class="py-1 px-2 mr-2 md:ml-8 text-xs md:text-sm cursor-pointer bg-blue-800 text-gray-200 rounded-lg" v-on:click="changeType">
                            
                        </div>
                        
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
                        v-if="show && type == 'casos_totales'"
                        :key="'chart_'"
                        ref="ca_confirmed_last"
                        width="100%"
                        height="100%"
                        type="radialBar"
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
import VueApexCharts from 'vue-apexcharts'
var es = require("apexcharts/dist/locales/es.json")
import dayjs from 'dayjs'
import * as customParseFormat from 'dayjs/plugin/customParseFormat' // import plugin
dayjs.extend(customParseFormat)

export default {
    name: 'SpainPercentsRegions',
    components: {
        'chart': VueApexCharts
    },
    props: {
        spain: {
            type: Object,
            required: true
        },
        regions: {
            type: Array,
            required: true
        },
    },
    data: () => ({
        show: false,
        type: 'casos_totales',
        chart: null,
        now: null,
        options: {
            chart: {
                id: 'by_ccaa',
                type: 'radialBar',
                width: 'auto',
                height: '100%',
                foreColor: '#fff',
                toolbar: {
                    show: false
                },
                locales: [es],
                defaultLocale: 'es',
                events: {
                    // mounted: (chart) => {
                    //     chart.toggleSeries('Infectados')
                    // }
                }
            },
            title: {
                text: '',
                align: 'left',
            },
            // colors: ['#FAF089', '#48BB78', '#F56565', '#F6AD55'],
            grid: {
                borderColor: "#40475D",
            },
            stroke: {
                curve: 'smooth',
                width: 3
            },
            tooltip: {
                theme: 'dark',
                shared: false,
                x: {
                    formatter: (title) => new Date(title).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' }),
                    title: {
                        formatter: (title) => new Date(title).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' }),
                    }
                }
            },
            plotOptions: {
                radialBar: {
                    dataLabels: {
                        name: {
                            fontSize: '22px',
                        },
                        value: {
                            fontSize: '16px',
                        },
                        total: {
                            show: true,
                            label: 'Total',
                        }
                    }
                }
            },
            dataLabels: {
                enabled: false
            },
            legend: {
                show: true,
                floating: false,
                horizontalAlign: 'right',
                onItemClick: {
                    toggleDataSeries: true
                },
                position: 'top',
                offsetY: -5,
            },
        },
    }),
    computed: {

        goodRegions() {
            return _.reject(this.regions, ({ccaa}) => !ccaa)
        },

        series() {
            let data = []
            let key = 'confirmed'
            if (this.type == 'activos') {
                key = 'active'
            }

            
            _.map(this.goodRegions, (region) => {
                let percent = (region[this.type] * 100) / this.spain[key]
                data.push(percent)
            })

            return data
        },

        labels() {
            let data = [];
            
            _.map(this.goodRegions, (region) => {
                data.push(region.ccaa)
            })

            return data
        },
        

        chartTitle() {
            return 'Estadísticas por días'
        },

        isChartReady() {

            if (this.series.length > 0) {
                return true
            }

            return false
        }
    },

    watch: {

        isChartReady(value) {
            if (value) {
                this.createChartsOptions()
            }
        },
    },

    mounted() {
        let now = new Date()
        let day = now.getDate()
        let month = now.getMonth()
        let year = now.getFullYear()
        this.now = dayjs(new Date(year, month, day))
    },

    created() {
        //
    },

    methods: {

        changeType() {
            if (this.type == 'summation') {
                this.type = 'daily'
            } else {
                this.type = 'summation'
            }
        },

        size(value) {
            return (_.size(value) > 0)
        },

        createChartsOptions() {

            this.options.labels = this.labels

            this.showChartFn()
        },

        showChartFn() {
            this.$nextTick(() => {
                setTimeout(() => {
                    this.show = true
                }, 500)
            })
        },

        overrideLastDay(data, key, keySpain) {

            if (this.selectedCa == 'Total') {
                if (this.lastSpain) {
                    let lastDay = _.find(data, {x: this.now.valueOf()})
                    if (lastDay) {
                        lastDay.y = this.lastSpain[keySpain]
                    } else {
                        data.push({
                            x: this.now.valueOf(),
                            y: this.lastSpain[keySpain]
                        })
                    }
                } 
            } else if (this.spain) {
                let ccaa = _.find(this.spain, {ccaa: this.selectedCa})
                if (ccaa) {
                    let lastDay = _.find(data, {x: this.now.valueOf()})

                    if (lastDay) {
                        lastDay.y = ccaa[key]
                    } else {
                        data.push({
                            x: this.now.valueOf(),
                            y: ccaa[key]
                        })
                    }
                }
            }
        }
    }
}
</script>
