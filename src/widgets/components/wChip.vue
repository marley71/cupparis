<script>
import wBase from './wBase.vue'
import {useModelWrapper} from "../../core/modelWrapper";
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
    methods : {
        add(event) {
            this.onChange(event);
        },
        remove(event) {
            this.onChange(event);
        },
    }
}
</script>

<template>
    <Chips v-model="iconf.value" @add="add" @remove="remove"/>
</template>

<style scoped>

</style>
