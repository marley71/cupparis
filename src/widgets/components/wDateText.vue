<script>
import wBase from './wBase.vue'
import {useModelWrapper} from "../modelWrapper";
import moment from 'moment'
import CrudCore from "../../core/CrudCore";
import WidgetsWrapperConf from "../../confs/WidgetsWrapperConf";
export default {
    name: "wDateText",
    extends: wBase,
    setup(props, { emit }) {
        WidgetsWrapperConf.setConf(props.conf);
        // props.conf.invalidDateString = CrudCore.translate('app.data-non-valida');
        return {
            iconf: useModelWrapper(props, emit),
        }
    },
    methods: {
        getFormattedValue() {
            let that = this;
            //return that.translate(that.invalidDateString)
            var md = moment(that.iconf.value);
            //console.log('displayFormat',that.displayFormat);
            if (md.isValid()) {
                return md.format(that.iconf.displayFormat)
            } else {
                return that.translate(that.iconf.invalidDateString);
            }
        }
    }
}
</script>

<template>
    <span>{{ getFormattedValue() }}</span>
</template>

<style scoped>

</style>
