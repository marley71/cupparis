<script>
import wBase from './wBase.vue'
import {useModelWrapper} from "../../core/modelWrapper";
import WidgetsWrapperConf from "../../confs/WidgetsWrapperConf";
export default {
    name: "wText",
    extends: wBase,
    setup(props, { emit }) {
        WidgetsWrapperConf.setConf(props.conf);
        // props.conf.tagContainer = 'span'
        // props.conf.textClass='noo'
        return {
            iconf: useModelWrapper(props, emit),
        }
    },
}
</script>

<template>
    <component :is="iconf.tagContainer" :class="iconf.textClass">{{ iconf.value }}</component>
</template>

<style scoped>

</style>
