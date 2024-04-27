
<script>

import vRecord from './vRecord.vue';
import ViewsWrapperConf from "../../confs/ViewsWrapperConf";
import {useModelWrapper} from "../../core/modelWrapper";
export default {
    name: "vView",
    extends: vRecord,
    setup(props, { emit }) {
        ViewsWrapperConf.setConf(props.conf);
        console.debug('vView ICONF',props.conf);
        return {
            iconf: useModelWrapper(props, emit),
        }
    },
}
</script>
