import lang from "./lang";
import ViewConfs from './views';
import ActionConfs from './actions';

const CrudVars = {
    lang : lang,
    env : {},
    modelConfs : {},
    viewDefaultConfs : {

    },
    // compatibilità vecchie conf
    viewTypeToViewConf : {
        'v-view' : 'view',
        'v-list' : 'list',
        'v-edit' : 'edit',
        'v-insert': 'insert',
        'v-list-edit' : 'listEdit',
    },
    useApi : 0,
    validationMessages : {
        messages: {
            required: '{field} is required',
        },
    },
    actionConfs: ActionConfs,
    viewConfs:ViewConfs
}
export default CrudVars;
