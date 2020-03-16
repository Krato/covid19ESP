import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

var countriesIso = require("i18n-iso-countries");
import _ from 'lodash';
import cheerio from 'cheerio'
import { spanishCountries } from '../plugins/spanishCountries'


export default new Vuex.Store({
	state: {
		data: null,
		totals: null,
		daily: [],
		countries: [],
		worldometer: []
	},
	getters: {
		confirmedByCountry: (state) => (iso) => {
			let confirmed = state.data.confirmed.locations.find(info => {
				return info.country_code.match(iso.toUpperCase())
			})

			if (iso == 'CN') {
				let china = state.data.confirmed.locations.filter(info => {
					return info.country_code.match(iso.toUpperCase())
				})	

				let histories = {};
				china.forEach((item) => {
					_.forEach(item.history, (history, key) => {
						let total = 0;
						if (_.has(histories, key)) {
							total = histories[key];
						}
						Object.assign(histories, {[key]: total + history});
					})
				})

				confirmed.history = histories
			}


			//Deaths
			let deaths = state.data.deaths.locations.find(info => {
				return info.country_code.match(iso.toUpperCase())
			})

			if (iso == 'CN') {
				let china = state.data.deaths.locations.filter(info => {
					return info.country_code.match(iso.toUpperCase())
				})	

				let histories = {};
				china.forEach((item) => {
					_.forEach(item.history, (history, key) => {
						let total = 0;
						if (_.has(histories, key)) {
							total = histories[key];
						}
						Object.assign(histories, {[key]: total + history});
					})
				})

				deaths.history = histories
			}

			//Recovered
			let recovered = state.data.recovered.locations.find(info => {
				return info.country_code.match(iso.toUpperCase())
			})

			if (iso == 'CN') {
				let china = state.data.recovered.locations.filter(info => {
					return info.country_code.match(iso.toUpperCase())
				})	

				let histories = {};
				china.forEach((item) => {
					_.forEach(item.history, (history, key) => {
						let total = 0;
						if (_.has(histories, key)) {
							total = histories[key];
						}
						Object.assign(histories, {[key]: total + history});
					})
				})

				recovered.history = histories
			}

			return  {
				confirmed: confirmed,
				deaths: deaths,
				recovered: recovered,
			}
		},

		nowByCountry: (state) => (iso) => {
			let country = state.countries.find(info => {
				return info.iso2.match(iso.toUpperCase())
			})

			let countryWorldometer = state.worldometer.find(info => {
				return (info.iso2) ? info.iso2.match(iso.toUpperCase()) : false
			})

			if (countryWorldometer) {
				return countryWorldometer;
			} 

			return  {
				confirmed: (countryWorldometer.confirmed) ? countryWorldometer.confirmed : country.confirmed,
				deaths: (countryWorldometer.deaths) ? countryWorldometer.deaths : country.deaths,
				recovered: (countryWorldometer.recovered) ? countryWorldometer.recovered : country.recovered,
				active: (countryWorldometer.active) ? countryWorldometer.active : country.active,
				serious: (countryWorldometer.serious) ? countryWorldometer.serious : false,
			}
		},

		countriesGrouped: (state) => {

			let countries = {};

			state.countries.forEach(country => {

				if (_.isNil(country.iso3)) {
					country.iso3 = 'others'
					country.iso2 = 'others'
					country.countryRegion = 'Others'
				}


				if (!_.has(countries, country.iso3)) {
					let dataCountry = {
						iso3: country.iso3,
						iso2: country.iso2,
						country: country.countryRegion,
						confirmed: country.confirmed,
						recovered: country.recovered,
						deaths: country.deaths,
						provinces: []
					}

					dataCountry.provinces.push(country)
					Object.assign(countries, {[country.iso3]: dataCountry});
				} else {
					let countryData = countries[country.iso3];

					countryData.confirmed += country.confirmed
					countryData.recovered += country.recovered
					countryData.deaths += country.deaths

					countryData.provinces.push(country)
					// Object.assign(countryData, 'provinces', country);
				}
			})

			return _.sortBy(countries, ['confirmed']).reverse();
		},
	},
	mutations: {
	},
	actions: {
		getData() {
			axios.get('https://coronavirus-tracker-api.herokuapp.com/all').then(response => {
                this.state.data = response.data;
            }).catch(error => {
                console.log(error)
            });
		},

		getTotals() {
			axios.get('https://covid19.mathdro.id/api/').then(response => {
                this.state.totals = {
					confirmed: response.data.confirmed.value,
					recovered: response.data.recovered.value,
					deaths: response.data.deaths.value
                };
            })
		},

		getCountDailyData() {
			axios.get('https://covid19.mathdro.id/api/daily').then(response => {
                let daily = []
				response.data.map(el => {
					let dataCountry = {
						china: el.mainlandChina,
						otherLocations: el.otherLocations,
						confirmed: el.totalConfirmed,
						recovered: el.totalRecovered,
						deaths: el.deltaConfirmed,
						date: el.reportDateString
					}
					// reportDateString
					daily.push(dataCountry)
				})

				let confirmed = _.transform(daily, (item, value) => {
					item[value.date] = value.confirmed
				});

				let recovered = _.transform(daily, (item, value) => {
					item[value.date] = value.recovered
				});

				let deaths = _.transform(daily, (item, value) => {
					item[value.date] = value.deaths
				});

				this.state.daily = {
					confirmed: confirmed,
					recovered: recovered,
					deaths: deaths
				}

            })
		},

		getCountData() {
			countriesIso.registerLocale(require("i18n-iso-countries/langs/es.json"));
			axios.get('https://covid19.mathdro.id/api/confirmed').then(response => {
				let countries = [];
				response.data.map(el => {

					let countryTranslated = spanishCountries(el.iso3);
					let country;
					if (countryTranslated) {
						country = countryTranslated.spanish
					}

					let province = country;

					if (el.provinceState != el.countryRegion) {
						province = el.provinceState
					}

					countries.push({
						iso2: el.iso2,
						iso3: el.iso3,
						provinceState: province,
						countryRegion: country,
						confirmed: el.confirmed,
						deaths: el.deaths,
						recovered: el.recovered
					})
				})

				this.state.countries = countries
                
            })
		},

		getDataFromWorldometers() {
			axios.get('https://cors-anywhere.herokuapp.com/https://www.worldometers.info/coronavirus/').then(response => {
				var country = [];
				countriesIso.registerLocale(require("i18n-iso-countries/langs/en.json"))
				var $ = cheerio.load(response.data);
				$('tbody>tr').each(function (index, element) {

					let countryName = $(element).find('td:nth-child(1)').text().trim()
					let totalCases = parseInt($(element).find('td:nth-child(2)').text().trim().replace(',', ''))
					let newCases = parseInt($(element).find('td:nth-child(3)').text().trim().replace(',', ''))
					let totalDeaths = parseInt($(element).find('td:nth-child(4)').text().trim().replace(',', ''))
					let newDeath = parseInt($(element).find('td:nth-child(5)').text().trim().replace(',', ''))
					let totalRecovered = parseInt($(element).find('td:nth-child(6)').text().trim().replace(',', ''))
					let activeCases = parseInt($(element).find('td:nth-child(7)').text().trim().replace(',', ''))
					let seriousCases = parseInt($(element).find('td:nth-child(8)').text().trim().replace(',', ''))
					let totalCasesperOneMillionPopulation = parseInt($(element).find('td:nth-child(9)').text().trim().replace(',', ''))

					let iso3 = countriesIso.getAlpha3Code(countryName, 'en');
					let iso2 = countriesIso.getAlpha2Code(countryName, 'en');

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

					if (countryName == 'Total') {
						iso3 = 'ALL';
					}

					let countryTranslated = spanishCountries(iso3);
					if (countryTranslated) {
						countryName = countryTranslated.spanish
					}

					country[index] = {};
					country[index]['country'] = countryName
					country[index]['confirmed'] = totalCases
					country[index]['newCases'] = newCases
					country[index]['deaths'] = totalDeaths
					country[index]['newDeath'] = newDeath
					country[index]['recovered'] = totalRecovered
					country[index]['active'] = activeCases
					country[index]['serious'] = seriousCases
					country[index]['totalCasesperOneMillionPopulation'] = totalCasesperOneMillionPopulation
					country[index]['iso3'] = iso3
					country[index]['iso2'] = iso2

				});

				this.state.worldometer = _.sortBy(country, ['confirmed']).reverse();
			}).catch(error => {
				console.log(error)
			});
        }
	},
	modules: {
	}
})
