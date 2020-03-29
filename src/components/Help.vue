<template>
    <div>
        <div class="fixed bottom-0 right-0 mb-4 flex flex-wrap text-white text-xs font-extrabold z-50 mr-4">
            <div class="flex flex-wrap items-center bg-gray-700 rounded-lg ml-4 p-2">
                <a v-on:click="showHelp" class="flex flex-wrap items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="fill-current" width="16" height="16" viewBox="0 0 24 24"><path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm1.25 17c0 .69-.559 1.25-1.25 1.25-.689 0-1.25-.56-1.25-1.25s.561-1.25 1.25-1.25c.691 0 1.25.56 1.25 1.25zm1.393-9.998c-.608-.616-1.515-.955-2.551-.955-2.18 0-3.59 1.55-3.59 3.95h2.011c0-1.486.829-2.013 1.538-2.013.634 0 1.307.421 1.364 1.226.062.847-.39 1.277-.962 1.821-1.412 1.343-1.438 1.993-1.432 3.468h2.005c-.013-.664.03-1.203.935-2.178.677-.73 1.519-1.638 1.536-3.022.011-.924-.284-1.719-.854-2.297z"/></svg>
                </a>
            </div>
        </div>

        <modal :showing="showModal" @close="showModal = false" ref="ayuda" class="text-xs md:text-sm">
            <p class="pr-3">
                Desarrollado por <a href="https://github.com/Krato/covid19ESP">Eric Lagarda</a>. 
            </p>
            <p class="my-4">
                <a href="https://jsonbin.io/">
                    Powered by JSONBin.io
                </a>
            </p>

            <p class="pr-3">
                <strong>Los datos aquí mostrados están sacados de la siguientes fuentes</strong>:<br><br>
            </p>

            <ul class="help-list">
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
        </modal>
    </div>
</template>

<script>

import Modal from './Modal'

export default {
    name: 'Help',
    components: {
        Modal
    },
    data() {
        return {
            showModal: false
        }
    }, 

    methods: {
        showHelp() {
            this.showModal =true
        }
    }
}

</script>