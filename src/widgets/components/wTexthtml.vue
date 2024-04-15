<script>
import wBase from './wBase.vue'
import {useModelWrapper} from "../modelWrapper";
import WidgetsWrapperConf from "../../confs/WidgetsWrapperConf";
export default {
    name: "wTexthtml",
    extends: wBase,
    setup(props, { emit }) {
        WidgetsWrapperConf.setConf(props.conf);
        return {
            iconf: useModelWrapper(props, emit),
        }
    },
    methods: {
        textChange(event) {
            this.onChange(event)
        }
    }
}
</script>

<template>
    <Editor v-model="iconf.value" editorStyle="height: 320px" @text-change="textChange">
        <template v-if="iconf.toolbar" #toolbar>
            <span class="ql-formats">
                <button v-for="(cssClass,index) in iconf.toolbar" :key="index" :class="iconf.cssClass"></button>
            </span>
        </template>
    </Editor>
</template>

<style scoped>

</style>
