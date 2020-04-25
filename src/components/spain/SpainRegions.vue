<template>
    <div class="w-full mb-12 xl:mb-0 px-4 text-white">
        <div class="relative flex flex-col min-w-0 break-words bg-gray-900 w-full mb-6 shadow-lg rounded">
            <div class="rounded-t mb-0 py-3 border-0">
                <div class="flex flex-wrap items-center">
                    <div class="relative w-full px-4 max-w-full flex-grow flex-1">
                        <h3 class="font-semibold text-base text-gray-200">
                            Comunidades Autónomas - Totales acumulados
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

                <div class="w-full flex justify-center items-center pb-8" v-if="!noEmpty(regionsOrdered)">
                    <vue-loaders color="#90CDF4" name="ball-scale" scale="1"></vue-loaders>
                </div>

                <vue-good-table
                    v-if="noEmpty(regionsOrdered)"
                    theme="nocturnal"
                    :columns="columns"
                    :rows="regionsOrdered"
                    :sort-options="sortOptions"
                    :pagination-options="paginationOptions"
                    styleClass="vgt-table">
                    <template slot="table-row" slot-scope="props">
                        <span v-if="props.column.field == 'ccaa'" class="pl-1 whitespace-no-wrap">
                            <template v-if="props.row.ccaa">
                                {{ props.row.ccaa }}
                            </template>
                            <template v-else>
                                Todas
                            </template>
                        </span>
                        <span v-else-if="props.column.field == 'confirmed'" class="text-purple-300">
                            {{ formatValue(props.row.confirmed) }}
                        </span>
                        <span v-else-if="props.column.field == 'active'" class="text-yellow-300">
                            {{ formatValue(props.row.active) }}
                        </span>
                        <span v-else-if="props.column.field == 'recovered'" class="text-green-500">
                            {{ formatValue(props.row.recovered) }}
                        </span>
                        <span v-else-if="props.column.field == 'critical'" class="text-orange-500">
                            {{ formatValue(props.row.critical) }}
                        </span>
                        <span v-else-if="props.column.field == 'hospitalized'" class="text-orange-500">
                            {{ formatValue(props.row.hospitalized) }}
                        </span>
                        <span v-else-if="props.column.field == 'deaths'" class="text-red-500">
                            {{ formatValue(props.row.deaths) }}
                        </span>
                        <span v-else class="">
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
    name: 'SpainRegions',
    components: {
        VueGoodTable
    },
    props: {
        regions: {
            type: Array,
            required: true
        },
    },
    data: () => ({
        columns: [{
            label: 'Comunidad',
            field: 'ccaa',
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
        },
        {
            label: 'Críticos',
            field: 'critical',
            type: 'number',
        }, 
        {
            label: 'Hospitalizados',
            field: 'hospitalized',
            type: 'number',
        }, 
        {
            label: 'Muertes',
            field: 'deaths',
            type: 'number',
        }],
        paginationOptions: {
            enabled: true,
            nextLabel: '',
            prevLabel: '',
            rowsPerPageLabel: 'Filas por página',
            ofLabel: 'de',
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

        noEmpty(value) {
            return (_.size(value) > 0)
        },

    },

    computed : {
        regionsOrdered() {

            let ordered = _.reject(this.regions, ({ccaa}) => !ccaa);

            return _.sortBy(ordered, 'confirmed').reverse()
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