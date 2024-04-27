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
}
</script>

<template>
    <Password v-if="iconf.inputType == 'password'" :inputProps="{'name':iconf.name}" :name="iconf.name" v-model="iconf.value" toggleMask v-bind="iconf.extraBind"
              @change="onChange" :class="iconf.errors && iconf.errors.length?'p-invalid':''"
              :promptLabel="translate('app.scegli-password')" :weakLabel="translate('app.password-semplice')"
              :mediumLabel="translate('app.password-media')" :strongLabel="translate('app.password-complessa')" />
    <InputText v-else class="w-full" :name="iconf.name" :type="iconf.inputType" v-model="iconf.value" v-bind="iconf.extraBind"
               @change="onChange" :class="iconf.errors && iconf.errors.length?'p-invalid':''"></InputText>
</template>

<style scoped>

</style>
