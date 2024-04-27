import { computed } from 'vue'
import ViewsWrapperConf from "../confs/ViewsWrapperConf";

export function useModelWrapper(props, emit) {
    return computed({
        get: () => {
            return props.conf;
            // ViewsWrapperConf.setConf(props.conf);
            // return {
            //     iconf: useModelWrapper(props, emit),
            // }
        },
        set: (value) => emit('update:conf', value)
    })
}
