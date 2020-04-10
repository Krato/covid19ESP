<template>
    <div class=" px-4 c-pointe" :class="{
        'w-1/2 md:w-1/3 lg:w-1/3 xl:w-1/5': !first && !second,
        'w-full md:w-1/2 lg:w-1/2 xl:w-1/5': first && !second,
        'w-1/2 md:w-1/2 lg:w-1/2 xl:w-1/5': second}"
        >
        <div class="relative flex flex-col min-w-0 break-words bg-gray-900 rounded mb-6 xl:mb-0 shadow-lg">
            <template v-if="!quantity">
                <div class="w-full flex justify-center items-center">
                    <vue-loaders color="#90CDF4" name="ball-scale" scale="1"></vue-loaders>
                </div>
            </template>
            <template v-else>
                <transition name="fade">
                    <div class="flex-auto p-4">
                        <div class="flex flex-wrap">
                            <div class="relative w-full pr-2 lg:pr-4 max-w-full flex-grow flex-1">
                                <h5 class="text-white uppercase font-bold text-xs">
                                    {{ title }}
                                </h5>
                                <span class="font-semibold text-xl" :class="textColor">
                                    {{ formatValue(quantity) }}
                                </span>
                            </div>
                            <template v-if="currentHour > 8">
                                <div class="sm:flex relative w-auto pl-4 flex-initial" v-if="percent != 0"
                                    :class="{ 'hidden' : !first }">
                                    <template v-if="isPositive">
                                        <div class="text-white p-3 text-center inline-flex items-center justify-center w-10 h-10 shadow-lg rounded-full" :class="{
                                            'bg-red-500': !colorPositive, 'bg-green-500': colorPositive
                                        }">
                                            <i class="fas fa-sort-amount-up "></i>
                                        </div>
                                    </template>
                                    <template v-else>
                                        <div class="text-white p-2 text-center inline-flex items-center justify-center w-10 h-10 shadow-lg rounded-full bg-green-600">
                                            <chart-down class="w-full text-white font-bold" />
                                        </div>
                                    </template>
                                </div>
                            </template>
                            <template v-else>
                                <div class="sm:flex relative w-auto flex-initial">
                                    <div  class="flex justify-center items-center lg:mr-2" :class="textColor">
                                        <i class="text-base lg:text-xl" :class="icon"></i>
                                    </div>
                                </div>
                            </template>
                            <div class="w-full text-xs md:text-sm text-gray-500 mt-2" v-if="currentHour > 8">
                                <template  v-if="percent == 0">
                                    <div class="text-gray-500 text-xs md:text-sm">
                                        <span class="text-gray-600 mr-1">
                                            <i class="fas fa-disease"></i>
                                        </span>
                                        <span class="whitespace-no-wrap text-xs md:text-sm">Faltan datos del Ministerio</span>
                                    </div>
                                </template>
                                <template v-else>
                                    <template v-if="isPositive">
                                        <div class="text-gray-500 text-xs md:text-sm">
                                            <span :class="{ 'text-red-500': !colorPositive, 'text-green-500': colorPositive }">
                                                <i class="fas fa-arrow-up"></i> {{ formatValue(percent) }}%
                                            </span>
                                            <span class="whitespace-no-wrap text-xs md:text-sm">Más que ayer</span>
                                        </div>
                                    </template>
                                    <template v-else>
                                        <div class="text-gray-500 text-xs md:text-sm">
                                            <span class="text-green-500">
                                                <i class="fas fa-arrow-down"></i> {{ formatValue(percent) }}%
                                            </span>
                                            <span class="whitespace-no-wrap">Menos que ayer</span>
                                        </div>
                                    </template>
                                </template>
                                
                            </div>
                           <!--  <p class="text-sm text-gray-500 mt-4"><span class="text-green-500 mr-2"><i class="fas fa-arrow-up"></i> 3.48%</span><span class="whitespace-no-wrap">Since last month</span></p> -->
                        </div>
                    </div>
                </transition>
            </template>
        </div>
    </div>
</template>

<script>

import ChartDown from '@/components/svg/ChartDown'

export default {
    name: 'CounterInfo',
    components: {
        ChartDown
    },
    props: {
        first: {
            type: Boolean,
            default: false,
            required: false
        },
        second: {
            type: Boolean,
            default: false,
            required: false
        },
        title: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            required: true,
        },
        icon: {
            type: String,
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
            default: 0
        },
        percent: {
            type: Number,
            required: true,
            default: 0
        },
        color: {
            type: String,
            required: false,
            default: 'red-500'
        }
    },
    data: () => ({
        timer: null,
        currentHour: null
    }),

    computed : {
        textColor(){
            return 'text-'+this.color
        },

        bgColor() {
            return 'bg-'+this.color
        },

        isPositive() {
            if (this.percent > 0) {
                return true
            }
            return false
        },

        colorPositive() {
            if (this.type == 'recovered') {
                return true
            }

            return false;
        },
    },

    methods: {

        formatValue(value) {
            return new Intl.NumberFormat("es-ES").format(Math.abs(value).toFixed(2));
        },

    },

    mounted() {
        let now = new Date();
        this.currentHour = now.getHours();
    }
};
</script>