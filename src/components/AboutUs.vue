<template>
    <div class="w-full bg-gray-900 text-gray-200" >
        <div class="relative flex flex-col min-w-0 break-words w-full shadow-lg rounded p-4">
            <div class="rounded-t mb-0 px-4 py-3 bg-transparent">
                <div class="flex flex-wrap items-center">
                    <div class="relative w-full max-w-full flex-grow flex-1">
                        <div class="flex flex-wrap">
                            <h2 class="text-white text-xl font-semibold">
                                Sobre nosotros
                            </h2>
                        </div>
                    </div>
                    <div class="flex flex-wrap mt-2 md:mt-0 text-white text-xl self-start" v-on:click="close">
                        <i class="far fa-times-circle cursor-pointer"></i>
                    </div>
                </div>
            </div>
            <div class="p-4 flex-auto">
                <p class="pr-3">
                    Desarrollado por <a href="https://github.com/Krato/covid19ESP">Eric Lagarda</a>. 
                </p>

                <p class="mt-4">
                    <a href="https://jsonbin.io/">
                        Powered by JSONBin.io
                    </a>
                </p>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'AboutUs',

    methods: {
        close() {
            this.$emit('close')
        }
    }
}
</script>