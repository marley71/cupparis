<script>
import wBase from './wBase.vue'
import {useModelWrapper} from "../../core/modelWrapper";
import WidgetsWrapperConf from "../../confs/WidgetsWrapperConf";
export default {
    name: "wColorPicker",
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
    <ColorPicker v-model="iconf.value" @change="onChange" v-bind="iconf.extraBind"/>
</template>

<style scoped>

</style>
