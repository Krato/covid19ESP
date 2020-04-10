<template>
    <div class="w-full xl:w-full mb-12 xl:mb-0 px-4 text-white">
        <div class="relative flex flex-col min-w-0 break-words bg-gray-900 w-full mb-6 shadow-lg rounded">
            <div class="rounded-t mb-0 py-3 border-0">
                <div class="flex flex-wrap items-center">
                    <div class="relative w-full px-4 max-w-full flex-grow flex-1">
                        <h3 class="font-semibold text-base text-gray-200">
                            Mundo - Listado por Países
                        </h3>
                    </div>
                    <!-- <div class="relative w-full px-4 max-w-full flex-grow flex-1 text-right">
                        <button
                            class="bg-indigo-500 text-white active:bg-indigo-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1"
                            type="button"
                            style="transition:all .15s ease"
                        >
                            See all
                        </button>
                    </div> -->
                </div>
            </div>
            <div class="block w-full rounded-b ">

                <div class="w-full flex justify-center items-center pb-8" v-if="!noEmpty(countries)">
                    <vue-loaders color="#90CDF4" name="ball-scale" scale="1"></vue-loaders>
                </div>

                <vue-good-table
                    v-if="noEmpty(countries)"
                    theme="nocturnal"
                    :columns="columns"
                    :rows="countries"
                    :sort-options="sortOptions"
                    :pagination-options="paginationOptions"
                    styleClass="vgt-table"
                    @on-row-click="getCountryDetails">
                    <template slot="table-row" slot-scope="props">
                        <div v-if="props.column.field == 'country'" class="pl-1 text-xs md:text-sm whitespace-no-wrap flex items-center flex-wrap">
                            <img :src="props.row.flag" class="w-8 mr-2">
                            <span class="w-full mt-2 sm:w-auto sm:mt-0">
                                {{ props.row.country }}
                            </span>
                            
                        </div>
                        <span v-else-if="props.column.field == 'confirmed'" class="text-xs md:text-sm text-purple-300">
                            {{ formatValue(props.row.confirmed) }}
                        </span>
                        <span v-else-if="props.column.field == 'active'" class="text-xs md:text-sm text-yellow-300">
                            {{ formatValue(props.row.active) }}
                        </span>
                        <span v-else-if="props.column.field == 'recovered'" class="text-xs md:text-sm text-green-500">
                            {{ formatValue(props.row.recovered) }}
                        </span>
                        <span v-else-if="props.column.field == 'critical'" class="text-xs md:text-sm text-orange-500">
                            {{ formatValue(props.row.critical) }}
                        </span>
                        <span v-else-if="props.column.field == 'deaths'" class="text-xs md:text-sm text-red-500">
                            {{ formatValue(props.row.deaths) }}
                        </span>
                        <span v-else-if="props.column.field == 'casesPerOneMillion'" class="text-xs md:text-sm text-yellow-200">
                            {{ formatValue(props.row.casesPerOneMillion) }}/m
                        </span>
                        <span v-else-if="props.column.field == 'deathsPerOneMillion'" class="text-xs md:text-sm text-red-300">
                            {{ formatValue(props.row.deathsPerOneMillion) }}/m
                        </span>
                        <span v-else class="text-xs md:text-sm">
                            {{ formatValue(props.formattedRow[props.column.field]) }}
                        </span>
                    </template>
                </vue-good-table>
            </div>
        </div>
    </div>
</template>
<script>

import _ from 'lodash'
import 'vue-good-table/dist/vue-good-table.css'
import { VueGoodTable } from 'vue-good-table';

export default {
    name: 'CountryList',
    components: {
        VueGoodTable
    },
    props: {
        countries: {
            type: Array,
            required: true
        },
    },
    data: () => ({
        columns: [{
            label: 'País',
            field: 'country',
        }, {
            label: 'Infectados',
            field: 'confirmed',
            type: 'number',
        }, {
            label: 'Activos',
            field: 'active',
            type: 'number',
        }, {
            label: 'Recuperados',
            field: 'recovered',
            type: 'number',
        }, {
            label: 'Críticos',
            field: 'critical',
            type: 'number',
        }, {
            label: 'Muertes',
            field: 'deaths',
            type: 'number',
        }, {
            label: 'Infectados/Millón',
            field: 'casesPerOneMillion',
            type: 'number',
        }, {
            label: 'Muertes/Millón',
            field: 'deathsPerOneMillion',
            type: 'number',
        }],
        paginationOptions: {
            perPage: 25,
            enabled: true,
            nextLabel: '',
            prevLabel: '',
            rowsPerPageLabel: 'Filas por página',
            ofLabel: 'de',
            perPageDropdown: [10, 25, 50, 100],
            allLabel: 'Todas',
        },
        sortOptions:{
            enabled: true,
            initialSortBy: {
                field: 'confirmed',
                type: 'desc'
            }
        }
    }),

    methods: {

        formatValue(value) {
            return new Intl.NumberFormat("es-ES").format(value);
        },

        getActive(region) {
            return region.casos_totales - region.curados - region.fallecidos;
        },

        noEmpty(value) {
            return (_.size(value) > 0)
        },

        getCountryDetails(params) {
            this.$emit('country-info', params.row.iso3)
        }

    },

    computed : {
        regionsOrdered() {

            let ordered = _.map(this.regions, (element) => {
                return _.extend({}, element, {
                    activos: this.getActive(element)
                });
            });

            ordered = _.reject(ordered, ({ccaa}) => !ccaa);

            return _.sortBy(ordered, 'casos_totales').reverse()
        },
        textColor(){
            return 'text-'+this.color
        },

        bgColor() {
            return 'bg-'+this.color
        }
    }
};   
</script>