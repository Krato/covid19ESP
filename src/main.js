import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import store from './store'
import router from './router'
import IdleVue from 'idle-vue'
import '@/assets/tailwind.css'

const eventsHub = new Vue()
Vue.use(IdleVue, {
    eventEmitter: eventsHub,
    idleTime: 5000,
    store
})

Vue.config.productionTip = false
// Vue.config.performance = true
// 
import Toasted from 'vue-toasted';
Vue.use(Toasted)

import VTooltip from 'v-tooltip'
Vue.use(VTooltip)

import VueAnalytics from 'vue-analytics'
Vue.use(VueAnalytics, {
    id: 'UA-161741906-1',
    router,
    debug: {
        sendHitTask: process.env.NODE_ENV === 'production'
    }
})

Vue.config.warnHandler = function(msg, vm, trace) {
    console.log(`Warn: ${msg}\nTrace: ${trace}`);
}


Vue.config.errorHandler = err => {
    console.log('Exception: ', err)
}

new Vue({
    store,
    router,
    data: () => ({
        timer: null,
    }),
    computed: {
        isOut() {
            if (this.isAppIdle) {
                console.log('User was out')
            }
            return this.isAppIdle ? true : false
        }
    },
    async created() {
        await this.getAllData()
        // this.timer = setInterval(() => {
        //     this.getAllData.then
        // }, 60000 * 3)
    },
    methods: {
        getAllData() {
            this.$store.dispatch('getTotals')
            this.$store.dispatch('getSpanishData')
            this.$store.dispatch('getSpanishHistoricalData')
            this.$store.dispatch('getCountData')
            this.$store.dispatch('getCountDailyData')
            this.$store.dispatch('getData')

        }
    },
    beforeDestroy () {
        clearInterval(this.timer)
    },
    render: h => h(App)
}).$mount('#app')
