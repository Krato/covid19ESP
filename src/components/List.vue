<template>
    <div class="flex flex-wrap justify-center overflow-y-auto">
        <div class="w-full flex flex-wrap items-center text-center border-b border-gray-700 p-2">
            <div class="w-full flex flex-wrap self-start py-2">
                <div class="flex flex-wrap" v-if="show">
                    <template v-for="(item, index) in rows">
                        <div  :key="index" class="w-1/3 md:w-1/4 p-2">
                            <div class="bg-gray-900 cursor-pointer p-2 text-xxs md:text-xs">   
                                <div class="w-auto flex flex-wrap items-center">
                                    <div class="w-full">
                                        {{ item.name }}
                                    </div>
                                </div>

                                <div class="w-auto flex flex-wrap items-center">
                                    <div class="w-full text-sm text-yellow-300 font-bold">
                                        {{ item.total }}
                                    </div>
                                    <div class="w-full">
                                        Infectados
                                    </div>
                                </div>
                            </div>
                        </div>
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>
<script>

export default {
    name: 'List',

    props: {
        rows: {
            type: Array,
            default: () => [],
            required: true
        }
    },

    data: () => ({
        show: false
    }),

    mounted() {
        setTimeout(() => {
            this.show = true    
        })
    },

    methods: {
        emitEventList(item) {
            console.log(item)
        }
    }
}
</script>