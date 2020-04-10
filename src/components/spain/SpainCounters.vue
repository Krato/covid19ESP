<template>
    <div>
        <div class="flex flex-wrap">
            <counter-info 
                title="Confirmados"
                color="purple-300"
                type="confirmed"
                icon="fas fa-virus"
                :quantity="spain.confirmed"
                :percent="yesterdayConfirmed"
                :first="true"
            />
            
            <counter-info 
                title="Activos"
                color="yellow-300"
                type="active"
                icon="fas fa-head-side-cough"
                :quantity="spain.active"
                :percent="yesterdayActive"
                :second="true"
            />
            
            <counter-info
                title="Recuperados"
                color="green-500"
                type="recovered"
                icon="fas fa-house-user"
                :quantity="spain.recovered"
                :percent="yesterdayRecovered"
            />
            
            <counter-info
                title="Críticos"
                color="orange-500"
                type="critical"
                icon="fas fa-ambulance"
                :quantity="spain.serious"
                :percent="yesterdayCritical" 
            />
            
            <counter-info
                title="Muertes"
                color="red-500"
                type="deaths"
                icon="fas fa-heart-broken"
                :quantity="spain.deaths"
                :percent="yesterdayDeaths" 
            />
        </div>
    </div>
</template>
<script>
import _ from 'lodash'
import CounterInfo from '@/components/CounterInfo'
import dayjs from 'dayjs'
import * as customParseFormat from 'dayjs/plugin/customParseFormat' // import plugin
dayjs.extend(customParseFormat)

export default {
    name: 'spain-counter',
    components: {
        CounterInfo
    },
    props: {
        spain: {
            type: Object,
            required: true
        },
        historical: {
            type: Object,
            required: true
        },
    },

    data: () => ({
        yesterday: null,
        dayBeforeYesterday: null
    }),

    created() {
        let now = new Date()
        now.setDate(now.getDate() - 1);

        let day = now.getDate()
        let month = now.getMonth()
        let year = now.getFullYear()
        this.yesterday = dayjs(new Date(year, month, day))
        this.dayBeforeYesterday = this.yesterday.subtract(1, 'day')
    },

    methods: {

        getValue(key, spainKey) {
            let total = this.historical[key].find((confirmed) => {
                return confirmed.CCAA == 'Total'
            })
            let dayBeforeYesterday = _.get(total, this.dayBeforeYesterday.valueOf())
            let yesterday = _.get(total, this.yesterday.valueOf())

            return {
                yesterday: yesterday - dayBeforeYesterday,
                today: this.spain[spainKey] - yesterday
            }
        },

    },

    computed: {
        
        yesterdayConfirmed() {
            if (this.historical) {
                let confirmed = this.getValue('confirmed', 'confirmed')

                if (confirmed.today == 0 || _.isNaN(confirmed.today)) {
                    return 0
                }

                return ((confirmed.today - confirmed.yesterday) * 100) / confirmed.yesterday
            }

            return 0
        },

        yesterdayActive() {
            if (this.historical) {
                let confirmed = this.getValue('confirmed', 'confirmed')
                let recovered = this.getValue('recovered', 'recovered')
                let deaths = this.getValue('deaths', 'deaths')

                let yesterdayActive = confirmed.yesterday - recovered.yesterday - deaths.yesterday
                let todayActive = confirmed.today - recovered.today - deaths.today

                if (todayActive == 0) {
                    return 0
                }
                
                return ((todayActive - yesterdayActive) * 100) / yesterdayActive
            }

            return 0
        },

        yesterdayRecovered() {
            if (this.historical) {
                let recovered = this.getValue('recovered', 'recovered')

                if (recovered.today == 0 || _.isNaN(recovered.today)) {
                    return 0
                }

                return ((recovered.today - recovered.yesterday) * 100) / recovered.yesterday
            }

            return 0
        },

        yesterdayCritical() {
            if (this.historical) {
                let critical = this.getValue('critical', 'serious')

                if (critical.today == 0 || _.isNaN(critical.today)) {
                    return 0
                }

                return ((critical.today - critical.yesterday) * 100) / critical.yesterday
            }

            return 0
        },

        yesterdayDeaths() {
            if (this.historical) {
                let deaths = this.getValue('deaths', 'deaths')

                if (deaths.today == 0 || _.isNaN(deaths.today)) {
                    return 0
                }

                return ((deaths.today - deaths.yesterday) * 100) / deaths.yesterday
            }

            return 0
        }

    }
}
</script>