<template>
<nav class="block md:left-0 md:hidden md:fixed md:top-0 md:bottom-0 md:overflow-y-auto md:flex-row md:flex-no-wrap md:overflow-hidden shadow-xl bg-gray-900 flex flex-wrap items-center justify-between relative z-10 py-4 px-6 h-ful">
    <div class="md:flex-col md:items-stretch md:min-h-full md:flex-no-wrap px-0 flex flex-wrap items-center justify-between w-full mx-auto">
        <!-- Toggler -->
        <button class="cursor-pointer text-white opacity-50 md:hidden px-3 py-1 text-xl leading-none bg-transparent rounded border border-solid border-transparent absolute" type="button" v-on:click="toggleCollapseShow('bg-white m-2 py-3 px-6')">
            <i class="fas fa-bars">
            </i>
        </button>
        <!-- Brand -->
        <div class="w-full flex justify-center">
            <a class="inline-flex whitespace-no-wrap w-full sm:w-2/3 md:w-1/2 text-white justify-center" href="javascript:void(0)">
                <logo class="w-1/2 lg:w-full h-full">
                </logo>
            </a>
        </div>
        <!-- Collapse -->
        <div class="md:flex md:flex-col md:items-stretch md:opacity-100 md:relative md:mt-4 md:shadow-none shadow absolute top-0 left-0 right-0 z-40 overflow-y-auto overflow-x-hidden h-auto items-center flex-1 rounded" v-bind:class="collapseShow">
            <!-- Collapse header -->
            <div class="md:min-w-full md:hidden block pb-4 mb-4 h-full border-b border-solid border-gray-300">
                <div class="flex flex-wrap">
                    <div class="w-10/12">
                        <router-link :to="{ name: 'spain' }" v-slot="{ href, route, navigate}">
                            <a :href="href" @click="navigate" class="md:block text-left md:pb-2 text-gray-300 mr-0 inline-block whitespace-no-wrap text-sm uppercase font-bold p-4 px-0">
                                <img alt="Covid19 en Español" class="text-black icon w-1/2 lg:w-full" src="@/assets/logo.svg" svg-inline=""/>
                            </a>
                        </router-link>
                    </div>
                    <div class="w-2/12 flex justify-end">
                        <button class="cursor-pointer text-black opacity-50 md:hidden px-3 py-1 text-xl leading-none bg-transparent rounded border border-solid border-transparent" type="button" v-on:click="toggleCollapseShow('hidden')">
                            <i class="fas fa-times">
                            </i>
                        </button>
                    </div>
                </div>
            </div>
            <!-- Navigation -->
            <ul class="md:flex-col md:min-w-full flex flex-col list-none">
                <li class="items-center">
                    <router-link :to="{ name: 'spain' }" v-slot="{ href, route, navigate}">
                        <a :href="href" @click="navigate" class="text-gray-800 hover:text-blue-400 text-xs uppercase py-3 font-bold flex flex-wrap items-center">
                            <img alt="Spain" class="opacity-75 mr-2 text-sm w-24px inline" src="@/assets/spain.svg" svg-inline=""/>
                            Datos en España
                        </a>
                    </router-link>
                </li>
                <li class="items-center">
                    <router-link :to="{ name: 'world' }" v-slot="{ href, route, navigate }">
                        <a :href="href" @click="navigate" class="text-gray-800 hover:text-blue-400 text-xs uppercase py-3 font-bold flex flex-wrap items-center">
                            <div class="w-24px mr-2 ">
                                <i class="fas fa-globe text-gray-500 text-lg">
                                </i>
                            </div>
                            Datos Mundiales
                        </a>
                    </router-link>
                </li>
            </ul>
            <!-- Divider -->
            <hr class="my-4 md:min-w-full"/>
            <!-- Heading -->
            <h6 class="md:min-w-full text-gray-600 text-xs uppercase font-bold block pt-1 pb-4 no-underline">
                Sobre Nosotros
            </h6>
            <!-- Navigation -->
            <ul class="md:flex-col md:min-w-full flex flex-col list-none md:mb-4">
                <li class="inline-flex">
                    <a class="text-gray-800 hover:text-blue-400 text-sm block mb-4 no-underline font-semibold" href="#" v-on:click="modalAboutUs">
                        <i class="fas fa-info-circle mr-2 text-gray-500 text-base">
                        </i>
                        Quienes somos
                    </a>
                </li>

                <li class="inline-flex">
                    <a class="text-gray-800 hover:text-blue-400 text-sm block mb-4 no-underline font-semibold" href="#" v-on:click="modalSources">
                        <i class="fas fa-database mr-2 text-gray-500 text-base">
                        </i>
                        Nuestras fuentes
                    </a>
                </li>

                <li class="inline-flex">
                    <a class="text-brown-500 hover:text-blue-400 text-sm block mb-4 no-underline font-semibold" href="https://www.paypal.me/EricLagarda" target="_blank">
                        <i class="fas fa-mug-hot mr-2 text-brown-500 text-base">
                        </i>
                        Invítame a un café!
                    </a>
                </li>
            </ul>

            <!-- Divider -->
            <hr class="my-4 md:min-w-full"/>
            <!-- Heading -->
            <h6 class="md:min-w-full text-gray-600 text-xs uppercase font-bold block pt-1 pb-4 no-underline">
                Comparte
            </h6>

            <div class="flex">
                <ul class="md:flex-col md:min-w-full flex flex-col list-none md:mb-4">
                    <li class="inline-flex">
                        <a class="text-gray-800 hover:text-blue-400 text-sm block mb-4 no-underline font-semibold" href="whatsapp://send?text=Visualiza%20en%20tiempo%20real%20los%20datos%20del%20Coronavirus%20(Covid19)%20en%20España%20https://covid19esp.herokuapp.com" target="_blank">
                            <i class="fab fa-whatsapp mr-2 text-gray-500 text-base"></i>
                            Whatsapp
                        </a>
                    </li>
                    <li class="inline-flex">
                        <a class="text-gray-800 hover:text-blue-400 text-sm block mb-4 no-underline font-semibold" href="https://twitter.com/intent/tweet?url=https%3A%2F%2Fcovid19esp.herokuapp.com&text=Coronavirus%20-%20Estad%C3%ADsticas%20en%20tiempo%20real%20en%20Espa%C3%B1ol&hashtags=Covid_19,Coronavirus,covid19ESP" target="_blank">
                            <i class="fab fa-twitter mr-2 text-gray-500 text-base">
                            </i>
                            Twitter
                        </a>
                    </li>
                    <li class="inline-flex">
                        <a class="text-gray-800 hover:text-blue-400 text-sm block mb-4 no-underline font-semibold" href="https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fcovid19esp.herokuapp.com" target="_blank">
                            <i class="fab fa-facebook mr-2 text-gray-500 text-base">
                            </i>
                            Facebook
                        </a>
                    </li>
                    <li class="inline-flex">
                        <a class="text-gray-800 hover:text-blue-400 text-sm block mb-4 no-underline font-semibold" href="https://github.com/Krato/covid19ESP" target="_blank">
                            <i class="fab fa-github mr-2 text-gray-500 text-base"></i>
                            Github
                        </a>
                    </li>
                </ul>
            </div>
            
        </div>
    </div>
</nav>
</template>
<script>
import Logo from '@/components/svg/Logo.vue'

export default {
    components: {
        Logo
    },

    data: () => ({
        collapseShow: 'hidden',
    }),

    methods: {

        toggleCollapseShow(classes) {
            this.collapseShow = classes;
        },

        modalAboutUs() {
            this.toggleCollapseShow('hidden')
            this.$emit('open-about')
        },

        modalSources() {
            this.toggleCollapseShow('hidden')
            this.$emit('open-sources')
        },
    },

    watch: {
        '$route' () {
            this.toggleCollapseShow('hidden')
        }
    }
};
</script>
