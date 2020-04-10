import Vue from 'vue';
import App from '@/App.vue';
import './registerServiceWorker';

import './helpers/plugins'
import router from './router';
import store from './store';
import './assets/tailwind.scss';
import "@fortawesome/fontawesome-free/css/all.min.css";

Vue.config.productionTip = false;

import VueAnalytics from 'vue-analytics'
Vue.use(VueAnalytics, {
    id: 'UA-161741906-1',
    router,
    debug: {
        sendHitTask: process.env.NODE_ENV === 'production'
    }
})

new Vue({
    router,
    store,
    render: (h) => h(App),
    async created() {
        await this.$store.dispatch('spain/fetchSpain')
        await this.$store.dispatch('spain/fetchSpainHistorical')
        await this.$store.dispatch('countries/fetchCountries')
    }
}).$mount('#app');
