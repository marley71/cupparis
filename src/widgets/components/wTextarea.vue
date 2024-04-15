<script>
import wBase from './wBase.vue'
import {useModelWrapper} from "../modelWrapper";
import WidgetsWrapperConf from "../../confs/WidgetsWrapperConf";
export default {
    name: "wTextArea",
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
    <Textarea v-model="iconf.value" :name="iconf.name" @change="onChange" class="w-full"
              :placeholder="iconf.placeholder"></Textarea>
</template>

<style scoped>

</style>
