<template>
    <div>
        <div class="relative bg-blue-800 md:pt-32 pb-28 lg:pb-32 pt-12">
            <div class="px-0 md:px-4 xl:px-10 mx-auto w-full">
                <spain-counters :spain="spain" :historical="historical" />
            </div>
        </div>
        <div class="px-0 md:px-4 xl:px-10 mx-auto w-full -m-24">
            <div class="flex flex-wrap">
                <line-chart 
                    :spain="spain"
                    :historical="historical"
                    :ca="selectedCA"
                    v-on:community="changeCCAA"
                />
                <spain-map-chart :regions="regions"></spain-map-chart>
            </div>
            <div class="flex flex-wrap mt-4">
                <last-days
                    :spain="spain"
                    :historical="historical"
                    :ca="selectedCA"
                    v-on:community="changeCCAA"
                />
                <percent-by-region :ready="showChart" :spain="spain" :regions="regions"></percent-by-region>

                <spain-regions class="mt-4 hidden" :regions="regions"></spain-regions>
            </div>
        </div>
    </div>
</template>
<script>
import { mapState, mapGetters } from 'vuex'
import LineChart from '@/components/spain/LineChart'
import SpainMapChart from '@/components/spain/SpainMapChart'
import SpainRegions from '@/components/spain/SpainRegions'
import LastDays from '@/components/spain/LastDays'
import PercentByRegion from '@/components/spain/PercentByRegion'
import SpainCounters from '@/components/spain/SpainCounters'

export default {
    name: 'spain-page',
    components: {
        LineChart,
        SpainMapChart,
        SpainRegions,
        LastDays,
        PercentByRegion,
        SpainCounters
    },
    data: () => ({
        showChart: false,
        selectedCountry: null,
        selectedCA: null,
        selectedCALastDays: null,
        hide: true,
        date: new Date().getFullYear(),
    }),

    computed: {
        ...mapState({
            countries: state => state.countries.list,
            regions: state => state.spain.data,
            historical: state => state.spain.historical,
        }),

        ...mapGetters({
            'getCountry': 'countries/getCountry',
        }),

        spain() {
            return this.getCountry('es')
        },
    },

    methods: {
        changeCCAA(value) {
            this.selectedCA = value
        }
    },

    mounted() {
        this.hide = false
        this.selectedCountry = 'ES'
        this.selectedCA = 'Total'
        this.selectedCALastDays = 'Total'
        this.showChart = false
        this.$nextTick(() => {
            this.showChart = true  
        })
    }
};
</script>
