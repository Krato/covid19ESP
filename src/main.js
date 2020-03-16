import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import store from './store'
import router from './router'
import './assets/tailwind.css'

Vue.config.productionTip = false

new Vue({
	store,
	router,
	created() {
		this.$store.dispatch('getTotals')
		this.$store.dispatch('getDataFromWorldometers')
		this.$store.dispatch('getCountData')
		this.$store.dispatch('getCountDailyData')
		this.$store.dispatch('getData')
	},
	render: h => h(App)
}).$mount('#app')