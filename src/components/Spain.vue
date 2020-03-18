<template>
  <div class="hidden md:flex w-full shadow-lg bg-gray-800 rounded-lg h-400 mt-8 py-4">
    <div
      v-if="!show"
      class="w-full h-full flex justify-center items-center"
    >
      <vue-loaders
        name="ball-scale"
        color="#90CDF4"
        scale="1.2"
      />
    </div>
    <div ref="chartmap" id="chartmap" class="w-full h-full" :class="{'hidden': !show}"/>
  </div>
</template>

<script>
import _ from 'lodash'


// import spain from "../plugins/spain.js"
import { mapState } from 'vuex'

// import * as amchart from "amcharts/amcharts/amcharts"
// import * as AmCharts from "ammap3/ammap/ammap"
require('amcharts3/amcharts/amcharts.js')
require('ammap3/ammap/ammap')
require('ammap3/ammap/maps/js/spainProvincesHigh.js')

import spainRegions from '../plugins/spainRegions.js'
export default {
    name: 'Spain',

    components: {
        // 
    },

    props: {
        iso: {
            required: false,
            default: 'all'
        }
    },

    data: () => ({
        show: false,
        map: null,
        mapData: null,
        clickedCountry: null,
        historyClicked: null,
        colors: {
            low: '#FEFCBF',
            normal: '#FAF089',
            high: '#F6AD55',
            danger: '#E53E3E'
        },
        mapImages: [],
        latlong: []
    }),

    computed:{
        ...mapState({
            spain: state => state.spain
        }),

        series() {
            return _.map(this.spain, (item) => ({
                name: item.name,
                value: item.confirmed,
                color: this.getHeatColor(item.confirmed)
            }))
        },


        ballons() {
            if (typeof window.AmCharts != 'undefined' && this.spain) {
                let tempProvinces = window.AmCharts.maps.spainProvincesHigh.svg.g.path;
                let provinces = []

                tempProvinces.forEach((item) => {
                    if (_.has(item, 'title')) {
                        let comunity = spainRegions(item.title)
                        if (comunity) {
                            let counter = this.getCounter(comunity.code)
                            if (counter) {
                                provinces.push({
                                    id: item.id,
                                    title: comunity.code,
                                    lat: comunity.lat,
                                    long: comunity.long,
                                    value: counter.total,
                                    color: this.getHeatColor(counter.total)
                                })    
                            }
                        }
                    }
                });

                return provinces;
            }

            return []
        }
    },

    watch: {

        series(value) {
            if (value) {
                this.$nextTick(() => {
                    this.createMap()
                })	
            }
        },


    },

    mounted() {
        this.$nextTick(() => {
            setTimeout(() => {
                this.show = true    
            }, 500)
        })
    },

    beforeDestroy() {
        if (this.map) {
            this.map.dispose();
        }
    },

    methods: {

        getHeatColor(value) {

            if (value >= 1000) {
                return this.colors.danger
            }

            if (value >= 500) {
                return this.colors.high
            }

            if (value >= 250) {
                return this.colors.normal
            }

            return this.colors.low
        },

        async createMap() {

            /**
            * Process loaded data
            */
            var minBulletSize = 5;
            var maxBulletSize = 25;
            var min = 20;
            var max = 1000;

            // it's better to use circle square to show difference between values, not a radius
            var maxSquare = maxBulletSize * maxBulletSize * 2 * Math.PI;
            var minSquare = minBulletSize * minBulletSize * 2 * Math.PI;

            // create circle for each country
            for ( var i = 0; i < this.ballons.length; i++ ) {
                var dataItem = this.ballons[i];
                var value = parseInt(dataItem.value);
                // calculate size of a bubble
                var square = ( value - min ) / ( max - min ) * ( maxSquare - minSquare ) + minSquare;

                if ( square < minSquare ) {
                    square = minSquare;
                }

                var size = Math.sqrt( square / ( Math.PI * 2 ) );

                this.mapImages.push({
                    "type": "circle",
                    "width": size,
                    "height": size,
                    "color": dataItem.color,
                    "longitude": dataItem.long,
                    "latitude": dataItem.lat,
                    "title": dataItem.title,
                    "value": value,
                });

                // console.log(dataItem.title)
            }

            window.AmCharts.makeChart(this.$refs.chartmap, {
                "type": "map",
                "hideCredits":true,
                "dragMap": false,
                "zoomControl": {
                    "homeButtonEnabled": false,
                    "zoomControlEnabled": false
                },
                "zoomOnDoubleClick": false,
                "dataProvider": {
                    "map": "spainProvincesHigh",
                    "getAreasFromMap": true,
                    "images": this.mapImages,
                },
                "areasSettings": {
                    "color": '#718096',
                    "outlineColor": '#4A5568',
                    "rollOverOutlineColor": '#4A5568',
                    "selectable": false,
                    "balloonText": ''
                },
                "imagesSettings": {
                    "balloonText": "<span style='font-size:14px;'><b>[[title]]</b>: [[value]] Casos confirmados</span>",
                },
                "listeners": [
                    {
                        "event": "clickMapObject", 
                        "method": (e) => {

                            if (e.mapObject.objectType !== "MapArea"){
                                return
                            }
                            var area = e.mapObject;
                            var comunity = spainRegions(area.title)
                            let found = this.getCounter(comunity.code)
                            console.log(found)
                        }
                    },
                    {
                        "event": "rollOverMapObjec", 
                        "method": (e) => {
                            if (e.mapObject.objectType !== "mapObject"){
                                return
                            }
                            var area = e.mapObject;
                            var comunity = spainRegions(area.title)
                            this.getCounter(comunity.code)
                        }
                    }
                ]
            });
        },

        getCounter(comunity) {
            return this.spain.find(info => {
                return info.name == comunity
            })
        }
    }
}
</script>
<style scoped>
    .map {
      min-height: 500px;
    }
 </style>