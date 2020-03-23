<template>
    <div class="flex w-full lg:pl-2 lg:mt-8 mb-8 lg:mb-0">
        <div class="flex flex-wrap w-full items-center shadow-lg bg-gray-800 rounded-lg">

            <div class="box-header text-sm">
                <div class="">
                    Estadísticas de días por CCAA
                </div>
                <div class="flex self-end cursor-pointer float-right">
                    <div class="text-sm cursor-pointer" v-if="show">
                        <div class="custom-select">
                            <select v-model="caSelected">
                                <template v-for="ccaa in communities">
                                    <option :value="ccaa.CCAA" :key="ccaa.CCAA">
                                        {{ ccaa.CCAA }}
                                    </option>
                                </template>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
            <div class="box-body">
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
                        :key="'chart_'+ca"
                        ref="ca_chart"
                        width="100%"
                        height="100%"
                        type="area"
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

import 'vue-loaders/dist/vue-loaders.css';
import VueLoaders from 'vue-loaders';
import Papa from 'papaparse'
import dayjs from 'dayjs'
import * as customParseFormat from 'dayjs/plugin/customParseFormat' // import plugin
dayjs.extend(customParseFormat)

export default {
    name: 'SpainDetails',
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
        chart: null,
        confirmed: [],
        deaths: [],
        recovered: [],
        critical: [],
        seriesData: [],
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
            },
            title: {
                text: '',
                align: 'left',
            },
            // subtitle: {
            //     text: 'Última actualización a las: 1511',
            //     align: 'left'
            // },
            colors: ['#FAF089', '#48BB78', '#F56565', '#F6AD55'],
            grid: {
                borderColor: "#40475D",
            },
            stroke: {
                width: 3,
                curve: 'smooth'
            },
            xaxis: {
                type: 'datetime',
            },
            tooltip: {
                theme: 'dark',
                shared: true,
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
        }
    }),
    computed: {

        caSelected: {
            get() {
                return this.ca
            },
            set(val) {
                this.$emit('community', val)
            }
        },

        communities() {
            let communities = this.confirmed
            communities.pop();

            return communities
        },

        series() {

            let caConfirmed = _.find(this.confirmed, {'CCAA': this.ca})
            let caDeaths = _.find(this.deaths, {'CCAA': this.ca})
            let caRecovered = _.find(this.recovered, {'CCAA': this.ca})
            let caCritical = _.find(this.critical, {'CCAA': this.ca})
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

                series.push({
                    name: 'Infectados',
                    data: confirmed
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

                series.push({
                    name: 'Recuperados',
                    data: _.sortBy(recovered, 'x')
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

                series.push({
                    name: 'Muertes',
                    data: _.sortBy(deaths, 'x')
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

                series.push({
                    name: 'Críticos',
                    data: _.sortBy(critical, 'x')
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

        ca(value) {
            this.show = false
            if (value) {
                this.createChartsOptions()
            }
        },

        // show(value) {
        //     if (value) {
        //         this.$refs['ca_chart'].updateSeries(this.series)
        //     } else {
        //         this.$refs['ca_chart'].destroy()
        //     }
        // }
    },

    mounted() {
        //
    },

    created() {
        //Casos
        this.getConfirmed()
        this.getDeaths()
        this.getRecovered()
        this.getCritical()
    },
    beforeDestroy() {
        
    },

    methods: {

        createChartsOptions() {
            // this.options = {...this.options, ...{
            //     title: {
            //         text: this.chartTitle,
            //     }
            // }}
            
            this.showChartFn()
        },

        showChartFn() {
            this.$nextTick(() => {
                setTimeout(() => {
                    this.show = true
                }, 500)
            })
        },

        getConfirmed() {
            // let apiCasos = 'https://rawcdn.githack.com/datadista/datasets/d5c4c85e5353b57148972ead77635ae830b3b95e/COVID 19/ccaa_covid19_casos.csv';

            let apiCasos = 'https://raw.githubusercontent.com/datadista/datasets/master/COVID%2019/ccaa_covid19_casos.csv'
            axios.get(apiCasos).then(response => {
                let data = Papa.parse(response.data, {
                    delimiter: ",",
                    newline: "\n"
                }).data

                let headers = data.shift()
                data.pop()
                let cases = _.map(data, (ca) => {
                    let caInfo = [] 
                    for (var i = 1; i < headers.length; i++) {
                        if (i == 1) {
                            caInfo[headers[i]] = ca[i]
                        } else {
                            let fecha = dayjs(headers[i], "DD/MM/YYYY")
                            caInfo[fecha.valueOf()] = parseInt(ca[i])
                        }
                    }

                    return caInfo;
                })

                this.confirmed = cases

            }).catch(error => {
                console.log(error)
            });
        },

        getDeaths() {
            let apiDeaths = 'https://rawcdn.githack.com/datadista/datasets/ed4f4841efc0f013acf214fb55000b68a123b584/COVID 19/ccaa_covid19_fallecidos.csv';
            axios.get(apiDeaths).then(response => {
                let data = Papa.parse(response.data, {
                    delimiter: ",",
                    newline: "\n"
                }).data

                let headers = data.shift()
                data.pop()
                let cases = _.map(data, (ca) => {
                    let caInfo = [] 
                    for (var i = 1; i < headers.length; i++) {
                        if (i == 1) {
                            caInfo[headers[i]] = ca[i]
                        } else {
                            let fecha = dayjs(headers[i], "DD/MM/YYYY")
                            caInfo[fecha.valueOf()] = parseInt(ca[i])
                        }
                    }

                    return caInfo;
                })

                this.deaths = cases

            }).catch(error => {
                console.log(error)
            });
        },

        getRecovered() {
            let apiRecovered = 'https://rawcdn.githack.com/datadista/datasets/49626914a9cc62ac864767bee6ea24023830e908/COVID 19/ccaa_covid19_altas.csv';
            axios.get(apiRecovered).then(response => {
                let data = Papa.parse(response.data, {
                    delimiter: ",",
                    newline: "\n"
                }).data

                let headers = data.shift()
                data.pop()
                let cases = _.map(data, (ca) => {
                    let caInfo = [] 
                    for (var i = 1; i < headers.length; i++) {
                        if (i == 1) {
                            caInfo[headers[i]] = ca[i]
                        } else {
                            let fecha = dayjs(headers[i], "DD/MM/YYYY")
                            caInfo[fecha.valueOf()] = parseInt(ca[i])
                        }
                    }

                    return caInfo;
                })

                this.recovered = cases

            }).catch(error => {
                console.log(error)
            });
        },

        getCritical() {
            let apiCritical = 'https://rawcdn.githack.com/datadista/datasets/49626914a9cc62ac864767bee6ea24023830e908/COVID 19/ccaa_covid19_uci.csv';
            axios.get(apiCritical).then(response => {
                let data = Papa.parse(response.data, {
                    delimiter: ",",
                    newline: "\n"
                }).data

                let headers = data.shift()
                data.pop()
                let cases = _.map(data, (ca) => {
                    let caInfo = [] 
                    for (var i = 1; i < headers.length; i++) {
                        if (i == 1) {
                            caInfo[headers[i]] = ca[i]
                        } else {
                            let fecha = dayjs(headers[i], "DD/MM/YYYY")
                            caInfo[fecha.valueOf()] = parseInt(ca[i])
                        }
                    }

                    return caInfo;
                })

                this.critical = cases

            }).catch(error => {
                console.log(error)
            });
        }
    }
}
</script>
