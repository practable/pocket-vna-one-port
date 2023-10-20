//Store for the data being received from the firmware as well as computed data properties


const dataStore = {
    state: () => ({
      response: {},     //the latest response from the pocketVNA
      result_dB: [],    //the latest response but converted to dB and phase
      frequency: [],    //calculated frequencies for all results in response
       history: [],        //multiple data runs, storing many responses
        previous_s11_phase: null,
        previous_s12_phase: null,
        previous_s21_phase: null,
        previous_s22_phase: null,
        
       }),
       mutations:{
         SET_RESPONSE(state, response){
            state.response = response;
         },
         ADD_HISTORY(state, data){
            state.history.push(data);
         },
         DELETE_HISTORY(state, dataId) {
          state.history.splice(dataId, 1);
        },
        CLEAR_HISTORY(state){
          state.history.length = 0;
          state.history = [];
        },
        CALCULATE_FREQUENCY(state, response){
          state.frequency = [];

          let islog = response.islog;
          let start = response.range.start;
          let end = response.range.end;
          let steps = response.size;

          response.result.forEach((result, index) => {
            let f;
            if(!islog){
              f = (start*1000 + ((end-start)*1000 / (steps - 1)) * index) / 1000;
            }
            else
            {
              f = (start * Math.pow(Number(end) / start, Number(index) / (steps - 1)))
            }

            state.frequency.push(f);

          });
        },
        GET_FREQUENCIES(state, response){
            state.frequency = [];
            response.result.forEach((r) => {
              state.frequency.push(r.freq);
            });
        },
        // SET_RESPONSE_DB(state, response){
        //   console.log('setting response db');
        //   state.result_dB = [];
        //   if(response.cmd == 'rq' || response.cmd == 'crq'){
        //     response.result.forEach((r) => {
        //       let s11_dB = helpers.calculatedB(r.s11);
        //       let s12_dB = helpers.calculatedB(r.s12);
        //       let s21_dB = helpers.calculatedB(r.s21);
        //       let s22_dB = helpers.calculatedB(r.s22);
              
        //       let result = {s11:s11_dB, s12:s12_dB, s21:s21_dB, s22:s22_dB}

        //       state.result_dB.push(result)
        //     })
        //   } 
        //   else{
        //     let r = response.result;
        //     let s11_dB = helpers.calculatedB(r.s11);
        //     let s12_dB = helpers.calculatedB(r.s12);
        //     let s21_dB = helpers.calculatedB(r.s21);
        //     let s22_dB = helpers.calculatedB(r.s22);
            
        //     let result = {s11:s11_dB, s12:s12_dB, s21:s21_dB, s22:s22_dB};

        //     state.result_dB.push(result);
        //   }
          
        // },
        SET_RESPONSE_DB(state, response){
          console.log('setting response db');
          state.result_dB = [];
          if(response.cmd == 'rq' || response.cmd == 'crq'){
            response.result.forEach((r) => {
              let s11_dB = helpers.calculatedB(r.s11, state.previous_s11_phase);
              state.previous_s11_phase = s11_dB.phase_unwrapped;
              let s12_dB = helpers.calculatedB(r.s12, state.previous_s12_phase);
              state.previous_s12_phase = s12_dB.phase_unwrapped;
              let s21_dB = helpers.calculatedB(r.s21, state.previous_s21_phase);
              state.previous_s21_phase = s21_dB.phase_unwrapped;
              let s22_dB = helpers.calculatedB(r.s22, state.previous_s22_phase);
              state.previous_s22_phase = s22_dB.phase_unwrapped;
              
              let result = {s11:s11_dB, s12:s12_dB, s21:s21_dB, s22:s22_dB}

              state.result_dB.push(result)
            })

            state.previous_s11_phase = null;
            state.previous_s12_phase = null;
            state.previous_s21_phase = null;
            state.previous_s22_phase = null;
          } 
          else{
            let r = response.result;
            let s11_dB = helpers.calculatedB(r.s11);
            let s12_dB = helpers.calculatedB(r.s12);
            let s21_dB = helpers.calculatedB(r.s21);
            let s22_dB = helpers.calculatedB(r.s22);
            
            let result = {s11:s11_dB, s12:s12_dB, s21:s21_dB, s22:s22_dB};

            state.result_dB.push(result);
          }
          
        },
        
       },
       actions:{
         setResponse(context, response){
            context.commit('SET_RESPONSE', response);
            context.commit('SET_RESPONSE_DB', response);
            context.commit('GET_FREQUENCIES', response);
         },
         addHistory(context, data){
            context.commit('ADD_HISTORY', data);
         },
         deleteHistory(context, id){
           context.commit('DELETE_HISTORY', id);
         },
         clearHistory(context){
           context.commit('CLEAR_HISTORY');
         }

       },
       getters:{
         getResponse(state){
            return state.response;
         },
         getResultDB(state){
            return state.result_dB;
         },
         getFrequencies(state){
           return state.frequency;
         },
         getHistory(state){
            return state.history;
          },
          getXResult(state){
            return state.frequency;
          },
          getYResult(state){
            return state.result_dB;
          },
          getNumData(state){
            return state.frequency.length;
          }
       },        

       
  }


  export const helpers = {
    calculatedB(s_param, previous_phase){
      let real = Number(s_param.real);
      let imag = Number(s_param.imag);
  
      let dB = 20*Math.log10(Math.sqrt(real*real + imag*imag));
      //phase requires different calculations based on the quadrant of the complex plane
      let phase = 0;
      if(real >= 0){
        phase = 360*Math.atan(imag/real)/(2*Math.PI);     //phase in degrees
      } 
      else if(real < 0 && imag >= 0){
        phase = 360*Math.atan(imag/real)/(2*Math.PI) + 180;     //phase in degrees
      }
      else if(real < 0 && imag < 0){
        phase = 360*Math.atan(imag/real)/(2*Math.PI) - 180;     //phase in degrees
      }
      else{
        phase = 0;
      }
  
      let unwrapped_phase = helpers.unwrapPhase(phase, previous_phase);
      
  
      return {dB: dB, phase: phase, phase_unwrapped: unwrapped_phase};
    },
    unwrapPhase(angle,  previous_angle){
      if(previous_angle != null && Math.abs(previous_angle - angle) > 180.0){
        let delta = 360.0;
        for(let i=1;i<100;i++){
          let angle_add = angle + delta*i;
          let angle_sub = angle - delta*i;
          if(Math.abs(previous_angle - angle_add) <= 180){
            return angle_add;
          } else if(Math.abs(previous_angle - angle_sub) <= 180){
            return angle_sub;
          } 
        }
        //if after 10 iterations it cannot unwrap then just return the original angle
        return angle;
    
      } else {
        //if phase difference isn't > 180 return original angle
        return angle;
      }
    }
  }

  export default dataStore;


