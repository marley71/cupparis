<template>
    <component :is="conf.type" :conf="conf"></component>
</template>
<script>
//import { useModelWrapper } from './modelWrapper'
import CrudComponent from "../CrudComponent.vue";
import vList from "./components/vList.vue"
import vRecord from './components/vRecord.vue'
import vView from './components/vView.vue'
import vEdit from './components/vEdit.vue'
import vListEdit from './components/vListEdit.vue'
import vInsert from './components/vInsert.vue'
export default {
    name : "cView",
    extends : CrudComponent,
    components : {
        vList,vRecord,vView,vEdit,vListEdit,vInsert
    },
    props : {
        conf : {
            type : Object,
            default() {
                return {
                }
            }
        }
    },
    // setup(props, { emit }) {
    //     return {
    //         iconf: useModelWrapper(props, emit),
    //     }
    // },
}
</script>



