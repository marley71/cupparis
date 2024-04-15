import { computed } from 'vue'
import WidgetsWrapperConf from "../confs/WidgetsWrapperConf";

// export function useModelWrapper(props, emit, name = 'modelValue') {
//     return computed({
//         get: () => props[name],
//         set: (value) => emit(`update:${name}`, value)
//     })
// }

export function useModelWrapper(props, emit) {
    return computed({
        get: () => {
            return props.conf;
            //let wc = new WidgetsWrapperConf();
            //return wc.loadConf(props.conf);
        },
        set: (value) => emit('update:conf', value)
    })
}
