import Vue from 'vue'
import axios from 'axios'
import * as types from '../mutation-types'
import countapi from 'countapi-js'
import Papa from 'papaparse'
import dayjs from 'dayjs'
import _ from 'lodash'
import * as customParseFormat from 'dayjs/plugin/customParseFormat' // import plugin
dayjs.extend(customParseFormat)

export const state = {
    data: [],
    historical: {
        confirmed: [],
        deaths: [],
        recovered: [],
        critical: [],
    }
}

// getters
export const getters = {
    data: state => state.data,
    historical: state => state.historical
}

// mutations
export const mutations = {
    [types.FETCH_SPAIN_SUCCESS](state, {
        regions
    }) {
        state.data = regions

        let gotcha = 'U2FsdGVkX19nTPOTksKGw8JGYiMmWrrANkHUgv0ay9Ha0c5xWL123qf9X5MJBzH90rrwCLe14QoBE7yOeBhc9tUYrluWGGIgZ5XTDvaPpNM='
        let secret = Vue.CryptoJS.AES.decrypt(gotcha, "FCJDq6rELyrCas4").toString(Vue.CryptoJS.enc.Utf8)

        let axiosHeaders = {
            headers: { 'secret-key': secret }
        };

        axios.put('https://api.jsonbin.io/b/5e79e3ccf14dd14dd2909c5d', {data: regions}, axiosHeaders).then(() => {
        }).catch(error => {
            console.log(error)
        });
    },

    [types.FETCH_SPAIN_FAILURE](state) {
        state.data = []
    },


    [types.FETCH_SPAIN_HISTORICAL_CONFIRMED](state, {
        confirmed
    }) {
        state.historical.confirmed = confirmed
    },

    [types.FETCH_SPAIN_HISTORICAL_RECOVERED](state, {
        recovered
    }) {
        state.historical.recovered = recovered
    },

    [types.FETCH_SPAIN_HISTORICAL_CRITICAL](state, {
        critical
    }) {
        state.historical.critical = critical
    },

    [types.FETCH_SPAIN_HISTORICAL_DEATHS](state, {
        deaths
    }) {
        state.historical.deaths = deaths
    },

    [types.FETCH_SPAIN_HISTORICAL_FAILURE](state) {
        state.historical = {
            confirmed: [],
            deaths: [],
            recovered: [],
            critical: [],
        }
    },
}

// actions
export const actions = {
    async fetchSpain({
        commit
    }) {
        try {

            let gotcha = 'U2FsdGVkX19nTPOTksKGw8JGYiMmWrrANkHUgv0ay9Ha0c5xWL123qf9X5MJBzH90rrwCLe14QoBE7yOeBhc9tUYrluWGGIgZ5XTDvaPpNM='
            let secret = Vue.CryptoJS.AES.decrypt(gotcha, "FCJDq6rELyrCas4").toString(Vue.CryptoJS.enc.Utf8)

            let axiosHeaders = {
                headers: { 'secret-key': secret }
            };

            let today = new Date();
            let todayFormatted = today.getDate() + '/' + (today.getMonth() + 1) + '/'+ today.getFullYear()

            await countapi.hit('api-spain').then((result) => {

                if (result.value % 20 == 0) {
                    //https://api.chollx.es/coronavirus/ca
                
                    axios.get('https://spanish-api-covid19.pedelriomarron.now.sh/api/regions').then(response => {
                        
                        let re = response.data;
                        let ccaa = []
                        let itemsProcessed = 0;

                        re.regions.forEach((region) => { 
                            axios.get('https://spanish-api-covid19.pedelriomarron.now.sh/api/regions/' +region.code).then(answer => {
                                let data = answer.data;

                                let confirmed = parseInt(data.confirmed.value)
                                let recovered = parseInt(data.recovered.value)
                                let deaths = parseInt(data.deaths.value)
                                let uci = parseInt(data.uci.value)
                                let hospitalized = parseInt(data.hospitalized.value)

                                ccaa.push({
                                    ccaa: region.name,
                                    confirmed: confirmed,
                                    active: confirmed - recovered - deaths,
                                    recovered: recovered,
                                    deaths: deaths,
                                    critical: uci,
                                    hospitalized: hospitalized
                                })

                                itemsProcessed++

                                if(itemsProcessed === re.regions.length) {
                                    commit(types.FETCH_SPAIN_SUCCESS, {regions: ccaa})
                                }

                            });
                        });

                    }).catch(() => {
                        axios.get('https://api.jsonbin.io/b/5e79e3ccf14dd14dd2909c5d/latest', axiosHeaders).then(response => {
                            commit(types.FETCH_SPAIN_SUCCESS, {regions: response.data.data})
                        }).catch(error => {
                            console.log(error)
                        });
                    });
                } else {
                    axios.get('https://api.jsonbin.io/b/5e79e3ccf14dd14dd2909c5d/latest', axiosHeaders).then(response => {
                        commit(types.FETCH_SPAIN_SUCCESS, {regions: response.data.data})
                    }).catch(error => {
                        console.log(error)
                    });
                }
            })
        } catch (e) {
            commit(types.FETCH_SPAIN_FAILURE)
        }
    },

    async fetchSpainHistorical({
        commit
    }) {
        try {
            let apiCasos = 'https://raw.githubusercontent.com/datadista/datasets/master/COVID%2019/ccaa_covid19_casos.csv'
            axios.get(apiCasos).then(response => {
                let data = Papa.parse(response.data, {
                    delimiter: ",",
                    newline: "\n"
                }).data

                let headers = data.shift()
                let cases = _.map(data, (ca) => {
                    let caInfo = []
                    for (var i = 1; i < headers.length; i++) {
                        if (i == 1) {
                            caInfo[headers[i]] = ca[i]
                        }
                        else {
                            let fecha = dayjs(headers[i], "YYYY-MM-DD")
                            caInfo[fecha.valueOf()] = parseInt(ca[i])
                        }
                    }
                    return caInfo;
                })

                commit(types.FETCH_SPAIN_HISTORICAL_CONFIRMED, {confirmed: cases})

            }).catch(error => {
                console.log(error)
            });

            //recovered
            let apiRecovered = 'https://raw.githubusercontent.com/datadista/datasets/master/COVID%2019/ccaa_covid19_altas.csv'
            axios.get(apiRecovered).then(response => {
                let data = Papa.parse(response.data, {
                    delimiter: ",",
                    newline: "\n"
                }).data

                let headers = data.shift()
                // data.pop()
                let recovered = _.map(data, (ca) => {
                    let caInfo = []
                    for (var i = 1; i < headers.length; i++) {
                        if (i == 1) {
                            caInfo[headers[i]] = ca[i]
                        }
                        else {
                            let fecha = dayjs(headers[i], "YYYY-MM-DD")
                            caInfo[fecha.valueOf()] = parseInt(ca[i])
                        }
                    }

                    return caInfo;
                })

                commit(types.FETCH_SPAIN_HISTORICAL_RECOVERED, {recovered: recovered})

            }).catch(error => {
                console.log(error)
            });

            //critical
            let apiCritical = 'https://raw.githubusercontent.com/datadista/datasets/master/COVID%2019/ccaa_covid19_uci.csv'
            axios.get(apiCritical).then(response => {
                let data = Papa.parse(response.data, {
                    delimiter: ",",
                    newline: "\n"
                }).data

                let headers = data.shift()
                // data.pop()
                let critical = _.map(data, (ca) => {
                    let caInfo = []
                    for (var i = 1; i < headers.length; i++) {
                        if (i == 1) {
                            caInfo[headers[i]] = ca[i]
                        }
                        else {
                            let fecha = dayjs(headers[i], "YYYY-MM-DD")
                            caInfo[fecha.valueOf()] = parseInt(ca[i])
                        }
                    }

                    return caInfo;
                })

                commit(types.FETCH_SPAIN_HISTORICAL_CRITICAL, {critical: critical})

            }).catch(error => {
                console.log(error)
            });

            //apiDeaths
            let apiDeaths = 'https://raw.githubusercontent.com/datadista/datasets/master/COVID%2019/ccaa_covid19_fallecidos.csv'
            axios.get(apiDeaths).then(response => {
                let data = Papa.parse(response.data, {
                    delimiter: ",",
                    newline: "\n"
                }).data

                let headers = data.shift()
                // data.pop()
                let deaths = _.map(data, (ca) => {
                    let caInfo = []
                    for (var i = 1; i < headers.length; i++) {
                        if (i == 1) {
                            caInfo[headers[i]] = ca[i]
                        }
                        else {
                            let fecha = dayjs(headers[i], "YYYY-MM-DD")
                            caInfo[fecha.valueOf()] = parseInt(ca[i])
                        }
                    }

                    return caInfo;
                })
                
                commit(types.FETCH_SPAIN_HISTORICAL_DEATHS, {deaths: deaths})

            }).catch(error => {
                console.log(error)
            });
            

        } catch (e) {
            commit(types.FETCH_SPAIN_FAILURE)
        }
    }
}