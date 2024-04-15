<script>
import wBase from './wBase.vue'
import {useModelWrapper} from "../modelWrapper";
import WidgetsWrapperConf from "../../confs/WidgetsWrapperConf";
export default {
    name: "wBelongsto",
    extends: wBase,
    setup(props, { emit }) {
        //props.conf.separator = ' ';
        //props.conf.labelFields = ['label'];
        WidgetsWrapperConf.setConf(props.conf);
        return {
            iconf: useModelWrapper(props, emit),
        }
    },
}
</script>

<template>
    <div>
        <span v-for="(field,index) in iconf.labelFields" :key="index">
            <span v-if="(iconf.separator && (index !== 0))">{{ iconf.separator }}</span>{{ iconf.value[field] }}
        </span>
    </div>
</template>

<style scoped>

</style>
