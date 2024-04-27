import { computed } from 'vue'
export function useModelWrapper(props, emit) {
    return computed({
        get: () => {
            return props.conf;
        },
        set: (value) => emit('update:conf', value)
    })
}
