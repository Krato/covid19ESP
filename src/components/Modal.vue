<template>
    <transition name="fade">
        <div
          v-if="showing"
          class="fixed inset-0 z-50 w-full h-screen flex items-center justify-center bg-smoke-800"
          @click.self="close"
            >
            <div class="flex flex-wrap w-full max-w-2xl shadow-lg bg-gray-800 rounded-lg">
                <div class="box-header-help text-sm">
                    <div class="px-1">
                        {{ title }}
                    </div>
                    <div class="flex self-end cursor-pointer float-right">
                        <div class="flex flex-wrap items-center bg-gray-700 rounded-lg ml-4 p-2" @click.prevent="close">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" class="fill-current" viewBox="0 0 24 24"><path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm6 16.538l-4.592-4.548 4.546-4.587-1.416-1.403-4.545 4.589-4.588-4.543-1.405 1.405 4.593 4.552-4.547 4.592 1.405 1.405 4.555-4.596 4.591 4.55 1.403-1.416z"/></svg>
                        </div>
                    </div>
                </div>
                <div class="relative max-h-500 w-full bg-gray-900 shadow-lg rounded-lg p-3 flex">
                    <div class="overflow-y-auto max-h-500 w-full">
                        <slot />
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
export default {
    name: 'Modal',
    props: {
        title: {
            required: false,
            type: String, 
            default: 'Ayuda |  Sobre el proyecto'
        },
        showing: {
            required: true,
            type: Boolean
        }
    },
    watch: {
        showing(value) {
            if (value) {
                return document.querySelector('body').classList.add('overflow-hidden');
            }
            document.querySelector('body').classList.remove('overflow-hidden');
        }
    },
    methods: {
        close() {
            this.$emit('close');
        }
    },
    mounted: function() {
        document.addEventListener("keydown", e => {
            if (e.keyCode == 27) {
                this.close();
            }
        });
    }
};
</script>

<style>
.fade-enter-active,
.fade-leave-active {
    transition: all 0.6s;
}
.fade-enter,
.fade-leave-to {
    opacity: 0;
}
</style>