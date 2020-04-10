<template>
  <div class="w-full xl:w-4/12 px-4">
    <div class="relative flex flex-col min-w-0 break-words bg-gray-900 w-full mb-6 shadow-lg rounded">
      <div class="rounded-t mb-0 px-4 py-3 bg-transparent">
        <div class="flex flex-wrap items-center">
          <div class="relative w-full max-w-full flex-grow flex-1">
            <h6 class="uppercase text-gray-200 mb-1 text-xs font-semibold">
              Mapa de España
            </h6>
            <h2 class="text-white text-xl font-semibold">
              Casos confirmados
            </h2>
          </div>
        </div>
      </div>
      <div class="p-4 flex-auto">
        <!-- Chart -->
        <div class="relative" style="height:350px">
            <spain-map :spain="regions" v-on:chart-ready="showChart" :class="{'hidden': !isReady}"></spain-map>
            <div class=" h-full w-full flex justify-center items-center" v-if="!isReady">
                <vue-loaders color="#90CDF4" name="ball-scale" scale="1"></vue-loaders>
            </div>
        </div>
        
      </div>
    </div>
  </div>
</template>
<script>
import SpainMap from './SpainMap';

export default {
    components: {
        SpainMap
    },
    props: {
        regions: {
            type: Array,
            required: true
        }
    },
    data: () => ({
        isReady: false
    }),

    methods: {
        showChart() {
            this.isReady = true
        }
    }
};
</script>
