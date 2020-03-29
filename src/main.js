import Vue from 'vue'
import VueAnalytics from 'vue-analytics';
import VueCryptoJs from 'vue-cryptojs'
import VueLoaders from 'vue-loaders';
import VueToasted from 'vue-toasted'

import './plugins/axios'
import store from './store'
import router from './router'
import '@/assets/tailwind.css'
import 'vue-loaders/dist/vue-loaders.css'

import App from './App.vue'

Vue.config.productionTip = false

Vue.use(VueAnalytics, {
    id: 'UA-161741906-1',
    router,
    debug: {
        sendHitTask: process.env.NODE_ENV === 'production'
    }
});

Vue.use(VueCryptoJs)
Vue.use(VueLoaders);
Vue.use(VueToasted)


new Vue({
    store,
    router,
    data() {
        return {
            timer: null,
        }
    },
    async created() {
        await this.getAllData()
        this.timer = setInterval(() => {
            this.getAllData.then
        }, 60000 * 3)
    },
    methods: {
        getAllData() {
            this.$store.dispatch('getTotals')
            this.$store.dispatch('getSpanishData')
            // this.$store.dispatch('getDataFromWorldometers')
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
