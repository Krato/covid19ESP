import axios from 'axios'
import { countriesInSpanish } from '@/helpers/countriesInSpanish'
var countriesIso = require("i18n-iso-countries");
countriesIso.registerLocale(require("i18n-iso-countries/langs/en.json"));

import * as types from '../mutation-types'

export const state = {
    list: [],
    totals: {},
    yesterday: {}
}

// getters
export const getters = {
    list: state => state.list,
    totals: state => state.totals,
    yesterday: state => state.yesterday,
    getCountry:  (state) => (iso) => {

        let country = state.list.find(info => {
            return info.iso2.match(iso.toUpperCase())
        })

        if (!country) {
            return {}
        }

        return  {
            country: country.country,
            confirmed: country.confirmed,
            deaths: country.deaths,
            recovered: country.recovered,
            active: (country.confirmed - country.deaths - country.recovered),
            serious: country.critical,
            newCases: country.todayCases
        }
    }
}

// mutations
export const mutations = {
    [types.FETCH_WORLD_SUCCESS](state, {
        world
    }) {
        state.totals = world
    },

    [types.FETCH_WORLD_FAILURE](state) {
        state.totals = {}
    },

    [types.FETCH_WORLD_YESTERDAY_SUCCESS](state, {
        yesterday
    }) {
        state.yesterday = yesterday
    },

    [types.FETCH_WORLD_YESTERDAY_FAILURE](state) {
        state.yesterday = {}
    },

    [types.FETCH_COUNTRIES_SUCCESS](state, {
        countries
    }) {
        state.list = countries
    },

    [types.FETCH_COUNTRIES_FAILURE](state) {
        state.list = []
    },
}

// actions
export const actions = {
    
    async fetchTotals({
        commit
    }) {
        try {
            const { data } = await axios.get('https://corona.lmao.ninja/all')
            commit(types.FETCH_WORLD_SUCCESS, { world: data })

        } catch (e) {
            commit(types.FETCH_WORLD_FAILURE)
        }
    },

    async fetchTotalsYesterday({
        commit
    }) {
        try {
            const { data } = await axios.get('https://corona.lmao.ninja/yesterday/world')
            commit(types.FETCH_WORLD_YESTERDAY_SUCCESS, { yesterday: data })

        } catch (e) {
            commit(types.FETCH_WORLD_YESTERDAY_FAILURE)
        }
    },

    async fetchCountries({
        commit
    }) {
        try {
            await axios.get('https://corona.lmao.ninja/countries').then(response => {
                let countries = [];
                response.data.map(el => {

                    let iso3 = countriesIso.getAlpha3Code(el.country, 'en');
                    let iso2 = countriesIso.getAlpha2Code(el.country, 'en');
                    
                    let countryName = el.country;

                    if (countryName == 'World') {
                        iso3 = 'WORLD'
                        iso2 = 'WO'
                    }

                    if (countryName == 'USA') {
                        iso3 = 'USA'
                        iso2 = 'US'
                    }

                    if (countryName == 'Iran') {
                        iso3 = 'IRN';
                        iso2 = 'IR';
                    }

                    if (countryName == 'S. Korea') {
                        iso3 = 'KOR';
                        iso2 = 'KR';
                    }

                    if (countryName == 'UK') {
                        iso3 = 'GBR';
                        iso2 = 'GB';
                    }

                    if (countryName == 'Russia') {
                        iso3 = 'RUS';
                        iso2 = 'RU';
                    }

                    if (countryName == 'Moldova') {
                        iso3 = 'MDA';
                        iso2 = 'MD';
                    }

                    if (countryName == 'Faeroe Islands') {
                        iso3 = 'FRO';
                        iso2 = 'FO';
                    }

                    if (countryName == 'UAE') {
                        iso3 = 'ARE';
                        iso2 = 'AE';
                    }

                    if (countryName == 'Macedonia, the former Yugoslav Republic of') {
                        iso3 = 'MKD';
                        iso2 = 'MK';
                    }

                    if (countryName == 'Venezuela, Bolivarian Republic of') {
                        iso3 = 'VEN';
                        iso2 = 'VE';
                    }

                    if (countryName == 'Czechia') {
                        iso3 = 'CZE';
                        iso2 = 'CZ';
                    }

                    if (countryName == 'Total') {
                        iso3 = 'ALL';
                    }

                    let countryTranslated = countriesInSpanish(iso3);
                    if (countryTranslated) {
                        countryName = countryTranslated.spanish
                    }

                    countries.push({
                        iso2: iso2,
                        iso3: iso3,
                        country: countryName,
                        confirmed: el.cases,
                        active: el.active,
                        critical: el.critical,
                        deaths: el.deaths,
                        recovered: el.recovered,
                        todayCases: el.todayCases,
                        todayDeaths: el.todayDeaths,
                        flag: el.countryInfo.flag,
                        casesPerOneMillion: el.casesPerOneMillion,
                        deathsPerOneMillion: el.deathsPerOneMillion
                    })
                })

                commit(types.FETCH_COUNTRIES_SUCCESS, {countries: countries})
            }).catch(() => {
                // this.$toasted.error("<div class='block'>Estamos teniendo algunos problemas al obtener los datos. Pronto estará solucionado.</div>", { 
                //     theme: "bubble", 
                //     position: "top-center", 
                //     duration : 5000
                // })
            })
            
        }
        catch (e) {
            commit(types.FETCH_COUNTRIES_FAILURE)
        }
    },
}