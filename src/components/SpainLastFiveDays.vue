<template>
    <div class="flex w-full xl:w-1/2 lg:pl-2 mb-8 xl:mb-0">

        <div class="flex flex-wrap w-full items-center shadow-lg bg-gray-800 rounded-lg">

            <div class="box-header flex-wrap justify-around text-sm">
                <div class=" flex flex-wrap items-center">
                    <div class="left">
                        España: Últimos 5 días
                    </div>

                    <div class="shadow-lg text-xs md:text-sm bg-gray-900 py-1 px-2 ml-2 md:ml-8 cursor-pointer" v-on:click="changeType">
                        <template v-if="type == 'daily'">
                            Ver acumulativo
                        </template>
                        <template v-else>
                            Ver casos diarios
                        </template>
                    </div>
                </div>
                <div class="flex self-end cursor-pointer float-right">
                    <div class="text-xs md:text-sm cursor-pointer" v-if="show">
                        <div class="custom-select" v-if="size(communities)">
                            <select v-model="selectedCa">
                                <template v-for="ccaa in communities">
                                    <option :value="ccaa.CCAA" :key="'last_'+ccaa.CCAA">
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
            <div class="box-body py-8 flex justify-center items-center">
                <div class="w-full h-300 m-0 p-0">
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
import { mapState, mapGetters } from 'vuex'

import _ from 'lodash'
import axios from 'axios'

import VueApexCharts from 'vue-apexcharts'
var es = require("apexcharts/dist/locales/es.json")

import 'vue-loaders/dist/vue-loaders.css';
import VueLoaders from 'vue-loaders';
import dayjs from 'dayjs'
import * as customParseFormat from 'dayjs/plugin/customParseFormat' // import plugin
dayjs.extend(customParseFormat)

export default {
    name: 'SpainLastFiveDays',
    components: {
        'chart': VueApexCharts,
        'vue-loaders': VueLoaders.component
    },
    props: {
        ca: {
            required: false,
            default: 'all'
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
                    mounted: (chart) => {
                        chart.toggleSeries('Infectados')
                    }
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

        ...mapState({
            spainHistorical: state => state.spainHistorical,
            countries: state => state.countries
        }),

        ...mapGetters(['nowByCountry']),

        lastSpain() {
            if (this.countries != false) {
                return this.nowByCountry('es')
            }

            return false
        },

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

            let caConfirmed = _.find(this.spainHistorical.confirmed, {'CCAA': this.ca})
            let caDeaths = _.find(this.spainHistorical.deaths, {'CCAA': this.ca})
            let caRecovered = _.find(this.spainHistorical.recovered, {'CCAA': this.ca})
            let caCritical = _.find(this.spainHistorical.critical, {'CCAA': this.ca})
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
                    data: _.takeRight(confirmed, 5)
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
                    data: _.takeRight(recovered, 5)
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
                    data: _.takeRight(deaths, 5)
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
                    data: _.takeRight(critical, 5)
                })
            }

            return series
        },

        seriesByDay() {

            let caConfirmed = _.find(this.spainHistorical.confirmed, {'CCAA': this.ca})
            let caDeaths = _.find(this.spainHistorical.deaths, {'CCAA': this.ca})
            let caRecovered = _.find(this.spainHistorical.recovered, {'CCAA': this.ca})
            let caCritical = _.find(this.spainHistorical.critical, {'CCAA': this.ca})
            
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
                    data: _.takeRight(confirmed, 5)
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
                    data: _.takeRight(recovered, 5)
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
                    data: _.takeRight(deaths, 5)
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
                    data: _.takeRight(critical, 5)
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
            console.log(value)
            this.show = false
            if (value) {
                console.log('dadada')
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

        getLastSpainFromIscii() {
            let gotcha = 'U2FsdGVkX19nTPOTksKGw8JGYiMmWrrANkHUgv0ay9Ha0c5xWL123qf9X5MJBzH90rrwCLe14QoBE7yOeBhc9tUYrluWGGIgZ5XTDvaPpNM='
            let secret = this.CryptoJS.AES.decrypt(gotcha, "FCJDq6rELyrCas4").toString(this.CryptoJS.enc.Utf8)

            let axiosHeaders = {
                headers: { 'secret-key': secret }
            };

            axios.get('https://api.jsonbin.io/b/5e7bcd9a862c46101abe0e59/latest', axiosHeaders).then(response => {
                this.totalsSpain = response.data.data
            }).catch(error => {
                console.log(error)
            });
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
