const viewConfs = {
    recordLayouts : {
        default : {
            cols : 2, // puo' essere 1,2,3,4,6,12
            labelPosition : 'top',  // puo' essere top,bottom,none
        },
        search : {
            cols : 2, // puo' essere 1,2,3,4,6,12
            labelPosition : 'top',  // puo' essere top,bottom,none
        },
        record : {
            cols : 2, // puo' essere 1,2,3,4,6,12
            labelPosition : 'top',  // puo' essere top,bottom,none
        }
    },
    defaultView : {
        name : '',
        value: null,
        fields: null,
        type: 'v-base',
        extraBind: {},
        title:'',
        headerHelp:'',
        orderFields:{},
        paginator:true,
        rows : 20,
        loaded : false,
        route : null,
        routeName : null,
        defaultWidgetType : 'w-text',
        fieldsConfig:{},
        actionsConfig: {},
        metadata:{},
        pagination:{},
        selectionMode: null,
        autoload : true,
        blocked : false,
        modelName : null,
    },
    listView : {
        name : '',
        value: null,
        fields: null,
        type: 'v-base',
        extraBind: {},
        layout : 'default',
        title:'',
        headerHelp:'',
        orderFields:{},
        paginator:true,
        paginatorPosition:'both',
        rows : 20,
        loaded : false,
        route : null,
        routeName : null,
        defaultWidgetType : 'w-text',
        fieldsConfig:{},
        actionsConfig: {},
        metadata:{},
        pagination:{},
        selectionMode: 'multiple',
        autoload : true,
        recordActionsPosition: 'end',
        actionsLayout : 'simple',
        actionsLayoutTitle :  '',
        actionRecordLayout : 'simple',
        actionRecordLayoutTitle : '',
        blocked : false,
        modelName : null,
        hiddenColumns : [],
    },
    recordView : {
        name : '',
        value: null,
        fields: null,
        type: 'v-base',
        extraBind: {},
        title:'',
        headerHelp:'',
        loaded : false,
        route : null,
        routeName : null,
        defaultWidgetType : 'w-input',
        fieldsConfig:{},
        actionsConfig: {},
        metadata:{},
        autoload : true,
        actionDivider: false,
        blocked : false,
        modelName : null,
    }
}

export default viewConfs;
