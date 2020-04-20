<template>
    <div>
        <div class="flex flex-wrap">
            <counter-world 
                title="Confirmados"
                color="purple-300"
                type="confirmados"
                icon="fas fa-virus"
                :quantity="today.cases"
                :today="today.todayCases"
                :first="true"
            />
            
            <counter-world 
                title="Activos"
                color="yellow-300"
                type="activos"
                icon="fas fa-head-side-cough"
                :quantity="today.active"
                :today="todayActiveDiff"
                :second="true"
            />
            
            <counter-world
                title="Recuperados"
                color="green-500"
                type="recuperados"
                icon="fas fa-house-user"
                :quantity="today.recovered"
                :today="todayRecoveredDiff"
            />
            
            <counter-world
                title="Críticos"
                color="orange-500"
                type="críticos"
                icon="fas fa-ambulance"
                :quantity="today.critical"
                :today="todayCriticalDiff" 
            />
            
            <counter-world
                title="Muertes"
                color="red-500"
                type="muertes"
                icon="fas fa-heart-broken"
                :quantity="today.deaths"
                :today="todayDeathsDiff" 
            />
        </div>
    </div>
</template>
<script>

import CounterWorld from '@/components/CounterWorld'

export default {
    name: 'world-counter',
    components: {
        CounterWorld
    },
    props: {
        today: {
            type: Object,
            required: true
        },
        yesterday: {
            required: true
        },
    },

    data: () => ({
        // yesterday: null,
        dayBeforeYesterday: null
    }),

    mounted() {
        //
    },

    created() {
        //
    },

    methods: {
        //
    },

    computed: {

        todayActiveDiff()
        {
            return this.today.active - this.yesterday.active; 
        },

        todayRecoveredDiff()
        {
            return this.today.recovered - this.yesterday.recovered; 
        },
        
        todayCriticalDiff()
        {
            return this.today.critical - this.yesterday.critical; 
        },
            
        todayDeathsDiff()
        {
            return this.today.deaths - this.yesterday.deaths; 
        },
    }
}
</script>