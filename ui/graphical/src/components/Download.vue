//Vue3 update

<template>
<div class='container-fluid row m-2 background-white border rounded'>

    <div class='col-md-8'>
        <div class='input-group mb-2'>
            <div class='input-group-text '>
                <input class="form-check-input form-check-inline" type="radio" name="real-imag-radio" value='real-imag' id="real-imag-radio" v-model='output_mode'>
                <!-- <input type='text' class="input-disabled" placeholder="Real/Imag"> -->
                <label class='txt-primary txt-sm me-2'>Real/Imag</label>
            </div>
            
        
            <div class="input-group-text">
                <input class="form-check-input form-check-inline" type="radio" name="dBRadio" value='dB-phase' id="dBRadio" v-model='output_mode'>
                <!-- <input type='text' class="input-disabled" placeholder="dB/phase"> -->
                <label class='txt-primary txt-sm me-2'>dB/phase</label>
            </div>
            
        </div>

        <div class='input-group mb-2'>
            <div class='input-group-text'>
                <input class="form-check-input form-check-inline" type="radio" name="csvRadio" value='csv' id="csvRadio" v-model='output_type'>
                <!-- <input type='text' class="input-disabled" placeholder=".csv"> -->
                <label class='txt-primary txt-sm me-2'>.csv</label>
            </div>
            
        
            <div class="input-group-text">
                <input class="form-check-input form-check-inline" type="radio" name="s2pRadio" value='s2p' id="s2pRadio" v-model='output_type' >
                <!-- <input type='text' class="input-disabled" :placeholder="sparams.length == 1 ? 's1p':'s2p'"> -->
                <label class='txt-primary txt-sm me-2'>{{ sparams.length == 1 ? 's1p':'s2p' }}</label>
            </div>
            
        </div>
    
    </div>

    <div class='d-flex col-md-4 p-1'>
    
        <button type='button' class="button-sm button-success" id="outputButton" @click="download" :disabled='getResultDB.length == 0'>Download</button>
    
    </div>
    
</div>
</template>

<script>

import { mapGetters } from 'vuex';

export default {

  name: 'Download',
  props: ['sparams'],
  data () {
    return {
        output_type: 'csv',     //'s2p'
        output_mode: 'dB-phase',  //or real-imag
    }
  },
  components: {
    
  },
  computed:{
      ...mapGetters([
          'getResponse',
          'getResultDB',
          'getFrequencies'
      ])
  },
  watch:{
      
  },
  created(){
      
  },
  mounted(){
      

  },
  methods: {
      download(){
      if(this.output_type == 'csv'){
        this.outputToCSV();
      } else{
        this.outputToS2P();
      }
    },
    outputToS2P(){
        let date = new Date();
        let filename = '';
        filename = date.getDate().toString() + (date.getMonth() + 1).toString() + date.getFullYear().toString();
        
        let s2p = '';
        s2p = '!Date: ' + date.getDate().toString() + '/' + (date.getMonth() + 1).toString() + '/' + date.getFullYear().toString() + '\n';
        

        if(this.sparams.length == 1 && this.sparams.includes('s11')){
            s2p += '!S1P File: Measurement: s11\n';
        } else{
            s2p += '!S2P File: Measurement: s11,s12,s21,s22\n';
        }     
        
        let _this = this;

        if(_this.output_mode == 'real-imag'){
            if(_this.sparams.length == 1 && _this.sparams.includes('s11')){
                s2p += '!Frequency[Hz] Real(S11) Imag(S11)\n';
            } else{
                s2p += '!Frequency[Hz] Real(S11) Imag(S11) Real(S21) Imag(S21) Real(S12) Imag(S12) Real(S22) Imag(S22)\n';
            }  
          
          
          s2p += '# Hz S RI R 50 \n';

          _this.getResponse.result.forEach(function(d, index){
            s2p += _this.getFrequencies[index];
            if(_this.sparams.length == 1 && _this.sparams.includes('s11')){
                s2p += " ";
                s2p += d.s11.real.toString();
                s2p += " ";
                s2p += d.s11.imag.toString();
            } else{
                s2p += " ";
                s2p += d.s11.real.toString();
                s2p += " ";
                s2p += d.s11.imag.toString();
                s2p += ' ';
                s2p += d.s21.real.toString();
                s2p += " ";
                s2p += d.s21.imag.toString();
                s2p += ' ';
                s2p += d.s12.real.toString();
                s2p += " ";
                s2p += d.s12.imag.toString();
                s2p += ' ';
                s2p += d.s22.real.toString();
                s2p += " ";
                s2p += d.s22.imag.toString();
            }  
    
            s2p += "\n";

          });
        } 
        else
        {
          

            if(_this.sparams.length == 1 && _this.sparams.includes('s11')){
                s2p += '!Frequency[Hz] dB(S11) phase[deg](S11)\n';
            } else{
                s2p += '!Frequency[Hz] dB(S11) phase[deg](S11) dB(S21) phase[deg](S21) dB(S12) phase[deg](S12) dB(S22) phase[deg](S22)\n';
            }  

          s2p += '# Hz S DB R 50 \n';

          _this.getResultDB.forEach(function(d, index){
            s2p += _this.getFrequencies[index];

            if(_this.sparams.length == 1 && _this.sparams.includes('s11')){
                s2p += " ";
                s2p += d.s11.dB.toString();
                s2p += " ";
                s2p += d.s11.phase.toString();
            } else{
                s2p += " ";
                s2p += d.s11.dB.toString();
                s2p += " ";
                s2p += d.s11.phase.toString();
                s2p += ' ';
                s2p += d.s21.dB.toString();
                s2p += " ";
                s2p += d.s21.phase.toString();
                s2p += ' ';
                s2p += d.s12.dB.toString();
                s2p += " ";
                s2p += d.s12.phase.toString();
                s2p += ' ';
                s2p += d.s22.dB.toString();
                s2p += " ";
                s2p += d.s22.phase.toString();
            }

            s2p += "\n";
          });
        }
      
      if(_this.sparams.length == 1 && _this.sparams.includes('s11')){
          filename += '.s1p';
      } else{
          filename += '.s2p';
      }
        
      
      let hiddenElement = document.createElement('a');
      hiddenElement.href = 'data:application/octet-stream;charset=utf-8,' + encodeURIComponent(s2p);
      hiddenElement.target = '_blank';
      hiddenElement.download = filename;
      hiddenElement.click();
    },
    outputToCSV(){
          let csv = '';
          let filename = '';
            let date = new Date();
            filename = date.getDate().toString() + (date.getMonth() + 1).toString() + date.getFullYear().toString();
              
            
            let _this = this;

            if(_this.output_mode == 'real-imag'){
              csv = 'Frequency[Hz]';
              if(_this.sparams.includes('s11')){
                  csv += ',S11/Real,S11/Imag';
              }
              if(_this.sparams.includes('s12')){
                  csv += ',S12/Real,S12/Imag';
              }
              if(_this.sparams.includes('s21')){
                  csv += ',S21/Real,S21/Imag';
              }
              if(_this.sparams.includes('s22')){
                  csv += ',S22/Real,S22/Imag';
              }

              csv += '\n';

              _this.getResponse.result.forEach(function(d, index){
                csv += _this.getFrequencies[index];
                
                if(_this.sparams.includes('s11')){
                    csv += ",";
                    csv += d.s11.real.toString();
                    csv += ",";
                    csv += d.s11.imag.toString();
                }

                if(_this.sparams.includes('s12')){
                    csv += ',';
                    csv += d.s12.real.toString();
                    csv += ",";
                    csv += d.s12.imag.toString();
                }

                if(_this.sparams.includes('s21')){
                    csv += ',';
                    csv += d.s21.real.toString();
                    csv += ",";
                    csv += d.s21.imag.toString();
                }

                if(_this.sparams.includes('s22')){
                    csv += ',';
                    csv += d.s22.real.toString();
                    csv += ",";
                    csv += d.s22.imag.toString();
                }
      
                csv += "\n";

              });
            } else{

                csv = 'Frequency[Hz]';
              if(_this.sparams.includes('s11')){
                  csv += ',S11/dB,S11/phase[deg],S11/unwrapped_phase[deg]';
              }
              if(_this.sparams.includes('s12')){
                  csv += ',S12/dB,S12/phase[deg],S12/unwrapped_phase[deg]';
              }
              if(_this.sparams.includes('s21')){
                  csv += ',S21/dB,S21/phase[deg],S21/unwrapped_phase[deg]';
              }
              if(_this.sparams.includes('s22')){
                  csv += ',S22/dB,S22/phase[deg], S22/unwrapped_phase[deg]';
              }

              csv += '\n';


              _this.getResultDB.forEach(function(d, index){
                csv += _this.getFrequencies[index];

                if(_this.sparams.includes('s11')){
                    csv += ",";
                    csv += d.s11.dB.toString();
                    csv += ",";
                    csv += d.s11.phase.toString();
                    csv += ",";
                    csv += d.s11.phase_unwrapped.toString();
                }

                if(_this.sparams.includes('s12')){
                    csv += ',';
                    csv += d.s12.dB.toString();
                    csv += ",";
                    csv += d.s12.phase.toString();
                    csv += ",";
                    csv += d.s12.phase_unwrapped.toString();
                }

                if(_this.sparams.includes('s21')){
                    csv += ',';
                    csv += d.s21.dB.toString();
                    csv += ",";
                    csv += d.s21.phase.toString();
                    csv += ",";
                    csv += d.s21.phase_unwrapped.toString();
                }

                if(_this.sparams.includes('s22')){
                    csv += ',';
                    csv += d.s22.dB.toString();
                    csv += ",";
                    csv += d.s22.phase.toString();
                    csv += ",";
                    csv += d.s22.phase_unwrapped.toString();
                }

                csv += "\n";

              });
            }
          
            filename += '.csv';
         
          let hiddenElement = document.createElement('a');
          hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
          hiddenElement.target = '_blank';
          hiddenElement.download = filename;
          hiddenElement.click();
      },
      
  }
}
</script>

<style scoped>


</style>