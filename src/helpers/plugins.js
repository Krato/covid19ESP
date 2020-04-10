import Vue from 'vue';

import VueCryptojs from 'vue-cryptojs'
Vue.use(VueCryptojs)

import 'vue-loaders/dist/vue-loaders.css'
import VueLoaders from 'vue-loaders'
Vue.use(VueLoaders)

import VModal from 'vue-js-modal'
Vue.use(VModal)

import VTooltip from 'v-tooltip'
Vue.use(VTooltip)

import VueMq from 'vue-mq'
Vue.use(VueMq, {
    breakpoints: { // default breakpoints - customize this
        sm: 640,
        md: 768,
        lg: 1024,
        xl: 1280,
        xxl: Infinity,
    },
    defaultBreakpoint: 'sm' // customize this for SSR
})