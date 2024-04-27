<script>
import wBase from './wBase.vue'
import {useModelWrapper} from "../../core/modelWrapper";
import WidgetsWrapperConf from "../../confs/WidgetsWrapperConf";
export default {
    name: "wStatus",
    extends: wBase,
    setup(props, { emit }) {
        // let wc = new WidgetsWrapperConf();
        // props.conf = wc.loadConf(props.conf);
        WidgetsWrapperConf.setConf(props.conf);
        console.debug('wStatus Conf',props.conf);
        return {
            iconf: useModelWrapper(props, emit),
        }
    },
    methods: {
        executeFunc(funcName) {
            console.debug('funcName',funcName);
            this.iconf.domainValues[funcName].apply(this);
        }
    }
}
</script>

<template>
    <i v-if="iconf.statusType=='icon'" :class="iconf.currentValue"></i>
    <span  v-else-if="iconf.statusType=='action'" class="cursor-pointer" v-html="iconf.domainValuesHtml[iconf.value]" @click="executeFunc(iconf.value)" >
    </span>
    <span  v-else v-html="iconf.domainValuesHtml[iconf.value]"></span>
</template>

<style scoped>

</style>
