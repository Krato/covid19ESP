<template>
    <div class="w-full bg-gray-900 text-gray-200" >
        <div class="relative flex flex-col min-w-0 break-words w-full shadow-lg rounded p-4">
            <div class="rounded-t mb-0 px-4 py-3 bg-transparent">
                <div class="flex flex-wrap items-center">
                    <div class="relative w-full max-w-full flex-grow flex-1">
                        <div class="flex flex-wrap">
                            <h2 class="text-white text-xl font-semibold">
                                Fuentes
                            </h2>
                        </div>
                    </div>
                    <div class="flex flex-wrap mt-2 md:mt-0 text-white text-xl self-start" v-on:click="close">
                        <i class="far fa-times-circle cursor-pointer"></i>
                    </div>
                </div>
            </div>
            <div class="p-4 flex-auto">
                <ul class="help-list overflow-y-auto h-64 lg:h-full">
                    <li>
                        Datadista: <a href="https://github.com/datadista/datasets/tree/master/COVID%2019" target="_blank">Enlace</a>
                    </li>
                    <li>
                        Ministerio de Sanidad, Consumo y Bienestar Social: <a href="https://www.mscbs.gob.es/profesionales/saludPublica/ccayes/alertasActual/nCov-China/situacionActual.htm" target="_blank">Enlace</a>
                    </li>
                    <li>
                        Departamento de Seguridad Nacional: <a href="https://www.dsn.gob.es/gl/current-affairs/press-room" target="_blank">Enlace</a>
                    </li>
                    <li>
                        Organización mundial de la salud (OMS): <a href="https://www.who.int/" target="_blank">Enlace</a>
                    </li>
                    <li>
                        DXY.cn. Pneumonia. 2020. <a href="http://3g.dxy.cn/newh5/view/pneumonia" target="_blank">Enlace</a>
                    </li>
                    <li>
                        BNO News: <a href="https://bnonews.com/index.php/2020/02/the-latest-coronavirus-cases/" target="_blank">Enlace</a>
                    </li>
                    <li>
                        Comision nacional de salud para la República de China (NHC): <a href="http://www.nhc.gov.cn/xcs/yqtb/list_gzbd.shtml" target="_blank">Enlace</a>
                    </li>
                    <li>
                        China CDC (CCDC): <a href="http://weekly.chinacdc.cn/news/TrackingtheEpidemic.htm" target="_blank">Enlace</a>
                    </li>
                    <li>
                        Departamento de salud de Hong Kong: <a href="https://www.chp.gov.hk/en/features/102465.html" target="_blank">Enlace</a>
                    </li>
                    <li>
                        Gobierno de Macao: <a href="https://www.ssm.gov.mo/portal/" target="_blank">Enlace</a>
                    </li>
                    <li>
                        Taiwan CDC: <a href="https://sites.google.com/cdc.gov.tw/2019ncov/taiwan?authuser=0" target="_blank">Enlace</a>
                    </li>
                    <li>
                        US CDC: <a href="https://www.cdc.gov/coronavirus/2019-ncov/index.html" target="_blank">Enlace</a>
                    </li>
                    <li>
                        Gobierno de cada: <a href="https://www.canada.ca/en/public-health/services/diseases/coronavirus.html" target="_blank">Enlace</a>
                    </li>
                    <li>
                        Gobierno de Australia - Departmanto de salud: <a href="https://www.health.gov.au/news/coronavirus-update-at-a-glance" target="_blank">Enlace</a>
                    </li>
                    <li>
                        Centro europeo para la Prevención y el Control de enfermedades (ECDC): <a href="https://www.ecdc.europa.eu/en/geographical-distribution-2019-ncov-cases" target="_blank">Enlace</a>
                    </li>
                    <li>
                        Ministry of Health Singapore (MOH): <a href="https://www.moh.gov.sg/covid-19" target="_blank">Enlace</a>
                    </li>
                    <li>
                        Ministerio de salud de Italia: <a href="http://www.salute.gov.it/nuovocoronavirus" target="_blank">Enlace</a>
                    </li>
                </ul>
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