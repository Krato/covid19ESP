<template>
  <div class="flex justify-center">
    <vue-good-table
      ref="vuetable"
      class="w-full"
      :columns="columns"
      :rows="countries"
      theme="nocturnal"
      :sort-options="{
        enabled: true,
        initialSortBy: {
          field: 'confirmed', 
          type: 'desc'
        }
      }"
      :pagination-options="{
        enabled: true,
        mode: 'records',
        perPage: 25,
        position: 'top',
        perPageDropdown: [25, 50, 100],
        dropdownAllowAll: false,
        setCurrentPage: 1,
        nextLabel: 'siguiente',
        prevLabel: 'anterior',
        rowsPerPageLabel: 'Filas por página',
        ofLabel: 'de',
        pageLabel: 'pagina', // for 'pages' mode
        allLabel: 'Todos',
      }"
      @on-row-click="onRowClick"
    />
  </div>
</template>

<script>
import 'vue-good-table/dist/vue-good-table.css'
import { VueGoodTable } from 'vue-good-table'

import { mapState } from 'vuex'

export default {
    name: 'Countries',
    components: {
        VueGoodTable
    },
    data: () => ({
        raw: {},
        columns: [
            {
                label: 'País',
                field: 'countryRegion',
                type: 'string',
                filterOptions: {
                    enabled: true,
                    filterValue: "",
                    placeholder: 'Filtra por Pais',
                },
            },
            {
                label: 'Provincia',
                field: 'provinceState',
                type: 'string',
                filterOptions: {
                    enabled: true,
                    filterValue: "",
                    placeholder: 'Filtra por Provincia',
                },
            },
            {
                label: 'Confirmados',
                field: 'confirmed',
                type: 'number',
            },
            {
                label: 'Muertes',
                field: 'deaths',
                type: 'number',
            },
            {
                label: 'Recuperados',
                field: 'recovered',
                type: 'number',
            },
        ]
    }),

    computed: {
        ...mapState({
            countries: state => state.countries
        }),
    },

    mounted() {
        //
    },
    methods: {
        onRowClick(params) {
            this.$emit('country', params.row.iso2)
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
