//Store for sending commands through the dataSocket


const commandStore = {
    state: () => ({
        dataSocket: null,
        isCalibrated: false,     //set to false before deploying.
        isVerified: false,      //set to false before deploying

       }),
       mutations:{
        SET_DATA_SOCKET(state, socket){
            state.dataSocket = socket;
        },
        REQUEST_SINGLE(state, params){
            state.dataSocket.send(JSON.stringify({
                "id":params.id,
                "t":params.t,
                "cmd":"sq",
                "freq":params.freq,
                "avg":params.avg,
                "sparam":{"s11":params.sparam.s11,"s12":params.sparam.s12,"s21":params.sparam.s21,"s22":params.sparam.s22}
            }));
        },
        REQUEST_RANGE(state, params){
            state.dataSocket.send(JSON.stringify({
                "id":params.id,
                "t":params.t,
                "cmd":"rq",
                "range":{"start":params.range.start,"end":params.range.end},
                "size":params.size,
                "islog":params.islog,
                "avg":params.avg,
                "what": params.what,
                "sparam":{"s11":params.sparam.s11,"s12":params.sparam.s12,"s21":params.sparam.s21,"s22":params.sparam.s22}
            }));
        },
        REQUEST_CALIBRATION(state, params){
            console.log('calibration request sent');
            state.dataSocket.send(JSON.stringify({
                "id":params.id,
                "t":params.t,
                "cmd":"rc",
                "range":{"start":params.range.start,"end":params.range.end},
                "size":params.size,
                "islog":params.islog,
                "avg":params.avg,
                "sparam":{"s11":params.sparam.s11,"s12":params.sparam.s12,"s21":params.sparam.s21,"s22":params.sparam.s22}
            }));
        },
        REQUEST_RANGE_AFTER_CAL(state, params){
            
            if(state.isCalibrated){
                console.log('range request sent');
                state.dataSocket.send(JSON.stringify({
                    "cmd":"crq",
                    "avg":params.avg,
                    "what": params.what,
                    "sparam":{"S11":params.sparam.s11,"S12":params.sparam.s12,"S21":params.sparam.s21,"S22":params.sparam.s22}
                }));
            } else{
                console.log("Error: need to request calibration first");
            }
            
        },
        SET_CALIBRATED(state, set){
            state.isCalibrated = set;
        },
        SET_VERIFIED(state, set){
            state.isVerified = set;
        },
        SET_PORT_OPEN(state){
            state.dataSocket.send(JSON.stringify({
                "set":"port",
                "to":"open"
            }));
        }
            

       },
       actions:{
        setDataSocket(context, socket){
            context.commit("SET_DATA_SOCKET", socket);
        },
        requestSingle(context, params){
            context.commit('REQUEST_SINGLE', params);
        },
        requestRange(context, params){
            context.commit('REQUEST_RANGE', params);
        },
        requestCalibration(context, params){
            context.commit('REQUEST_CALIBRATION', params);
        },
        requestRangeAfterCal(context, params){
            context.commit('REQUEST_RANGE_AFTER_CAL', params);
        },
        setCalibrated(context, set){
            context.commit('SET_CALIBRATED', set);
        },
        setVerified(context, set){
            context.commit('SET_VERIFIED', set);
        },
        setPortOpen(context){
            context.commit('SET_PORT_OPEN');
        },
       },
       getters:{
        getDataSocket(state){
            return state.dataSocket;
        },
        getCalibrated(state){
            return state.isCalibrated;
        },
        getVerified(state){
            return state.isVerified;
        }
          
       },  
  
  }

  export default commandStore;