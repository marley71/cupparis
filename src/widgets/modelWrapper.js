import { computed } from 'vue'
// export function useModelWrapper(props, emit, name = 'modelValue') {
//     return computed({
//         get: () => props[name],
//         set: (value) => emit(`update:${name}`, value)
//     })
// }

export function useModelWrapper(props, emit) {
    return computed({
        get: () => props.conf,
        set: (value) => emit('update:conf', value)
    })
}
