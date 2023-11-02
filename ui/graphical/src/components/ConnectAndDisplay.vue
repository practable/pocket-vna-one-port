
<template>
<div class='container-sm m-2 background-white border rounded'>

    <div v-if='getSessionExpired' class='col-12'>
        <img id='session-end-image' src='https://assets.practable.io/images/common/thank-you-screen.svg' alt='session ended'>
    </div>
    <div v-else class='row mb-4' id='overlay'>
      <div v-if='getConfigJSON != ""' class='col-6'>
          <img id='sparams-image' :src='getSParamImage.src' :alt='getSParamImage.alt'>
          <figcaption>{{ getSParamImage.figcaption }}</figcaption>
      </div>
      <div v-else class='col-6'>
          <img id='sparams-image' src='../assets/VNA.png' alt='getSParamImage.alt'>
          <figcaption>Temp image of ports</figcaption>
      </div>
      <div v-if='getConfigJSON != ""' class='col-4 '>
          <img id='dut-image' :src='getDUTImage.src' :alt='getDUTImage.alt'>
          <figcaption>{{ getDUTImage.figcaption }}</figcaption>
      </div>
      <div v-else class='col-4 '>
          <img id='dut-image' src='../assets/PocketVNA.png' alt='getDUTImage.alt'>
          <figcaption>Temp image of Pocket VNA</figcaption>
      </div>
    </div>

    <div v-if='getResultDB.length > 0' class='row mb-2'>
      <div class='input-group mb-2'>
            <div class='input-group-text '>
                <input class="form-check-input" type="radio" name="real-imag-radio-table" value='real-imag' id="real-imag-radio-table" v-model='output_mode'>
            </div>
            <input type='text' class="form-control" placeholder="Real/Imag" disabled>
        
            <div class="input-group-text">
                <input class="form-check-input" type="radio" name="dBRadio-table" value='dB-phase' id="dBRadio-table" v-model='output_mode'>
            </div>
            <input type='text' class="form-control" placeholder="dB/phase" disabled>
        </div>
    </div>
    

    <div v-if='getResponse.cmd == "sq"'>
      <div class='row'>
        <div class='input-group'>
          <span class='input-group-text'>Command</span>
          <span class='input-group-text text-primary bg-white'>{{getResponse.cmd}}</span>
        </div>
      </div>
      <div class='row'>
        <div class='input-group'>
          <span class='input-group-text'>Frequency[Hz]</span>
          <span class='input-group-text text-primary bg-white'>{{getResponse.freq/unit}}</span>
        </div>
      </div>
      <div class='row'>

      <div v-if='getResponse.sparam.S11' class='col-3'>
        <div class='input-group'>
          <span class='input-group-text'>S11</span>
          <div v-if='output_mode == "real-imag"'>
            <span class='input-group-text'>Real</span>
            <span class='input-group-text text-primary bg-white'> {{getResponse.result.s11.Real.toPrecision(3)}} </span>
            <span class='input-group-text'>Imag</span>
            <span class='input-group-text text-primary bg-white'> {{getResponse.result.s11.Imag.toPrecision(3)}} </span>
          </div>
          <div v-else>
            <span class='input-group-text'>dB</span>
            <span class='input-group-text text-primary bg-white'> {{getResultDB[0].s11.dB.toPrecision(3)}} </span>
            <span class='input-group-text'>phase[deg]</span>
            <span class='input-group-text text-primary bg-white'> {{getResultDB[0].s11.phase.toFixed(0)}} </span>
            <span class='input-group-text'>unwrapped phase[deg]</span>
            <span class='input-group-text text-primary bg-white'> {{getResultDB[0].s11.phase_unwrapped.toFixed(0)}} </span>
          </div>

        </div>
      </div>

      <div v-if='getResponse.sparam.S12' class='col-3'>
        <div class='input-group'>
          <span class='input-group-text'>S12</span>
          <div v-if='output_mode == "real-imag"'>
            <span class='input-group-text'>Real</span>
            <span class='input-group-text text-primary bg-white'> {{getResponse.result.s12.Real.toPrecision(3)}} </span>
            <span class='input-group-text'>Imag</span>
            <span class='input-group-text text-primary bg-white'> {{getResponse.result.s12.Imag.toPrecision(3)}} </span>
          </div>
          <div v-else>
            <span class='input-group-text'>dB</span>
            <span class='input-group-text text-primary bg-white'> {{getResultDB[0].s12.dB.toPrecision(3)}} </span>
            <span class='input-group-text'>phase[deg]</span>
            <span class='input-group-text text-primary bg-white'> {{getResultDB[0].s12.phase.toFixed(0)}} </span>
            <span class='input-group-text'>unwrapped phase[deg]</span>
            <span class='input-group-text text-primary bg-white'> {{getResultDB[0].s12.phase_unwrapped.toFixed(0)}} </span>
          </div>
        </div>
      </div>

      <div v-if='getResponse.sparam.S21' class='col-3'>
        <div class='input-group'>
          <span class='input-group-text'>S21</span>
          <div v-if='output_mode == "real-imag"'>
            <span class='input-group-text'>Real</span>
            <span class='input-group-text text-primary bg-white'> {{getResponse.result.s21.Real.toPrecision(3)}} </span>
            <span class='input-group-text'>Imag</span>
            <span class='input-group-text text-primary bg-white'> {{getResponse.result.s21.Imag.toPrecision(3)}} </span>
          </div>
          <div v-else>
            <span class='input-group-text'>dB</span>
            <span class='input-group-text text-primary bg-white'> {{getResultDB[0].s21.dB.toPrecision(3)}} </span>
            <span class='input-group-text'>phase[deg]</span>
            <span class='input-group-text text-primary bg-white'> {{getResultDB[0].s21.phase.toFixed(0)}} </span>
            <span class='input-group-text'>unwrapped phase[deg]</span>
            <span class='input-group-text text-primary bg-white'> {{getResultDB[0].s21.phase_unwrapped.toFixed(0)}} </span>
          </div>
        </div>
      </div>

      <div v-if='getResponse.sparam.S22' class='col-3'>
        <div class='input-group'>
          <span class='input-group-text'>S22</span>
          <div v-if='output_mode == "real-imag"'>
            <span class='input-group-text'>Real</span>
            <span class='input-group-text text-primary bg-white'> {{getResponse.result.s22.Real.toPrecision(3)}} </span>
            <span class='input-group-text'>Imag</span>
            <span class='input-group-text text-primary bg-white'> {{getResponse.result.s22.Imag.toPrecision(3)}} </span>
          </div>
          <div v-else>
            <span class='input-group-text'>dB</span>
            <span class='input-group-text text-primary bg-white'> {{getResultDB[0].s22.dB.toPrecision(3)}} </span>
            <span class='input-group-text'>phase[deg]</span>
            <span class='input-group-text text-primary bg-white'> {{getResultDB[0].s22.phase.toFixed(0)}} </span>
            <span class='input-group-text'>unwrapped phase[deg]</span>
            <span class='input-group-text text-primary bg-white'> {{getResultDB[0].s22.phase_unwrapped.toFixed(0)}} </span>
          </div>
        </div>
      </div>
      </div>
    </div>

    <div v-else-if='getResponse.cmd == "rq" || getResponse.cmd == "crq"' class='table' @mousedown="setDraggable(false)" @mouseup="setDraggable(true)">

      <table v-if='output_mode == "real-imag"' class="table border border-primary text-center">
        <thead style="position: sticky; top: 0; background-color: #ccc">
          <tr>
            <th key="freq" scope="col">Frequency[MHz]</th>
              <th v-if='getResponse.sparam.s11' key="s11r" scope="col">S11/Real</th>
              <th v-if='getResponse.sparam.s11' key="s11i" scope="col">S11/Imag</th>
              <th v-if='getResponse.sparam.s12' key="s12r" scope="col">S12/Real</th>
              <th v-if='getResponse.sparam.s12' key="s12i" scope="col">S12/Imag</th>
              <th v-if='getResponse.sparam.s21' key="s21r" scope="col">S21/Real</th>
              <th v-if='getResponse.sparam.s21' key="s21i" scope="col">S21/Imag</th>
              <th v-if='getResponse.sparam.s22' key="s22r" scope="col">S22/Real</th>
              <th v-if='getResponse.sparam.s22' key="s22i" scope="col">S22/Imag</th>
          </tr>
        </thead>
        <tr v-for="(row, index) in getResponse.result" :id="index" :key="index">
            <td>{{ (getFrequencies[index]/unit).toFixed(3)}}</td>
            <td v-if='getResponse.sparam.s11'>{{row.s11.real.toPrecision(3)}}</td>
            <td v-if='getResponse.sparam.s11'>{{row.s11.imag.toPrecision(3)}}</td>
            <td v-if='getResponse.sparam.s12'>{{row.s12.real.toPrecision(3)}}</td>
            <td v-if='getResponse.sparam.s12'>{{row.s12.imag.toPrecision(3)}}</td>
            <td v-if='getResponse.sparam.s21'>{{row.s21.real.toPrecision(3)}}</td>
            <td v-if='getResponse.sparam.s21'>{{row.s21.imag.toPrecision(3)}}</td>
            <td v-if='getResponse.sparam.s22'>{{row.s22.real.toPrecision(3)}}</td>
            <td v-if='getResponse.sparam.s22'>{{row.s22.imag.toPrecision(3)}}</td>
           
        </tr>
                            
    </table> 

    <table v-else class="table border border-primary text-center">
        <thead style="position: sticky; top: 0; background-color: #ccc">
          <tr>
            <th key="freq" scope="col">Frequency[MHz]</th>
              <th v-if='getResponse.sparam.s11' key="s11db" scope="col">S11/dB</th>
              <th v-if='getResponse.sparam.s11' key="s11p" scope="col">S11/phase[deg]</th>
              <th v-if='getResponse.sparam.s11' key="s11up" scope="col">S11/unwrapped phase[deg]</th>
              <th v-if='getResponse.sparam.s12' key="s12db" scope="col">S12/dB</th>
              <th v-if='getResponse.sparam.s12' key="s12p" scope="col">S12/phase[deg]</th>
              <th v-if='getResponse.sparam.s12' key="s12up" scope="col">S12/unwrapped phase[deg]</th>
              <th v-if='getResponse.sparam.s21' key="s21db" scope="col">S21/dB</th>
              <th v-if='getResponse.sparam.s21' key="s21p" scope="col">S21/phase[deg]</th>
              <th v-if='getResponse.sparam.s21' key="s21up" scope="col">S21/unwrapped phase[deg]</th>
              <th v-if='getResponse.sparam.s22' key="s22db" scope="col">S22/dB</th>
              <th v-if='getResponse.sparam.s22' key="s22p" scope="col">S22/phase[deg]</th>
              <th v-if='getResponse.sparam.s22' key="s22up" scope="col">S22/unwrapped phase[deg]</th>
          </tr>
        </thead>
        <tr v-for="(row, index) in getResultDB" :id="index" :key="index">
            <td>{{ (getFrequencies[index]/unit).toFixed(3)}}</td>
            <td v-if='getResponse.sparam.s11'>{{row.s11.dB.toPrecision(3)}}</td>
            <td v-if='getResponse.sparam.s11'>{{row.s11.phase.toFixed(0)}}</td>
            <td v-if='getResponse.sparam.s11'>{{row.s11.phase_unwrapped.toFixed(0)}}</td>
            <td v-if='getResponse.sparam.s12'>{{row.s12.dB.toPrecision(3)}}</td>
            <td v-if='getResponse.sparam.s12'>{{row.s12.phase.toFixed(0)}}</td>
            <td v-if='getResponse.sparam.s12'>{{row.s12.phase_unwrapped.toFixed(0)}}</td>
            <td v-if='getResponse.sparam.s21'>{{row.s21.dB.toPrecision(3)}}</td>
            <td v-if='getResponse.sparam.s21'>{{row.s21.phase.toFixed(0)}}</td>
            <td v-if='getResponse.sparam.s21'>{{row.s21.phase_unwrapped.toFixed(0)}}</td>
            <td v-if='getResponse.sparam.s22'>{{row.s22.dB.toPrecision(3)}}</td>
            <td v-if='getResponse.sparam.s22'>{{row.s22.phase.toFixed(0)}}</td>
            <td v-if='getResponse.sparam.s22'>{{row.s22.phase_unwrapped.toFixed(0)}}</td>
           
        </tr>
                            
    </table> 


    </div>

</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {

  name: 'ConnectAndDisplay',
  props:{
		url: String,
	},
  components: {
    
    
  },
  data () {
    return {
        output_mode: 'dB-phase',  //or real-imag
        
        previous_phase: null,
        unit: 1E6,    //frequency in MHz
    }
  },
  computed:{
      ...mapGetters([
      'getSessionExpired',
      'getResponse',
      'getFrequencies',
      'getResultDB',
      'getConfigJSON'
      
    ]),
    getDUTImage(){
      let config = this.getConfigJSON;
      if(config.images != undefined){
        let DUTimage = config.images.find(images => {
        return images.for === "dut"
      })
        return DUTimage;
      } 
      else {
        return '';
      }
    },
    getSParamImage(){
      let config = this.getConfigJSON;
      if(config.images != undefined){
        let SParamimage = config.images.find(images => {
        return images.for === "sparam"
      })
        return SParamimage;
      } 
      else {
        return '';
      }
    }
  },
  watch:{
    //   url(){
    //     if(this.url != '' && this.dataURLObtained){
    //       console.log('connecting');
    //       this.connect();
    //     }
        
		// },
    url(){
      if(this.url != ''){
        this.connect();
      }
      
    }
  },
  created(){
      
  },
  mounted(){
      

  },
  methods: {
    ...mapActions([
      'setDraggable'
    ]),
      connect(){
        let debug = false;
        let _this = this;
        this.dataSocket = new WebSocket(this.url);
        this.$store.dispatch('setDataSocket', this.dataSocket);
        
        this.dataSocket.onopen = () => {
            //console.log(this.$store.getters.getDataSocket);
            console.log('data connection opened');
            //this.$store.dispatch('setPortOpen');
        };

        this.dataSocket.onmessage = (event) => {
            try {
                let response = JSON.parse(event.data);     
                // console.log('message received');
                //console.log(response);
               if(response.cmd == 'hb'){
                 let heartbeat = new Event("websocket:hb");
                 //console.log('heartbeat');
                    document.dispatchEvent(heartbeat);
                   
               }
                else if(response.cmd == 'sq'){
                  this.previous_phase = null;
                    //response structure for single frequency request: {"id":"945102d5-94e4-448e-bbbf-48384c662711","t":1634664795,"cmd":"sq","freq":100000,"avg":1,"sparam":{"S11":true,"S12":false,"S21":true,"S22":false},"result":{"S11":{"Real":0.0001702234148979187,"Imag":0.0005754455924034119},"S12":{"Real":0,"Imag":0},"S21":{"Real":-0.00004191696643829346,"Imag":-0.00012067705392837524},"S22":{"Real":0,"Imag":0}}}
                    _this.$store.dispatch('setResponse', response);
                    _this.$store.dispatch('setShowRequestModal', false);
                  
                } 
                else if(response.cmd == 'rq'){
                  this.previous_phase = null;
                  console.log('response received');
                  console.log(response);
                  //for range request: {"id":"","t":0,"cmd":"rq","range":{"Start":100000,"End":4000000},"size":2,"isLog":true,"avg":1,"sparam":{"S11":true,"S12":false,"S21":true,"S22":false},"result":[{"S11":{"Real":0.00013846158981323242,"Imag":0.00027057528495788574},"S12":{"Real":0,"Imag":0},"S21":{"Real":-0.000031754374504089355,"Imag":-0.0002350062131881714},"S22":{"Real":0,"Imag":0}},{"S11":{"Real":0.00470772385597229,"Imag":0.003948085010051727},"S12":{"Real":0,"Imag":0},"S21":{"Real":0.000017777085304260254,"Imag":-0.000005081295967102051},"S22":{"Real":0,"Imag":0}}]}
                  _this.$store.dispatch('setResponse', response);
                  _this.$store.dispatch('setShowRequestModal', false);
                  
                } 
                else if(response.cmd == 'rc'){
                  this.previous_phase = null;
                  console.log(response);
                  _this.$store.dispatch('setCalibrated', true);
                  _this.$store.dispatch('setShowCalibrationModal', false);
                } 
                else if(response.cmd == 'crq'){
                  this.previous_phase = null;
                  console.log(response);
                  _this.$store.dispatch('setResponse', response);
                  _this.$store.dispatch('setShowRequestModal', false);
                  //_this.$store.dispatch('setCalibrated', false);
                } 
                else {
                  this.previous_phase = null;
                  console.log('response command not recognised');
                  console.log(response);
                }
            
                
            } catch (e) {
                if(debug){
                    console.log(e)
                }
                
            }
        }
		
		},
    
      
  }
}
</script>

<style scoped>
img{
    max-width: 100%;
    max-height: auto;
}

.table{
    overflow: scroll;
    max-height: 500px;
}

</style>
