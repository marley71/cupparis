<script>
import wBase from './wBase.vue'
import {useModelWrapper} from "../modelWrapper";
import WidgetsWrapperConf from "../../confs/WidgetsWrapperConf";
export default {
    name: "wInput",
    extends: wBase,
    setup(props, { emit }) {
        WidgetsWrapperConf.setConf(props.conf);
        return {
            iconf: useModelWrapper(props, emit),
        }
    },
}
</script>

<template>
    <div class="mt-3" v-if="iconf.value">
        <template
            v-if="['application/vnd.ms-excel','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'].indexOf(iconf.value.mimetype) >= 0">
            <i class="fa fa-file-excel fa-2xl"></i>
        </template>
        <template v-else-if="['application/pdf'].indexOf(iconf.value.mimetype) >= 0">
            <i class="fa fa-file-pdf fa-2xl"></i>
        </template>
        <template v-else-if="['image/jpeg'].indexOf(iconf.value.mimetype) >= 0">
            <img :src="getRealUrl(iconf.value.url)" :height="iconf.height"/>
        </template>
        <template v-else>
            <i class="fa fa-file fa-2xl"></i>
        </template>
    </div>
</template>

<style scoped>

</style>
