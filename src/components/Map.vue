<template>
    <div class="hidden md:flex w-full lg:pl-2 mt-8 mb-4">
        <div class="flex flex-wrap w-full shadow-lg bg-gray-800 rounded-lg">
            <div class="box-header text-sm">
                <div class="">
                    Mapa - Casos por países
                </div>
            </div>

            <div class="box-body ">
                <div v-if="!show" class="w-full h-full flex justify-center items-center">
                    <vue-loaders
                        name="ball-scale"
                        color="#90CDF4"
                        scale="1.2"
                    />
                </div>
                <div class="h-400 w-full">
                    <div
                      ref="chartmap"
                      class="w-full h-full"
                      :class="{'hidden': !show}"
                    />
                </div>
            </div>
        </div>
    </div>

  <!-- <div class="hidden md:flex w-full shadow-lg bg-gray-800 rounded-lg h-400 mt-8 lg:pl-2 mb-4">
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
    <div
      ref="chartmap"
      class="w-full h-full"
      :class="{'hidden': !show}"
    />
  </div> -->
</template>

<script>
import _ from 'lodash'
import * as am4core from "@amcharts/amcharts4/core"
import * as am4maps from "@amcharts/amcharts4/maps"
import am4geodata_lang_ES from "@amcharts/amcharts4-geodata/lang/ES"
import am4geodata_worldLow from "@amcharts/amcharts4-geodata/worldHigh"
import { mapState } from 'vuex'

export default {
    name: 'Map',

    props: {
        iso: {
            required: false,
            default: 'all'
        }
    },

    data: () => ({
        show: false,
        map: null,
        mapPolygons: null,
        mapData: null,
        clickedCountry: null,
        historyClicked: null,
        colors: {
            lowest: '#CBD5E0',
            low: '#90CDF4',
            lowMiddle: '#FEEBC8',
            normal: '#FAF089',
            high: '#F6AD55',
            danger: '#E53E3E'
        },
    }),

    computed:{
        ...mapState({
            countries: state => state.countries
        }),

        series() {
            return _.map(this.countries, (item) => ({
                id: item.iso2,
                name: item.country,
                value: (item.confirmed != 0) ? item.confirmed : 0,
                fill: this.getHeatColor(item.confirmed),
                color: '#e2e2e2'
            }))
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

        iso(value) {
            if (value && this.mapPolygons) {
                var countryPoligon = this.mapPolygons.getPolygonById(value);
                if (countryPoligon) {
                    countryPoligon.dispatchImmediately("hit")
                }
            }
        },

        mapPolygons(value) {
            if (value) {
                setTimeout(() => {
                    _.forEach(this.series, (country) => {
                        let countryPoligon = value.getPolygonById(country.id);
                        if (countryPoligon) {
                            countryPoligon.fill = this.getHeatColor(country.value)
                        }
                    })

                    this.show = true
                }, 500)
            }
        }

    },

    mounted() {
        // this.$nextTick(() => {
        //  this.createMap()    
        // })
    },

    beforeDestroy() {
        if (this.map) {
            this.map.dispose();
        }
    },

    methods: {

        getHeatColor(value) {

            if (value >= 20000) {
                return this.colors.danger
            }

            if (value >= 15000) {
                return this.colors.high
            }

            if (value >= 5000) {
                return this.colors.normal
            }

            if (value >= 2500) {
                return this.colors.lowMiddle
            }

            if (value >= 1500) {
                return this.colors.low
            }

            return this.colors.lowest
        },

        async createMap() {

            let map = am4core.create(this.$refs.chartmap, am4maps.MapChart)
            
            // Set map definition
            // map.geodata = am4geodata_worldLow;
            map.geodata = am4geodata_worldLow

            map.geodataNames = am4geodata_lang_ES;

            // Set projection
            map.projection = new am4maps.projections.Miller();

            // var media = _.meanBy(this.series, (item) => { 
            //  return item.value; 
            // });

            // Create map polygon series
            // this.series.forEach((country) => {
            //  let series = map.series.push(new am4maps.MapPolygonSeries());
            //  series.name = country.name;
            //  series.fill = this.getHeatColor(country.value);
            //  series.useGeodata = true;
            // })

            // The rest of the world.
            let polygonSeries = map.series.push(new am4maps.MapPolygonSeries());
            polygonSeries.exclude = ["AQ"];
            polygonSeries.useGeodata = true
            polygonSeries.nonScalingStroke = true,
            polygonSeries.stroke = am4core.color("#27293d"),
            polygonSeries.strokeWidth = 5,
            polygonSeries.calculateVisualCenter = true;

            let template = polygonSeries.mapPolygons.template;
            template.fill = am4core.color("#161625"),
            template.stroke = am4core.color("#27293d");

            // template.tooltipText = "{name}: {value.value.formatNumber('#.0')}";

            polygonSeries.tooltip.label.interactionsEnabled = true;
            polygonSeries.tooltip.keepTargetHover = true;

            template.tooltipText = `[bold]{name}[/]
            ----
            Casos confirmados: {value}`;

            template.events.on("hit", (ev) => {
                if (this.historyClicked) {
                    this.historyClicked.isActive = false;   
                }

                ev.target.series.chart.zoomToMapObject(ev.target);

                this.historyClicked = ev.target;
            });


            let home = map.chartContainer.createChild(am4core.Button);
            home.padding(5,5,5,5)
            home.align = 'right'
            home.marginRight = 15
            home.events.on('hit', function() {
                map.goHome()
            });
            home.icon = new am4core.Sprite()
            home.icon.path = "M16,8 L14,8 L14,16 L10,16 L10,10 L6,10 L6,16 L2,16 L2,8 L0,8 L8,0 L16,8 Z M16,8"

            // map.zoomControl = new am4maps.ZoomControl();
            map.chartContainer.wheelable = false;

            polygonSeries.data = this.series

            this.mapPolygons = polygonSeries;

            this.map = map

            this.setCountriesData()
        },

        setCountriesData() {
            this.$nextTick(() => {
            })
        }
    }
}
</script>
<style type="text/css">
    #chartdiv {
        width: 100%;
        height: 98vh;
    }
</style>