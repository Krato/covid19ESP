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
                        <span v-else-if="props.column.field == 'casos_totales'" class="text-purple-300">
                            {{ formatValue(props.row.casos_totales) }}
                        </span>
                        <span v-else-if="props.column.field == 'activos'" class="text-yellow-300">
                            {{ formatValue(props.row.activos) }}
                        </span>
                        <span v-else-if="props.column.field == 'curados'" class="text-green-500">
                            {{ formatValue(props.row.curados) }}
                        </span>
                        <span v-else-if="props.column.field == 'hospitalizados'" class="text-orange-500">
                            {{ formatValue(props.row.hospitalizados) }}
                        </span>
                        <span v-else-if="props.column.field == 'fallecidos'" class="text-red-500">
                            {{ formatValue(props.row.fallecidos) }}
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
            field: 'casos_totales',
            type: 'number',
        }, {
            label: 'Activos',
            field: 'activos',
            type: 'number',
        }, {
            label: 'Recuperados',
            field: 'curados',
            type: 'number',
        }, {
            label: 'Críticos',
            field: 'hospitalizados',
            type: 'number',
        }, {
            label: 'Muertes',
            field: 'fallecidos',
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
                field: 'casos_totales',
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