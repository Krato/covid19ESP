<template>
    <div id="app">
        <div class="relative bg-blue-800">
            <sidebar-component
                v-on:open-about="modalAboutUs"
                v-on:open-sources="modalSources"
            />
            <navbar-component></navbar-component>
            <!-- <div id="nav">
            <router-link to="/">Home</router-link> |
            <router-link to="/about">About</router-link>
            </div> -->
            <transition name="fade-in-up">
                <router-view/>
            </transition>
        </div>
        <modal name="about-us" :width="400" height="auto">
            <about-us v-on:close="closeAboutUs" />
        </modal>

        <modal name="sources" :width="'90%'" :maxWidth="800" height="auto" >
            <sources v-on:close="closeSources" />
        </modal>
    </div>
</template>
<script>
import NavbarComponent from './components/Navbar.vue';
import SidebarComponent from './components/Sidebar.vue';
import AboutUs from './components/AboutUs'
import Sources from './components/Sources'

export default {
    components: {
        NavbarComponent,
        SidebarComponent,
        AboutUs,
        Sources
    },

    data: () => ({
        dropdownPopoverShow: false,
    }),

    methods: {
        modalAboutUs() {
            this.$modal.show('about-us')
        },

        closeAboutUs() {
            this.$modal.hide('about-us')
        },

        modalSources() {
            this.$modal.show('sources')
        },

        closeSources() {
            this.$modal.hide('sources')
        },
    } 
};
</script>
