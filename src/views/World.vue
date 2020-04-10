<template>
    <div>
        <div class="relative bg-blue-800 md:pt-32 pb-28 lg:pb-32 pt-12">
            <div class="px-0 md:px-4 xl:px-10 mx-auto w-full" v-if="totals && yesterday">
                <world-counters :today="totals" :yesterday="yesterday" />
            </div>
        </div>

        <div class="px-0 md:px-4 xl:px-10 mx-auto w-full -m-24">
            <div class="hidden md:flex flex-wrap mt-4" mq="md+">
                <world-map :ready="showChart" v-if="showChart" :today="totals" :countries="countries" />
            </div>
            <div class="flex flex-wrap mt-4">
                <country-list :countries="countries" v-on:country-info="getCountryDetails" />
            </div>
        </div>
        <modal name="country-details" :width="'80%'" height="auto">
            <country-details :countries="countries" :country="selectedCountry" v-on:close="closeModal" />
        </modal>
    </div>
</template>
<script>
import { mapState } from 'vuex'
import WorldCounters from '@/components/world/WorldCounters'
import WorldMap from '@/components/world/WorldMap'
import CountryList from '@/components/world/CountryList'
import CountryDetails from '@/components/world/CountryDetails'

export default {
    name: 'world-page',
    components: {
        WorldCounters,
        WorldMap,
        CountryList,
        CountryDetails
    },
    data: () => ({
        showChart: false,
        selectedCountry: null,
        hide: true,
        date: new Date().getFullYear(),
    }),

    computed: {
        ...mapState({
            countries: state => state.countries.list,
            totals: state => state.countries.totals,
            yesterday: state => state.countries.yesterday,
        }),
    },

    methods: {
            
        getCountryDetails(country) {
            this.selectedCountry = country
            this.$modal.show('country-details')
        },

        closeModal() {
            this.$modal.hide('country-details')
        }

    },

    mounted() {
        this.showChart = false
        this.$nextTick(() => {
            this.showChart = true  
        })
    },

    async created() {
        await this.$store.dispatch('countries/fetchTotals')
        await this.$store.dispatch('countries/fetchTotalsYesterday')
    }
};
</script>
