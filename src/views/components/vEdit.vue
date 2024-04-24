
<script>

import vRecord from './vRecord.vue';
import ViewsWrapperConf from "../../confs/ViewsWrapperConf";
import {useModelWrapper} from "../modelWrapper";

export default {
    name: "vRecord",
    extends: vRecord,
    setup(props, { emit }) {
        ViewsWrapperConf.setConf(props.conf);
        console.debug('vEdit ICONF',props.conf);
        return {
            iconf: useModelWrapper(props, emit),
        }
    },
}
</script>
