<script>
import wBase from './wBase.vue'
import {useModelWrapper} from "../modelWrapper";
import moment from 'moment'
import WidgetsWrapperConf from "../../confs/WidgetsWrapperConf";
export default {
    name: "wDatePicker",
    extends: wBase,
    setup(props, { emit }) {
        WidgetsWrapperConf.setConf(props.conf);
        // props.conf.inputDateFormat = 'YYYY-MM-DD';
        // props.conf.dateFormat = "dd/mm/yy";
        return {
            iconf: useModelWrapper(props, emit),
        }
    },
    methods: {
        clear(event) {
            this.iconf.value = null;
            this.iconf.dateValue = null;
            this.onChange(event);
        },
        dateSelect(event) {
            console.debug('dateSelect',event);
            let inputDateFormat = this.iconf.inputDateFormat; //   event.widget.inputDateFormat || 'YYYY-MM-DD';
            var date = event ? moment(event).format(inputDateFormat) : null;
            this.iconf.value = date;
            this.onChange(event);
        }
    }
}
</script>

<template>
    <div class="p-inputgroup">
        <Button icon="fa fa-times" @click="clear" v-if="iconf.buttonClear"/>
        <Calendar class="w-full" :showButtonBar="true" v-model="iconf.dateValue" @date-select="dateSelect"
                  :inputDateFormat="iconf.inputDateFormat" :date-format="iconf.dateFormat"
                  v-bind="iconf.extraBind"
                  @clear-click="clear"/>
    </div>
</template>

<style scoped>

</style>
