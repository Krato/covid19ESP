<template>
    <div class="flex w-full xl:w-1/2 lg:pl-2 xl:pr-4 mb-8 xl:mb-0">
        <div class="flex flex-wrap w-full h-full shadow-lg bg-gray-800 rounded-lg relative">
            <div class="box-header text-sm">
                <div class="">
                    Mapa de españa por CCAA
                </div>
                <div class="flex self-end cursor-pointer float-right">
                    <div class="shadow-lg bg-gray-900 py-1 px-2 cursor-pointer" v-on:click="changeType">
                        <template v-if="type == 'map'">
                            Ver listado
                        </template>
                        <template v-else>
                            Ver mapa
                        </template>
                    </div>
                </div>
            </div>
            <div class="box-body">
                <div v-if="!show" class="w-full h-full flex justify-center items-center">
                    <vue-loaders name="ball-scale" color="#90CDF4" scale="1.2" />
                </div>
                <template v-if="show">
                    <template v-if="type == 'list'">
                        <list :rows="spanishData" v-on:change-ca="changeCa"></list>
                    </template>
                    <template v-else>
                        <spain-map :spain="spain"></spain-map>
                    </template>
                </template>
            </div>
        </div>
    </div>
</template>

<script>
import _ from 'lodash'

// import spain from "../plugins/spain.js"
import { mapState } from 'vuex'


import List from './List'
import SpainMap from './SpainMap'
import spainRegions from '../plugins/spainRegions.js'

export default {
    name: 'Spain',

    components: {
        List,
        SpainMap
    },

    props: {
        iso: {
            required: false,
            default: 'all'
        }
    },

    data: () => ({
        show: false,
        type: 'map',
        colors: {
            low: '#FEFCBF',
            normal: '#FAF089',
            high: '#ED8936',
            danger: '#E53E3E'
        },
    }),

    computed:{
        ...mapState({
            spain: state => state.spain
        }),

        series() {
            return _.map(this.spain, (item) => ({
                name: item.ccaa,
                value: item.casos_totales,
                color: this.getHeatColor(item.casos_totales)
            }))
        },

        spanishData() {
            let provinces = []
            if (this.spain) {
                this.spain.forEach((item) => {
                    let comunity = spainRegions(item.ccaa, true)

                    let name = item.ccaa
                    if (comunity) {
                        name = comunity.code  
                    }

                    provinces.push({
                        name: name,
                        original: item.ccaa,
                        total: item.casos_totales,
                        color: this.getHeatColor(item.casos_totales)
                    })
                })
            }
            return _.sortBy(provinces, 'total').reverse();
        }
    },

    watch: {

        spain(value) {
            if (value) {
                this.$nextTick(() => {
                    this.show = true   
                })	
            }
        },


    },

    mounted() {
        // this.$nextTick(() => {
        //     setTimeout(() => {
        //         this.show = true    
        //     }, 500)
        // })
    },

    methods: {
        changeType() {
            this.type = (this.type == 'map') ? 'list' : 'map'
        },

        getHeatColor(value) {
            if (value >= 2000) {
                return this.colors.danger
            }

            if (value >= 1000) {
                return this.colors.high
            }

            if (value >= 500) {
                return this.colors.normal
            }

            return this.colors.low
        },

        changeCa(ca) {
            this.$emit('change-ca', ca)
        }
    }
}
</script>
<style scoped>
    .map {
      min-height: 500px;
    }
 </style>