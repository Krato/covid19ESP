<template>
    <nav class="absolute top-0 left-0 w-full z-10 bg-transparent md:flex-row md:flex-no-wrap md:justify-start flex items-center p-4">
        <div class="w-full mx-autp items-center flex justify-between md:flex-no-wrap flex-wrap lg:px-10 px-4">
            <div class="flex flex-wrap items-center w-full flex-1 text-white">

                <a class="text-white text-sm uppercase hidden md:inline-block font-semibold w-1/3 lg:w-1/6 xl:mr-8 mr-4" href="#">
                    <logo class="w-full" />
                </a>
                <div class="flex-wrap hidden md:flex text-xs md:text-sm">
                    <router-link :to="{ name: 'spain' }" v-slot="{ href, route, navigate, isActive, isExactActive }">
                        <a :class="{'bg-blue-700': isExactActive, 'bg-blue-900': !isExactActive}" :href="href" @click="navigate" class="bg-blue-700 text-gray-200 rounded-lg btext-center shadow hover:-translate-y-px hover:shadow-md mr-4">
                            <div class="m-3">
                                <template v-if="isExactActive">
                                    Viendo datos de España
                                </template>
                                <template v-else>
                                    Ver datos de España
                                </template>
                            </div>
                        </a>
                    </router-link>
                    <router-link :to="{ name: 'world' }" v-slot="{ href, route, navigate, isActive, isExactActive }">
                        <a :class="{'bg-blue-700': isExactActive, 'bg-blue-900': !isExactActive}" :href="href" @click="navigate" class="bg-blue-700 text-gray-200 rounded-lg btext-center shadow hover:-translate-y-px hover:shadow-md mr-4">
                            <div class="m-3">
                                <template v-if="isExactActive">
                                    Viendo datos Mundiales
                                </template>
                                <template v-else>
                                    Ver datos Mundiales
                                </template>
                                
                            </div>
                        </a>
                    </router-link>
                </div>
            </div>
            <!-- User -->
            <ul class="flex-col md:flex-row list-none items-center hidden md:flex">

                <div class="mx-2 text-white cursor-pointer" v-tooltip.left-start="'Comparte por WhatsApp'">
                    <a href="whatsapp://send?text=Visualiza%20en%20tiempo%20real%20los%20datos%20del%20Coronavirus%20(Covid19)%20en%20España%20https://covid19esp.herokuapp.com" target="_blank" class="flex flex-wrap">
                        <i class="fab fa-whatsapp"></i>
                    </a> 
                </div>

                <div class="mx-2 text-white cursor-pointer" v-tooltip.left-start="'Comparte por Facebook'">
                    <a href="https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fcovid19esp.herokuapp.com" target="_blank" class="flex flex-wrap">
                        <i class="fab fa-facebook-f"></i>
                    </a> 
                </div>

                <div class="mx-2 text-white cursor-pointer" v-tooltip.left-start="'Comparte por Twitter'">
                    <a href="https://twitter.com/intent/tweet?url=https%3A%2F%2Fcovid19esp.herokuapp.com&text=Coronavirus%20-%20Estad%C3%ADsticas%20en%20tiempo%20real%20en%20Espa%C3%B1ol&hashtags=Covid_19,Coronavirus,covid19ESP" target="_blank" class="flex flex-wrap">
                        <i class="fab fa-twitter"></i>
                    </a> 
                </div>

                <div class="mx-2 text-white cursor-pointer" v-tooltip.left-start="'Repositorio en Github'">
                    <a href="https://github.com/Krato/covid19ESP" target="_blank" class="flex flex-wrap">
                        <i class="fab fa-github"></i>
                    </a> 
                </div>

                <div class="mx-2 text-white cursor-pointer" v-tooltip.left-start="'Invítame a un café'">
                    <i class="fas fa-mug-hot text-lg"></i>
                </div>
                <info-component />
            </ul>
        </div>
    </nav>
</template>
<script>
import InfoComponent from './InfoComponent.vue'
import Logo from '@/components/svg/Logo.vue'

export default {
    components: {
        InfoComponent,
        Logo
    },
};
</script>
