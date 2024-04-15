<script>
import wBase from './wBase.vue'
import {useModelWrapper} from "../modelWrapper";
import WidgetsWrapperConf from "../../confs/WidgetsWrapperConf";
export default {
    name: "wRadio",
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
    <div class="w-full flex border-1 border-round-sm surface-border p-2"
         :class="iconf.direction=='row'?'flex-row':'flex-column'">
        <div class="field-radiobutton mr-2" v-for="(label,key) in iconf.domainValues" :key="key">
            <RadioButton :name="iconf.name" v-model="iconf.value" :value="key" v-bind="iconf.extraBind" @change="onChange"/>
            <label :for="key" v-html="label"></label>
        </div>
    </div>
</template>

<style scoped>

</style>
