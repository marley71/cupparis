<script>
import wBase from './wBase.vue'
import {useModelWrapper} from "../../core/modelWrapper";
import WidgetsWrapperConf from "../../confs/WidgetsWrapperConf";
export default {
    name: "wUpload",
    extends: wBase,
    setup(props, { emit }) {
        // let wc = new WidgetsWrapperConf();
        // wc.loadConf(props.conf);
        WidgetsWrapperConf.setConf(props.conf);
        return {
            iconf: useModelWrapper(props, emit),
        }
    },
    methods:{
        uploadFile(event) {
            if (this.iconf.uploadFile) {
                this.iconf.uploadFile.apply(this,[event]);
                return;
            }
            this.iconf.files = event.files;
            console.log('uploadevent',event,this);
        },
        getValue() {
            return this.iconf.value;
        },
        getFileValue() {
            return this.iconf.files;
        }
    }
}
</script>

<template>
    <FileUpload mode="basic" :name="iconf.name" :auto="true" :customUpload="true" @uploader="uploadFile"
                :multiple="false" v-bind="iconf.extraBind"/>
</template>

<style scoped>

</style>
