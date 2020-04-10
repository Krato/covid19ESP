<template>
    <div class="w-full xl:w-6/12 px-4">
        <div class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-gray-900">
            <div class="rounded-t mb-0 px-4 py-3 bg-transparent">
                <div class="flex flex-wrap items-center">
                    <div class="relative w-full max-w-full flex-grow flex-1">
                        <h6 class="uppercase text-gray-200 mb-1 text-xs font-semibold">
                            Últimos {{ days }} días
                        </h6>
                        <div class="flex flex-wrap">
                            <transition name="fade" mode="out-in">
                                <h2 class="text-white text-xl font-semibold" :key="'five_daily'" v-if="type == 'daily'">
                                    Datos por día
                                </h2>
                                <h2 class="text-white text-xl font-semibold"  :key="'five_sum'" v-else>
                                    Totales acumulados
                                </h2>
                            </transition>
                        </div>
                    </div>
                    <div class="flex flex-wrap mt-2 md:mt-0">
                        <div class="py-1 px-2 mr-2 md:ml-8 text-xs md:text-sm cursor-pointer bg-blue-800 text-gray-200 rounded-lg" v-on:click="changeType">
                            <template v-if="type == 'daily'">
                                Ver acumulativo
                            </template>
                            <template v-else>
                                Ver casos diarios
                            </template>
                        </div>
                        <div class="text-xs md:text-sm cursor-pointer" v-if="show">
                            <div class="relative inline-flex" v-if="size(communities)">
                                <select class="rounded-lg text-gray-200 text-xs md:text-sm h-6 md:h-8 px-2 bg-blue-800 focus:outline-none appearance-none" v-model="caSelected">
                                    <template v-for="ccaa in communities">
                                        <option :value="ccaa.CCAA" :key="ccaa.CCAA">
                                            <template v-if="ccaa.CCAA == 'Total'">
                                                Todas las CCAA
                                            </template>
                                            <template v-else>
                                                {{ ccaa.CCAA }}
                                            </template>
                                        </option>
                                    </template>
                                </select>
                            </div>
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
                        v-if="show && type == 'summation'"
                        :key="'chart_'+ca"
                        ref="ca_chart_last"
                        width="100%"
                        height="100%"
                        type="bar"
                        :options="options"
                        :series="series"
                    />

                    <chart
                        v-if="show && type == 'daily'"
                        :key="'chart_daily_'+ca"
                        ref="ca_chart_last_daily"
                        width="100%"
                        height="100%"
                        type="bar"
                        :options="options"
                        :series="seriesByDay"
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
    name: 'SpainLastDays',
    components: {
        'chart': VueApexCharts
    },
    props: {
        spain: {
            required: true,
            type: Object
        },
        historical: {
            required: true,
            type: Object
        },
        ca: {
            required: false,
            default: 'all'
        },
        days: {
            type: Number,
            required: false,
            default: 7
        }
    },
    data: () => ({
        show: false,
        type: 'daily',
        chart: null,
        confirmed: [],
        deaths: [],
        recovered: [],
        critical: [],
        seriesData: [],
        totalsSpain: false,
        now: null,
        options: {
            chart: {
                id: 'by_ccaa',
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
            colors: ['#FAF089', '#48BB78', '#F56565', '#F6AD55'],
            grid: {
                borderColor: "#40475D",
            },
            stroke: {
                curve: 'smooth',
                width: 3
            },
            xaxis: {
                type: 'datetime',
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
        },
    }),
    computed: {

        selectedCa: {
            get() {
                return this.ca
            },
            set(val) {
                this.$emit('community', val)
            }
        },

        communities() {
            if (this.spainHistorical) {
                if (_.has(this.spainHistorical, 'confirmed')) {
                    return this.spainHistorical.confirmed
                }
            }

            return []
        },

        series() {

            let caConfirmed = _.find(this.historical.confirmed, {'CCAA': this.ca})
            let caDeaths = _.find(this.historical.deaths, {'CCAA': this.ca})
            let caRecovered = _.find(this.historical.recovered, {'CCAA': this.ca})
            let caCritical = _.find(this.historical.critical, {'CCAA': this.ca})
            let series = []
            let confirmed = []

            if (this.ca && caConfirmed) {

                //Confirmed
                
                _.forOwn(caConfirmed, function(value, key) { 
                    confirmed.push({
                        x: parseInt(key),
                        y: parseInt(value)
                    })
                });
                confirmed.shift()

                this.overrideLastDay(confirmed, 'casos_totales', 'confirmed')

                confirmed = _.sortBy(confirmed, 'x')

                series.push({
                    name: 'Infectados',
                    data: _.takeRight(confirmed, this.days)
                })
            }

            if (this.ca && caRecovered) {
                //Recovered
                let recovered = []
                _.forOwn(caRecovered, function(value, key) { 
                    recovered.push({
                        x: parseInt(key),
                        y: parseInt(value)
                    })
                });
                recovered.shift()

                if (confirmed.length > 0) {
                    let oldValue = 0;
                    for (let i = 0; i < confirmed.length; i++) {
                        if (!_.find(recovered, {x: confirmed[i].x})) {
                            recovered.push({
                                x: confirmed[i].x,
                                y: oldValue
                            })
                        } else {
                            let found = _.find(recovered, {x: confirmed[i].x})
                            if (found) {
                                oldValue = found.y
                            }
                        }
                    }
                }

                // this.overrideLastDay(recovered, 'nothing', 'recovered')
                recovered = _.sortBy(recovered, 'x')

                series.push({
                    name: 'Recuperados',
                    data: _.takeRight(recovered, this.days)
                })
            }

            if (this.ca && caDeaths) {
                //Deaths
                let deaths = []
                _.forOwn(caDeaths, function(value, key) { 
                    deaths.push({
                        x: parseInt(key),
                        y: parseInt(value)
                    })
                });
                deaths.shift()

                if (confirmed.length > 0) {
                    let oldValue = 0;
                    for (let i = 0; i < confirmed.length; i++) {
                        if (!_.find(deaths, {x: confirmed[i].x})) {
                            deaths.push({
                                x: confirmed[i].x,
                                y: oldValue
                            })
                        } else {
                            let found = _.find(deaths, {x: confirmed[i].x})
                            if (found) {
                                oldValue = found.y
                            }
                        }
                    }
                }

                this.overrideLastDay(deaths, 'fallecidos', 'deaths')

                deaths = _.sortBy(deaths, 'x')

                series.push({
                    name: 'Muertes',
                    data: _.takeRight(deaths, this.days)
                })
            }

            if (this.ca && caCritical) {
                //Critical
                let critical = []
                _.forOwn(caCritical, function(value, key) { 
                    critical.push({
                        x: parseInt(key),
                        y: parseInt(value)
                    })
                });
                critical.shift()

                if (confirmed.length > 0) {
                    let oldValue = 0;
                    for (let i = 0; i < confirmed.length; i++) {
                        if (!_.find(critical, {x: confirmed[i].x})) {
                            critical.push({
                                x: confirmed[i].x,
                                y: oldValue
                            })
                        } else {
                            let found = _.find(critical, {x: confirmed[i].x})
                            if (found) {
                                oldValue = found.y
                            }
                        }
                    }
                }

                this.overrideLastDay(critical, 'casos_graves', 'serious')

                critical = _.sortBy(critical, 'x')

                series.push({
                    name: 'Críticos',
                    data: _.takeRight(critical, this.days)
                })
            }

            return series
        },

        seriesByDay() {

            let caConfirmed = _.find(this.historical.confirmed, {'CCAA': this.ca})
            let caDeaths = _.find(this.historical.deaths, {'CCAA': this.ca})
            let caRecovered = _.find(this.historical.recovered, {'CCAA': this.ca})
            let caCritical = _.find(this.historical.critical, {'CCAA': this.ca})
            
            let series = []
            let confirmed = []
            if (this.ca && caConfirmed) {

                //Confirmed
                
                _.forOwn(caConfirmed, function(value, key) { 
                    confirmed.push({
                        x: parseInt(key),
                        y: parseInt(value)
                    })
                });
                confirmed.shift()

                confirmed = _.sortBy(confirmed, 'x')

                let lastValue = 0;
                for (let i = 0; i < confirmed.length; i++) {
                    confirmed[i].y = (confirmed[i].y - lastValue)
                    lastValue += confirmed[i].y
                }

                // this.overrideLastDay(confirmed, 'casos_totales')

                series.push({
                    name: 'Infectados',
                    data: _.takeRight(confirmed, this.days)
                })
            }

            if (this.ca && caRecovered) {
                //Recovered
                let recovered = []
                _.forOwn(caRecovered, function(value, key) { 
                    recovered.push({
                        x: parseInt(key),
                        y: parseInt(value)
                    })
                });
                recovered.shift()

                if (confirmed.length > 0) {
                    let oldValue = 0;
                    for (let i = 0; i < confirmed.length; i++) {
                        if (!_.find(recovered, {x: confirmed[i].x})) {
                            recovered.push({
                                x: confirmed[i].x,
                                y: oldValue
                            })
                        } else {
                            let found = _.find(recovered, {x: confirmed[i].x})
                            if (found) {
                                oldValue = found.y
                            }
                        }
                    }
                }

                recovered = _.sortBy(recovered, 'x')

                let lastValue = 0;
                for (let e = 0; e < recovered.length; e++) {
                    let value = (recovered[e].y - lastValue)
                    recovered[e].y = (value < 0) ? 0 : value
                    lastValue += recovered[e].y
                }

                recovered = _.sortBy(recovered, 'x')

                series.push({
                    name: 'Recuperados',
                    data: _.takeRight(recovered, this.days)
                })
            }

            if (this.ca && caDeaths) {
                //Deaths
                let deaths = []
                _.forOwn(caDeaths, function(value, key) { 
                    deaths.push({
                        x: parseInt(key),
                        y: parseInt(value)
                    })
                });
                deaths.shift()

                if (confirmed.length > 0) {
                    let oldValue = 0;
                    for (let i = 0; i < confirmed.length; i++) {
                        if (!_.find(deaths, {x: confirmed[i].x})) {
                            deaths.push({
                                x: confirmed[i].x,
                                y: oldValue
                            })
                        } else {
                            let found = _.find(deaths, {x: confirmed[i].x})
                            if (found) {
                                oldValue = found.y
                            }
                        }
                    }
                }

                deaths = _.sortBy(deaths, 'x')
                let lastValue = 0;
                for (let d = 0; d < deaths.length; d++) {
                    deaths[d].y = (deaths[d].y - lastValue)
                    lastValue += deaths[d].y
                }

                // this.overrideLastDay(deaths, 'fallecidos')

                series.push({
                    name: 'Muertes',
                    data: _.takeRight(deaths, this.days)
                })
            }

            if (this.ca && caCritical) {
                //Critical
                let critical = []
                _.forOwn(caCritical, function(value, key) { 
                    critical.push({
                        x: parseInt(key),
                        y: parseInt(value)
                    })
                });
                critical.shift()

                if (confirmed.length > 0) {
                    let oldValue = 0;
                    for (let i = 0; i < confirmed.length; i++) {
                        if (!_.find(critical, {x: confirmed[i].x})) {
                            critical.push({
                                x: confirmed[i].x,
                                y: oldValue
                            })
                        } else {
                            let found = _.find(critical, {x: confirmed[i].x})
                            if (found) {
                                oldValue = found.y
                            }
                        }
                    }
                }

                //orden
                critical = _.sortBy(critical, 'x')

                let lastValue = 0;
                for (let y = 0; y < critical.length; y++) {
                    let value = (critical[y].y - lastValue)
                    critical[y].y = (value < 0) ? 0 : value
                    lastValue += critical[y].y
                }
                critical = _.sortBy(critical, 'x')

                series.push({
                    name: 'Críticos',
                    data: _.takeRight(critical, this.days)
                })
            }

            return series
        },

        chartTitle() {
            return 'Estadísticas por días'
        },

        isChartReady() {

            if (this.ca != false &&
                this.series.length > 0) {
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

        caName(value) {
            this.show = false
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
