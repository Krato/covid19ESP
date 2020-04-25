<template>
    <div class="w-full xl:w-6/12 px-4 mt-4 lg:mt-0">
        <div class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-gray-900">
            <div class="rounded-t mb-0 px-4 py-3 bg-transparent">
                <div class="flex flex-wrap items-center">
                    <div class="relative w-full max-w-full flex-grow lg:flex-1">
                        <h6 class="uppercase text-gray-200 mb-1 text-xs font-semibold">
                            Porcentajes por Comunidad
                        </h6>
                        <div class="flex flex-wrap">
                            <transition name="fade" mode="out-in">
                                <h2 class="text-white text-xl font-semibold" :key="'confirmed'" v-if="type == 'confirmed'">
                                    Porcentaje de casos confirmados
                                </h2>
                                <h2 class="text-white text-xl font-semibold"  :key="'recovered'" v-if="type == 'recovered'">
                                    Porcentaje de casos recuperados
                                </h2>
                                <h2 class="text-white text-xl font-semibold"  :key="'critical'" v-if="type == 'critical'">
                                    Porcentaje de casos críticos
                                </h2>
                                <h2 class="text-white text-xl font-semibold"  :key="'deaths'" v-if="type == 'deaths'">
                                    Porcentaje de muertes
                                </h2>
                            </transition>
                        </div>
                    </div>
                    <div class="flex flex-wrap mt-2 md:mt-0">
                        <div class="py-1 px-2 mr-1 md:ml-2 text-xs md:text-sm cursor-pointer  text-gray-200 rounded-lg"
                        :class="{'bg-blue-900': type == 'confirmed', 'bg-blue-800': type != 'confirmed'}"
                        v-on:click="changeType('confirmed')">
                            Confirmados
                        </div>
                        <div class="py-1 px-2 mr-1 md:ml-2 text-xs md:text-sm cursor-pointer bg-blue-800 text-gray-200 
                        rounded-lg" :class="{'bg-blue-900': type == 'recovered', 'bg-blue-800': type != 'recovered'}" v-on:click="changeType('recovered')">
                            Recuperados
                        </div>
                        <div class="py-1 px-2 mr-1 md:ml-2 text-xs md:text-sm cursor-pointer bg-blue-800 text-gray-200 rounded-lg" :class="{'bg-blue-900': type == 'critical', 'bg-blue-800': type != 'critical'}" v-on:click="changeType('critical')">
                            Críticos
                        </div>
                        <div class="py-1 px-2 mr-1 md:ml-2 text-xs md:text-sm cursor-pointer bg-blue-800 text-gray-200 rounded-lg" :class="{'bg-blue-900': type == 'deaths', 'bg-blue-800': type != 'deaths'}" v-on:click="changeType('deaths')">
                            Muertes
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

                    <div class="w-full h-full" ref="chart" :class="{'hidden': !ready}"></div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import _ from 'lodash'
import * as am4core from "@amcharts/amcharts4/core"
import * as am4charts from "@amcharts/amcharts4/charts"
import am4themes_material from "@amcharts/amcharts4/themes/material"
import am4themes_animated from "@amcharts/amcharts4/themes/animated"

import dayjs from 'dayjs'
import * as customParseFormat from 'dayjs/plugin/customParseFormat' // import plugin
dayjs.extend(customParseFormat)

am4core.useTheme(am4themes_material)
am4core.useTheme(am4themes_animated)

export default {
    name: 'SpainPercentsRegions',
    components: {
        //
    },
    props: {
        ready: {
            type: Boolean,
            default: false
        },
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
        type: 'confirmed',
        chart: null,
        now: null,
        pieSeries: null
    }),
    computed: {

        goodRegions() {
            return _.reject(this.regions, ({ccaa}) => !ccaa)
        },

        series() {
            let data = []
            let key = 'confirmed'
            
            _.map(this.goodRegions, (region) => {
                let percent = (region[this.type] * 100) / this.spain[key]
                data.push({
                    name: region.ccaa,
                    percent: percent,
                    text: this.formatValue(percent)
                })
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

            if (this.ready && this.series.length > 0) {
                return true
            }

            return false
        }
    },

    watch: {

        isChartReady: {
            immediate: true,
            handler(value) {
                if (value) {
                    this.$nextTick(() => {
                        this.createChart()
                    })
                }
            },
        },


        // pieSeries(value) {
        //     if (value.slices.length > 0) {
        //         value.slices.forEach((item)=> { item.tooltip.hide() })    
        //     }
        // }
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

        createChart() {

            this.chart = am4core.create(this.$refs.chart, am4charts.PieChart);
            this.chart.hiddenState.properties.opacity = 0; // this creates initial fade-in
            
            this.chart.data = this.series

            // Add and configure Series
            let pieSeries = this.chart.series.push(new am4charts.PieSeries());
            pieSeries.dataFields.value = "percent";
            pieSeries.dataFields.category = "name";
            pieSeries.slices.template.stroke = am4core.color("#fff");
            pieSeries.slices.template.strokeWidth = 0;
            pieSeries.slices.template.strokeOpacity = 1;

            pieSeries.labels.template.disabled = true;
            pieSeries.ticks.template.disabled = true;

            // This creates initial animation
            pieSeries.hiddenState.properties.opacity = 1;
            pieSeries.hiddenState.properties.endAngle = -90;
            // pieSeries.hiddenState.properties.startAngle = -90;
            pieSeries.hiddenState.properties.endAngle = -90;

            pieSeries.slices.template.tooltipText = "[bold]{name}[/] {text}%"
            // pieSeries.slices.template.showTooltipOn = "hit";

            pieSeries.tooltip.getFillFromObject = false;
            pieSeries.tooltip.background.fill = am4core.color("#2c5282");

            var current;
            pieSeries.slices.template.events.on("hit", function(ev) {
                if (current) {
                    current.isActive = false
                    // current.tooltip.hide();
                }
                current = ev.target
                current.tooltip.appear()
                console.log("clicked on ", ev.target.dataItem.value);
            });

            pieSeries.slices.template.events.on("over", function(ev) {
                // ev.slices.template.tooltipText = "[bold]{name}[/] {text}%"
                ev.target.showTooltip()
            })

            am4core.getInteraction().body.events.on("over", () =>{
                if (current) {
                    current.tooltip.hide();
                }
            });

            this.pieSeries = pieSeries
            

            this.showChartFn()

        },

        changeType(type) {
            this.type = type
            this.createChart()
        },

        size(value) {
            return (_.size(value) > 0)
        },

        showChartFn() {
            this.$nextTick(() => {
                setTimeout(() => {
                    this.show = true
                }, 500)
            })
        },

        formatValue(value) {
            return new Intl.NumberFormat("es-ES", {maximumFractionDigits:2}).format(value)
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
