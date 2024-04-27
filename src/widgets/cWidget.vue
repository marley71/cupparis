<template>
    <span>
        <component :is="conf.type" :conf="conf"></component>
        <div class="overflow-hidden">
            <span class="text-red-400" v-for="(error,index) in iconf.errors" :key="index">
               {{ error }} <span v-if="parseInt(index) < (Object.keys(iconf.errors).length-1)">,&nbsp;</span>
            </span>
        </div>
    </span>
</template>
<script>
import {useModelWrapper} from "../core/modelWrapper";
import CrudComponent from "../CrudComponent.vue";
import wHidden from "./components/wHidden.vue"
import wInput from "./components/wInput.vue"
import wSelect from './components/wSelect.vue'
import wSelectButton from './components/wSelectButton.vue'
import wAutocomplete from './components/wAutocomplete.vue'
import wCheckbox from './components/wCheckbox.vue'
import wRadio from './components/wRadio.vue'
import wText from './components/wText.vue'
import wBelongsto from './components/wBelongsto.vue'
import wCustom from './components/wCustom.vue'
import wColorPicker from './components/wColorPicker.vue'
import wDatePicker from './components/wDatePicker.vue'
import wDateRangePicker from './components/wDateRangePicker.vue'
import wDateText from './components/wDateText.vue'
import wTextarea from './components/wTextarea.vue'
import wMultiSelect from './components/wMultiSelect.vue'
import wSwap from './components/wSwap.vue'
import wSwapSelect from './components/wSwapSelect.vue'
import wStatus from './components/wStatus.vue'
import wTexthtml from './components/wTexthtml.vue'
import wUpload from './components/wUpload.vue'
import wUploadAjax from './components/wUploadAjax.vue'
import wChip from './components/wChip.vue'
import wPreview from './components/wPreview.vue'

export default {
    name : "cWidget",
    extends : CrudComponent,
    components : {
        wHidden,wInput,wSelect,wSelectButton,wAutocomplete,wCheckbox,wRadio,wText,
        wBelongsto,wCustom,wColorPicker,wDatePicker,wDateRangePicker,wDateText,
        wTextarea,wMultiSelect,wSwap,wSwapSelect,wStatus,wTexthtml,wUpload,wUploadAjax,
        wChip,wPreview
    },
    props : {
        conf : {
            type : Object,
            default() {
                return {
                    name : '',
                    value: null,
                    placeholder : '',
                    extraBind: {},
                    type : 'w-input',
                    label : '',
                    rules:'',
                    errors : [],
                }
            }
        }
    },
    setup(props, { emit }) {
        return {
            iconf: useModelWrapper(props, emit),
        }
    },
}
</script>



