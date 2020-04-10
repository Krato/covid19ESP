<template>
    <div class="w-full xl:w-full px-4">
        <div class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-gray-900">
            <div class="rounded-t mb-0 px-4 py-3 bg-transparent">
                <div class="flex flex-wrap items-center">
                    <div class="relative w-full max-w-full flex-grow flex-1">
                        <h6 class="uppercase text-gray-200 mb-1 text-xs font-semibold">
                            Mapa del mundo
                        </h6>
                        <div class="flex flex-wrap">
                            <transition name="fade" mode="out-in">
                                <h2 class="text-white text-xl font-semibold"  :key="'casos_actuales_mapa'">
                                    Casos actuales
                                </h2>
                            </transition>
                        </div>
                    </div>
                    <div class="flex flex-wrap mt-2 md:mt-0">
                        <div class="py-1 px-2 mr-1 md:ml-2 text-xs md:text-sm cursor-pointer  text-gray-200 rounded-lg"
                        :class="{'bg-blue-900': currentType == 'confirmed', 'bg-blue-800': currentType != 'confirmed'}"
                        v-on:click="changeDataType('confirmed')">
                            Confirmados
                        </div>
                        <div class="py-1 px-2 mr-1 md:ml-2 text-xs md:text-sm cursor-pointer bg-blue-800 text-gray-200 
                        rounded-lg" :class="{'bg-blue-900': currentType == 'active', 'bg-blue-800': currentType != 'active'}" v-on:click="changeDataType('active')">
                            Activos
                        </div>
                        <div class="py-1 px-2 mr-1 md:ml-2 text-xs md:text-sm cursor-pointer bg-blue-800 text-gray-200 
                        rounded-lg" :class="{'bg-blue-900': currentType == 'recovered', 'bg-blue-800': currentType != 'recovered'}" v-on:click="changeDataType('recovered')">
                            Recuperados
                        </div>
                        <div class="py-1 px-2 mr-1 md:ml-2 text-xs md:text-sm cursor-pointer bg-blue-800 text-gray-200 rounded-lg" :class="{'bg-blue-900': currentType == 'critical', 'bg-blue-800': currentType != 'critical'}" v-on:click="changeDataType('critical')">
                            Críticos
                        </div>
                        <div class="py-1 px-2 mr-1 md:ml-2 text-xs md:text-sm cursor-pointer bg-blue-800 text-gray-200 rounded-lg" :class="{'bg-blue-900': currentType == 'deaths', 'bg-blue-800': currentType != 'deaths'}" v-on:click="changeDataType('deaths')">
                            Muertes
                        </div>
                        
                    </div>
                </div>
            </div>
            <div class="p-4 flex-auto">
                <!-- Chart -->
                <div class="relative" style="height:500px">
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
import * as am4core from "@amcharts/amcharts4/core";
// import * as am4charts from "@amcharts/amcharts4/charts";
import * as am4maps from "@amcharts/amcharts4/maps";
import am4geodata_worldLow from "@amcharts/amcharts4-geodata/worldLow";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

am4core.useTheme(am4themes_animated);

export default {
    name: 'world-map',
    props: {
        ready: {
            type: Boolean,
            default: false
        },
        today: {
            type: Object,
            required: true
        },
        countries: {
            type: Array,
            required: true
        }
    },

    data: () => ({
        show: false,
        container: null,
        mapChart: null,
        colors: null,
        lineChart: null,
        polygonSeries: null,
        bubbleSeries: null,
        currentPolygon: null,
        currentCountry: null,
        currentType: 'confirmed',
        currentTypeName: '',
        countryDataTimeout: null,
    }),

    mounted() {
        setTimeout(() => {
            this.$nextTick(() => {
                this.createChart()    
            })
        }, 500)
    },

    methods: {

        handleImageOver(event) {
            this.rollOverCountry(this.polygonSeries.getPolygonById(event.target.dataItem.id));
        },

        handleImageOut(event) {
            this.rollOutCountry(this.polygonSeries.getPolygonById(event.target.dataItem.id));
        },

        handleImageHit(event) {
            this.selectCountry(this.polygonSeries.getPolygonById(event.target.dataItem.id));
        },

        handleCountryHit(event) {
            this.selectCountry(event.target);
        },

        handleCountryOver(event) {
            this.rollOverCountry(event.target);
        },

        handleCountryOut(event) {
            this.rollOutCountry(event.target);
        },

        rollOutCountry(mapPolygon) {
            let image = this.bubbleSeries.getImageById(mapPolygon.dataItem.id)

            this.resetHover();
            if (image) {
                image.isHover = false;
            }
        },

        rollOverCountry(mapPolygon) {
            this.resetHover();
            if (mapPolygon) {
                mapPolygon.isHover = true;

                // make bubble hovered too
                let image = this.bubbleSeries.getImageById(mapPolygon.dataItem.id);
                if (image) {
                    image.dataItem.dataContext.name = mapPolygon.dataItem.dataContext.name;
                    image.isHover = true;
                }
            }
        },

        resetHover() {
            this.polygonSeries.mapPolygons.each(function(polygon) {
                polygon.isHover = false;
            })

            this.bubbleSeries.mapImages.each(function(image) {
                image.isHover = false;
            })
        },

        updateCountryTooltip() {
            this.polygonSeries.mapPolygons.template.tooltipText = "[bold]{country}: {value.formatNumber('#.')}[/]\n[font-size:10px]" + this.currentTypeName
        },

        selectCountry(mapPolygon) {
            this.resetHover();
            this.polygonSeries.hideTooltip();

            // if the same country is clicked show world
            if (this.currentPolygon == mapPolygon) {
                this.currentPolygon.isActive = false;
                this.currentPolygon = undefined;
                this.showWorld();
                return;
            }

            // save current polygon
            this.currentPolygon = mapPolygon;
            // let countryIndex = _.find(this.countries, {iso2 : mapPolygon.dataItem.id});
            this.currentCountry = mapPolygon.dataItem.dataContext.name;

            // make others inactive
            this.polygonSeries.mapPolygons.each(function(polygon) {
                polygon.isActive = false;
            })

            

            // updateCountryName();

            mapPolygon.isActive = true;
            this.mapChart.zoomToMapObject(mapPolygon, this.getZoomLevel(mapPolygon));
        },

        rotateAndZoom(mapPolygon) {
            this.polygonSeries.hideTooltip();

            let animation = this.mapChart.animate([{
                property: "deltaLongitude",
                to: -mapPolygon.visualLongitude
            }, {
                property: "deltaLatitude",
                to: -mapPolygon.visualLatitude
            }], 1000)

            animation.events.on("animationended", function() {
                this.mapChart.zoomToMapObject(mapPolygon, this.getZoomLevel(mapPolygon));
            })
        },

        getZoomLevel(mapPolygon) {
            let w = mapPolygon.polygon.bbox.width;
            let h = mapPolygon.polygon.bbox.width;
            // change 2 to smaller walue for a more close zoom
            return Math.min(this.mapChart.seriesWidth / (w * 2), this.mapChart.seriesHeight / (h * 2))
        },

        showWorld() {
            this.currentCountry = "World";
            this.currentPolygon = undefined;
            this.resetHover();

            // make all inactive
            this.polygonSeries.mapPolygons.each(function(polygon) {
                polygon.isActive = false;
            })

            this.mapChart.goHome();
        },

        changeDataType(name) {
            this.currentType = name;
            this.currentTypeName = name;
            if (name != "deaths") {
                this.currentTypeName += " cases";
            }

            this.bubbleSeries.mapImages.template.tooltipText = "[bold]{country}: {value}[/] [font-size:10px]\n" + this.currentTypeName;

            // tell series new field name
            this.bubbleSeries.dataFields.value = name
            this.polygonSeries.dataFields.value = name
            

            this.bubbleSeries.dataItems.each((dataItem) => {
                dataItem.setValue("value", dataItem.dataContext[this.currentType]);
            })

            this.polygonSeries.dataItems.each((dataItem) => {
                dataItem.setValue("value", dataItem.dataContext[this.currentType]);
                dataItem.mapPolygon.defaultState.properties.fill = undefined;
            })


            // change color of bubbles
            // setting colors on mapImage for tooltip colors
            this.bubbleSeries.mapImages.template.fill = this.colors[name];
            this.bubbleSeries.mapImages.template.stroke = this.colors[name];
            // first child is circle
            this.bubbleSeries.mapImages.template.children.getIndex(0).fill = this.colors[name];

            // // show series
            // let activeSeries = this.series[name];
            // activeSeries.show();
            // // hide other series
            // for (var key in this.series) {
            //     if (this.series[key] != activeSeries) {
            //         this.series[key].hide();
            //     }
            // }

            // update heat rule's maxValue
            this.bubbleSeries.heatRules.getIndex(0).maxValue = this.today[this.currentType];
            this.polygonSeries.heatRules.getIndex(0).maxValue = this.today[this.currentType];

            // this.polygonSeries.heatRules.getIndex(0).max = this.colors[name];
            // this.updateCountryTooltip();
        },

        createChart() {

            // let numberFormatter = new am4core.NumberFormatter();

            
            let confirmedColor = am4core.color("#D6BCFA");
            let activeColor = am4core.color("#FAF089");
            let recoveredColor = am4core.color("#48BB78");
            let criticalColor = am4core.color("#ED8936");
            let deathsColor = am4core.color("#F56565");

            // for an easier access by key
            this.colors = {
                active: activeColor,
                confirmed: confirmedColor,
                recovered: recoveredColor,
                critical: criticalColor,
                deaths: deathsColor
            };

            let countryColor = am4core.color("#3b3b3b");
            let countryStrokeColor = am4core.color("#000000");
            // let buttonStrokeColor = am4core.color("#ffffff");
            let countryHoverColor = am4core.color("#1b1b1b");
            let activeCountryColor = am4core.color("#0f0f0f");

            // MAP CHART 
            this.container = am4core.create(this.$refs.chart, am4core.Container);
            this.container.width = am4core.percent(100);
            this.container.height = am4core.percent(100);

            this.container.tooltip = new am4core.Tooltip();
            this.container.tooltip.background.fill = am4core.color("#000000");
            this.container.tooltip.background.stroke = activeColor;
            this.container.tooltip.fontSize = "0.9em";
            this.container.tooltip.getFillFromObject = false;
            this.container.tooltip.getStrokeFromObject = false;

            this.mapChart = this.container.createChild(am4maps.MapChart);

            this.mapChart.height = am4core.percent(100);
            this.mapChart.zoomControl = new am4maps.ZoomControl();
            this.mapChart.zoomControl.align = "right";
            this.mapChart.zoomControl.marginRight = 15;
            this.mapChart.zoomControl.valign = "middle";
            this.mapChart.homeGeoPoint = {
                longitude: 0,
                latitude: -2
            };

            // by default minus button zooms out by one step, but we modify the behavior so when user clicks on minus, the map would fully zoom-out and show world data
            this.mapChart.zoomControl.minusButton.events.on("hit", this.showWorld);
            // // clicking on a "sea" will also result a full zoom-out
            this.mapChart.seriesContainer.background.events.on("hit", this.showWorld);
            this.mapChart.seriesContainer.background.events.on("over", this.resetHover);
            this.mapChart.seriesContainer.background.fillOpacity = 0;
            this.mapChart.zoomEasing = am4core.ease.sinOut;

            // https://www.amcharts.com/docs/v4/chart-types/map/#Map_data
            // you can use more accurate world map or map of any other country - a wide selection of maps available at: https://github.com/amcharts/amcharts4-geodata
            this.mapChart.geodata = am4geodata_worldLow;

            // Set projection
            // https://www.amcharts.com/docs/v4/chart-types/map/#Setting_projection
            // instead of Miller, you can use Mercator or many other projections available: https://www.amcharts.com/demos/map-using-d3-projections/
            this.mapChart.projection = new am4maps.projections.Miller();
            this.mapChart.panBehavior = "move";

            // when map is globe, beackground is made visible
            this.mapChart.backgroundSeries.mapPolygons.template.polygon.fillOpacity = 0.05;
            this.mapChart.backgroundSeries.mapPolygons.template.polygon.fill = am4core.color("#ffffff");
            this.mapChart.backgroundSeries.hidden = true;

            // Map polygon series (defines how country areas look and behave)
            this.polygonSeries = this.mapChart.series.push(new am4maps.MapPolygonSeries());
            this.polygonSeries.dataFields.id = "id";
            this.polygonSeries.dataFields.value = this.currentType;
            this.polygonSeries.interpolationDuration = 0;

            this.polygonSeries.exclude = ["AQ"]; // Antarctica is excluded in non-globe projection
            this.polygonSeries.useGeodata = true;
            this.polygonSeries.nonScalingStroke = true;
            this.polygonSeries.strokeWidth = 0.5;
            // this helps to place bubbles in the visual middle of the area
            this.polygonSeries.calculateVisualCenter = true;
            this.polygonSeries.data = this.series;

            let polygonTemplate = this.polygonSeries.mapPolygons.template;
            polygonTemplate.fill = countryColor;
            polygonTemplate.fillOpacity = 1
            polygonTemplate.stroke = countryStrokeColor;
            polygonTemplate.strokeOpacity = 0.15
            polygonTemplate.setStateOnChildren = true;
            polygonTemplate.tooltipPosition = "fixed";

            polygonTemplate.events.on("hit", this.handleCountryHit);
            polygonTemplate.events.on("over", this.handleCountryOver);
            polygonTemplate.events.on("out", this.handleCountryOut);

            this.polygonSeries.heatRules.push({
                "target": polygonTemplate,
                "property": "fill",
                "min": countryColor,
                "max": countryColor,
                "dataField": "value"
            })


            // you can have pacific - centered map if you set this to -154.8
            this.mapChart.deltaLongitude = -10;

            // polygon states
            let polygonHoverState = polygonTemplate.states.create("hover");
            polygonHoverState.transitionDuration = 1400;
            polygonHoverState.properties.fill = countryHoverColor;

            let polygonActiveState = polygonTemplate.states.create("active")
            polygonActiveState.properties.fill = activeCountryColor;

            // Bubble series
            this.bubbleSeries = this.mapChart.series.push(new am4maps.MapImageSeries());
            this.bubbleSeries.data = this.series;

            this.bubbleSeries.dataFields.value = "active";
            this.bubbleSeries.dataFields.id = "id";

            // adjust tooltip
            this.bubbleSeries.tooltip.animationDuration = 0;
            this.bubbleSeries.tooltip.showInViewport = false;
            this.bubbleSeries.tooltip.background.fillOpacity = 0.2;
            this.bubbleSeries.tooltip.getStrokeFromObject = true;
            this.bubbleSeries.tooltip.getFillFromObject = false;
            this.bubbleSeries.tooltip.background.fillOpacity = 0.2;
            this.bubbleSeries.tooltip.background.fill = am4core.color("#000000");

            let imageTemplate = this.bubbleSeries.mapImages.template;
            // if you want bubbles to become bigger when zoomed, set this to false
            imageTemplate.nonScaling = true;
            imageTemplate.strokeOpacity = 0;
            imageTemplate.fillOpacity = 0.55;
            imageTemplate.tooltipText = "{name}: [bold]{value}[/]";
            imageTemplate.applyOnClones = true;

            imageTemplate.events.on("over", this.handleImageOver);
            imageTemplate.events.on("out", this.handleImageOut);
            imageTemplate.events.on("hit", this.handleImageHit);

            // this is needed for the tooltip to point to the top of the circle instead of the middle
            imageTemplate.adapter.add("tooltipY", function(tooltipY, target) {
                return -target.children.getIndex(0).radius;
            })
            // When hovered, circles become non-opaque  
            let imageHoverState = imageTemplate.states.create("hover");
            imageHoverState.properties.fillOpacity = 1;

            // add circle inside the image
            let circle = imageTemplate.createChild(am4core.Circle);
            // this makes the circle to pulsate a bit when showing it
            circle.hiddenState.properties.scale = 0.0001;
            circle.hiddenState.transitionDuration = 2000;
            circle.defaultState.transitionDuration = 2000;
            circle.defaultState.transitionEasing = am4core.ease.elasticOut;
            // later we set fill color on template (when changing what type of data the map should show) and all the clones get the color because of this
            circle.applyOnClones = true;

            // heat rule makes the bubbles to be of a different width. Adjust min/max for smaller/bigger radius of a bubble
            this.bubbleSeries.heatRules.push({
                "target": circle,
                "property": "radius",
                "min": 3,
                "max": 30,
                "dataField": "value"
            })

            // when data items validated, hide 0 value bubbles (because min size is set)
            this.bubbleSeries.events.on("dataitemsvalidated", () => {
                this.bubbleSeries.dataItems.each((dataItem) => {
                    let mapImage = dataItem.mapImage;
                    let circle = mapImage.children.getIndex(0);
                    if (mapImage.dataItem.value == 0) {
                        circle.hide(0);
                    }
                    else if (circle.isHidden || circle.isHiding) {
                        circle.show();
                    }
                })
            })

            // this places bubbles at the visual center of a country

            imageTemplate.adapter.add("latitude", (latitude, target) => {
                let polygon = this.polygonSeries.getPolygonById(target.dataItem.id);
                if (polygon) {
                    target.disabled = false;
                    return polygon.visualLatitude;
                }
                else {
                    target.disabled = true;
                }
                return latitude;
            })


            imageTemplate.adapter.add("longitude", (longitude, target) => {
                let polygon = this.polygonSeries.getPolygonById(target.dataItem.id);
                if (polygon) {
                    target.disabled = false;
                    return polygon.visualLongitude;
                }
                else {
                    target.disabled = true;
                }
                return longitude;
            })

            this.changeDataType(this.currentType)
            this.showChartFn()
        },

        showChartFn() {
            this.$nextTick(() => {
                this.show = true
            })
        },
    },

    computed: {
        confirmed() {
            let confirmed = _.reject(this.countries, {'confirmed': 0});
            return _.map(confirmed, (country) => {
                return {
                    id: country.iso2,
                    name: country.country,
                    value: country.confirmed
                }
            })
        },
        active() {
            let active = _.reject(this.countries, {'active': 0});
            return _.map(active, (country) => {
                return {
                    id: country.iso2,
                    name: country.country,
                    value: country.active
                }
            })
        },
        recovered() {
            let recovered = _.reject(this.countries, {'recovered': 0});
            return _.map(recovered, (country) => {
                return {
                    id: country.iso2,
                    name: country.country,
                    value: country.recovered
                }
            })
        },
        critical() {
            let critical = _.reject(this.countries, {'critical': 0});
            return _.map(critical, (country) => {
                return {
                    id: country.iso2,
                    name: country.country,
                    value: country.critical
                }
            })
        },
        deaths() {
            let deaths = _.reject(this.countries, {'deaths': 0});
            return _.map(deaths, (country) => {
                return {
                    id: country.iso2,
                    name: country.country,
                    value: country.deaths
                }
            })
        },

        series() {
            return _.map(this.countries, function(country) { 
                return _.extend({}, country, {id: country.iso2});
            });
        }
    }
}
</script>