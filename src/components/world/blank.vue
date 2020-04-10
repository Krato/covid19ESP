<template>
    <div class="w-full xl:w-6/12 px-4">
        <div class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-gray-900">
            <div class="rounded-t mb-0 px-4 py-3 bg-transparent">
                <div class="flex flex-wrap items-center">
                    <div class="relative w-full max-w-full flex-grow flex-1">
                        <h6 class="uppercase text-gray-200 mb-1 text-xs font-semibold">
                            Últimos {{ days }} días
                        </h6>
                        <div class="flex flex-wrap">
                            <transition name="fade" mode="out-in">
                                <h2 class="text-white text-xl font-semibold" :key="'five_daily'" v-if="type == 'daily'">
                                    Datos por día
                                </h2>
                                <h2 class="text-white text-xl font-semibold"  :key="'five_sum'" v-else>
                                    Totales acumulados
                                </h2>
                            </transition>
                        </div>
                    </div>
                </div>
            </div>
            <div class="p-4 flex-auto">
                <!-- Chart -->
                <div class="relative" style="height:350px">
                    Contenido
                </div>
            </div>
        </div>
    </div>
</template>