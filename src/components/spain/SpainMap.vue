<template>
    <div ref="chartmap" id="chartmap" class="w-full h-full" /> 
</template>
<script>
import _ from 'lodash'
require('amcharts3/amcharts/amcharts.js')
require('ammap3/ammap/ammap')
require('ammap3/ammap/maps/js/spainProvincesHigh.js')
import spainRegions from '@/helpers/spainRegions.js'


export default {
    name: 'SpainMap',

    props: {
        spain: {
            type: Array,
            default: () => [],
            required: true
        }
    },

    data: () => ({
        map: null,
        mapData: null,
        clickedCountry: null,
        historyClicked: null,
        colors: {
            low: '#FEFCBF',
            normal: '#FAF089',
            high: '#ED8936',
            danger: '#E53E3E'
        },
        mapImages: [],
        latlong: [],
        ready: false
    }),

    mounted() {
        // setTimeout(() => {
        //     this.$nextTick(() => {
        //         this.createMap()
        //     })  
        // }, 500)
    },

    computed: {
        ballons() {
            if (typeof window.AmCharts != 'undefined' && this.spain) {
                let tempProvinces = window.AmCharts.maps.spainProvincesHigh.svg.g.path;
                let provinces = []
                this.spain.forEach((provincia) => {
                    for (let i = 0; i < tempProvinces.length; i++) {
                        let item = tempProvinces[i];
                        if (_.has(item, 'title')) {
                            let comunity = spainRegions(provincia.ccaa, true)
                            if (comunity) {
                                provinces.push({
                                    id: item.id,
                                    title: comunity.code,
                                    lat: comunity.lat,
                                    long: comunity.long,
                                    value: provincia.casos_totales,
                                    color: this.getHeatColor(provincia.casos_totales)
                                })
                                break;
                            }
                        }
                    }
                })

                return provinces;
            }

            return []
        }
    },

    methods: {
        async createMap() {

            var minBulletSize = 5;
            var maxBulletSize =17;
            var min = 20;
            var max = 5000;

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
            }

            if (this.mapImages.length > 0) {
                this.ready = true
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
                            this.getCounter(comunity.code)
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

        getHeatColor(value) {
            if (value >= 20000) {
                return this.colors.danger
            }

            if (value >= 5000) {
                return this.colors.high
            }

            if (value >= 1500) {
                return this.colors.normal
            }

            return this.colors.low
        },

        getCounter(comunity) {
            return this.spain.find(info => {
                return info.name == comunity
            })
        }
    },

    watch: {

        spain: {
            immediate: true,
            handler(value) {
                if (value.length > 0) {
                    this.$nextTick(() => {
                        this.createMap()
                    })
                }
            },
        },

        ready(value) {
            if (value) {
                this.$emit('chart-ready')
            }
        }

    },

    beforeDestroy() {
        if (this.map) {
            // this.map.dispose();
        }
    },

}

</script>