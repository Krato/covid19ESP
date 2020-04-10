<template>
    <div>
        <a class="text-gray-600 block ml-2" href="#pablo" ref="btnDropdownRef" v-on:click="toggleDropdown($event)">
            <div class="items-center flex text-white">
                <i class="fas fa-question-circle text-lg">
                </i>
            </div>
        </a>
        <div class="bg-gray-900 text-white text-base z-50 float-left py-2 list-none text-left rounded shadow-lg mt-1"
            ref="popoverDropdownRef" style="min-width: 12rem" v-bind:class="{
                hidden: !dropdownPopoverShow,
                block: dropdownPopoverShow
            }">
            <a class="text-sm py-2 px-4 border-b border-gray-700 font-normal block w-full whitespace-no-wrap bg-transparent text-gray-200 cursor-pointer" v-on:click="modalAboutUs">
                Quienes somos
            </a>
            <a class="text-sm py-2 px-4 font-normal block w-full whitespace-no-wrap bg-transparent text-gray-200 cursor-pointer" v-on:click="modalSources">
                Fuentes
            </a>
        </div>

        <modal name="about-us" :width="400" height="auto">
            <about-us v-on:close="closeAboutUs" />
        </modal>

        <modal name="sources" :width="'40%'" height="auto">
            <sources v-on:close="closeSources" />
        </modal>
    </div>
</template>
<script>
import Popper from 'popper.js';
import AboutUs from './AboutUs'
import Sources from './Sources'

export default {
    components: {
        AboutUs,
        Sources
    },
    
    data: () => ({
        dropdownPopoverShow: false,
    }),

    methods: {
        toggleDropdown(event) {
            event.preventDefault();
            if (this.dropdownPopoverShow) {
                this.dropdownPopoverShow = false;
            } else {
                this.dropdownPopoverShow = true;
                new Popper(this.$refs.btnDropdownRef, this.$refs.popoverDropdownRef, {
                    placement: 'bottom-end',
                });
            }
        },

        modalAboutUs() {
            this.dropdownPopoverShow = false
            this.$modal.show('about-us')
        },

        closeAboutUs() {
            this.$modal.hide('about-us')
        },

        modalSources() {
            this.dropdownPopoverShow = false
            this.$modal.show('sources')
        },

        closeSources() {
            this.$modal.hide('sources')
        },
    },
};
</script>
