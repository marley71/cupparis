
import dBase from './dBase.vue'
import dConfirm from './dConfirm.vue'
import dError from './dError.vue'
import dMessage from './dMessage.vue'
import dWarning from './dWarning.vue'
import dCustom from './dCustom.vue'

export default {
    install(app) {
        app.component('d-base', dBase)
        app.component('d-confirm', dConfirm)
        app.component('d-error', dError)
        app.component('d-message', dMessage)
        app.component('d-warning', dWarning)
        app.component('d-custom', dCustom)
    },
    dBase, dConfirm, dError, dMessage, dWarning, dCustom,
}

