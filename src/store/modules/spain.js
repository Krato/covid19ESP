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

            await countapi.hit('api-spain').then((result) => {

                if (result.value % 10 == 0) {
                    axios.get('https://cors-anywhere.herokuapp.com/https://api.chollx.es/coronavirus/ca', {}, { timeout: 2000 }).then(response => {
                        let ccaa = response.data
                        ccaa.pop()
                        
                        commit(types.FETCH_SPAIN_SUCCESS, {regions: ccaa})

                        axios.put('https://api.jsonbin.io/b/5e79e3ccf14dd14dd2909c5d', {data: ccaa}, axiosHeaders).then(() => {
                        }).catch(error => {
                            console.log(error)
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