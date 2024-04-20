<template>
    <component :is="conf.type" :conf="conf"></component>
</template>
<script>
import { useModelWrapper } from './modelWrapper'
import CrudComponent from "../CrudComponent.vue";
import vList from "./components/vList.vue"

export default {
    name : "cView",
    extends : CrudComponent,
    components : {
        vList
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
    setup(props, { emit }) {
        return {
            iconf: useModelWrapper(props, emit),
        }
    },
}
</script>



