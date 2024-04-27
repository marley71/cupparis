<script>
import wBase from './wBase.vue'
import {useModelWrapper} from "../../core/modelWrapper";
export default {
    name: "wHidden",
    extends: wBase,
    setup(props, { emit }) {
        return {
            iconf: useModelWrapper(props, emit),
        }
    },
}
</script>

<style scoped>

</style>
