<script>
import CrudComponent from "../../CrudComponent.vue";
import {useModelWrapper} from "../../core/modelWrapper";
export default {
    name: "wBase",
    extends: CrudComponent,
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
    mounted() {
        if (this.iconf.mounted) {
            this.iconf.mounted.apply(this);
        }
    },
    methods : {
        onChange(event) {
            this.value = this.iconf.value;
            if (this.iconf.onChange) {
                this.iconf.onChange.apply(this,[event]);
            }
        },
        getValue() {
            return this.iconf.value;
        }
    },
    setup(props, { emit }) {
        return {
            iconf: useModelWrapper(props, emit),
        }
    },
}
</script>

<template>

</template>

<style scoped>

</style>
