//Store for variables that are common amongst multiple UI components. 


const uiStore = {
    state: () => ({
        isDraggable: true,
        showCalibrationModal: false,
        showRequestModal: false,

        config_json: '',

       }),
       mutations:{
        SET_DRAGGABLE(state, draggable){
            state.isDraggable = draggable;
         },
         SET_SHOW_CALIBRATION_MODAL(state, set){
             state.showCalibrationModal = set;
         },
         SET_SHOW_REQUEST_MODAL(state, set){
            state.showRequestModal = set;
        },
        SET_CONFIG_JSON(state, json){
            state.config_json = json;
        }           

       },
       actions:{
        setDraggable(context, draggable){
            context.commit('SET_DRAGGABLE', draggable);
        },
        setShowCalibrationModal(context, set){
            context.commit('SET_SHOW_CALIBRATION_MODAL', set);
        },
        setShowRequestModal(context, set){
            context.commit('SET_SHOW_REQUEST_MODAL', set);
        },
        setConfigJSON(context, json){
            context.commit('SET_CONFIG_JSON', json);
        }


       },
       getters:{
        getDraggable(state){
            return state.isDraggable;
        },
        getShowCalibrationModal(state){
            return state.showCalibrationModal;
        },
        getShowRequestModal(state){
            return state.showRequestModal;
        },
        getConfigJSON(state){
            return state.config_json;
        }
          
         
       },  
  
  }

  export default uiStore;
