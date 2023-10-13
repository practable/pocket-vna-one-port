//For the moment should just display the response data on a single request.



<template>
<div class='container-sm m-2 bg-white border rounded'>
    <div class="row m-0 justify-content-center" id="chart-canvas">
        <div class="col-12">
            <canvas id='graph-canvas'></canvas>
        </div>
    </div>

    <!-- <div class='d-flex row mb-1 align-items-center'>
        
    <span for='wrappedRadio' class="input-group-text col-3">Phase: </span>
        
      <div class='col-9'>
        <div class="form-check form-check-inline">
          <input class="form-check-input" type="radio" name="wrappedRadio" value='wrapped' id="wrappedRadio" v-model='plot_phase'>
          <label class="form-check-label" for="wrappedRadio">Wrapped</label>
        </div>
        <div class="form-check form-check-inline">
          <input class="form-check-input" type="radio" name="unwrappedRadio" value='unwrapped' id="unwrappedRadio" v-model='plot_phase'>
          <label class="form-check-label" for="unwrappedRadio">Unwrapped</label>
        </div>
      </div>
    </div> -->

    <div class='input-group m-2'>
        <span type='text' class="form-control">Phase</span>
            <div class='input-group-text '>
                
                <input class="form-check-input" type="radio" name="wrappedRadio" value='wrapped' id="wrappedRadio" v-model='plot_phase'>
            </div>
            <input type='text' class="form-control" placeholder="Wrap" disabled>
        
            <div class="input-group-text">
                <input class="form-check-input" type="radio" name="unwrappedRadio" value='unwrapped' id="unwrappedRadio" v-model='plot_phase'>
            </div>
            <input type='text' class="form-control" placeholder="Unwrap" disabled>
        </div>

    <!-- <toolbar parentCanvasID="graph-canvas" parentComponentName="graph" parentDivID="graph" :showDownload='true' :showPopupHelp="true" :showOptions="false">  
        
        <template v-slot:popup id='graph-popup'>
            <div class='row mb-2' id='gradient-div'>
                <div class='col-4'>
                    <img class='popup-image' src='../../public/images/gradient.png'>
                </div>
                <div class='col-8'>
                    <h3> Gradient tool </h3>
                    <p> Click and drag on the graph in order to draw a straight line segment. The gradient of this line is displayed in the Gradient box.</p>
                </div>
            </div>

            <div class='row mb-2' id='data-point-div'>
                <div class='col-4'>
                    <img class='popup-image' src='../../public/images/GraphDataPoint.png'>
                </div>
                <div class='col-8'>
                    <h3> Interactive data points </h3>
                    <p> Hover over a data point to get the exact values. Change the data plotted on each axis with the dropdown menus 'Y Axis' and 'X Axis'.
                    </p>
                </div>

            </div>

            <div class='row mb-2' id='functions-div'>
                <div class='col-4'>
                    <img class='popup-image' src='../../public/images/function-plotting.png'>
                </div>
                <div class='col-8'>
                    <h3> Function Plotting </h3>
                    <p> Select the function type from the dropdown menu. Input the corresponding function parameters. Angular parameters are in radians. Click plot to display the function.
                        The function is plotted up to the maximum value on the x-axis.
                    </p>
                </div>

            </div>
        </template>
    </toolbar> -->
</div>

</template>

<script>

import { Chart } from 'chart.js';
import { mapGetters } from 'vuex';
//import Toolbar from "./elements/Toolbar.vue";

export default {
    
    name: 'GraphOutput',
    props: ['sparams'],
    emits: [],
    components:{
        //Toolbar,
    },
    data(){
        return{
            chart: null,
            YAxisMax: 0,
            YAxisMin: 0,
            XAxisMax: 0,
            XAxisMin: 0,
            maxDataPoints: 5000,
            unit: 1E6,      //frequency in MHz
            plot_phase: 'wrapped', //'unwrapped'
            //previous_phase: null,
        }
    },
    mounted() {
        this.createChart();
        this.getAllData();

      },
    computed:{
        ...mapGetters([
            'getResponse',
            'getResultDB',
            'getXResult',
            'getYResult',
            'getNumData',
        ]),
      },
    watch:{
        getYResult(){
            this.updateChart();
        },
        plot_phase(){
            this.updateChart();
        }
    },
    methods: {
        updateChart(){
            let max_index = this.getNumData - 1;
            if(max_index < this.maxDataPoints){
                this.getAllData();
                this.chart.update();                       //actually updating the chart moved to here!
            } 
        },
        createChart() {
            let _this = this;
            const canvas = document.getElementById('graph-canvas');
            const ctx = canvas.getContext('2d');
            this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                datasets: _this.getDataSets()
            },
            options: {
                animation: false,
                parsing: false,
                legend:{
                    display: true
                },
                scales: {
                    xAxes: [{
                        scaleLabel:{
                            display: true,
                            labelString: 'Frequency[MHz]'
                        },
                        type: 'linear',
                        position: 'bottom',
                        // ticks: {
                        //     callback : (value,index,values) => {
                        //         _this.updateXAxisMax(value, index, values);
                        //         _this.updateXAxisMin(value, index);
                        //         return value;
                        //     },
                            
                        // },
                        minRotation: 20,
                        maxRotation: 20,
                        sampleSize: 2,
                    }],
                    yAxes: [{
                        id:'dB',
                        scaleLabel:{
                            display: true,
                            labelString: 'Mag[dB]'
                        },
                        type: 'linear',
                        position: 'left',
                        // ticks: {
                        //     callback : (value,index,values) => {
                        //         _this.updateYAxisMax(value, index);
                        //         _this.updateYAxisMin(value, index, values);
                        //         return value;
                        //     }
                        // },
                        sampleSize: 2,
                    },
                    {
                        id:'phase',
                        scaleLabel:{
                            display: true,
                            labelString: 'phase[deg]'
                        },
                        type: 'linear',
                        position: 'right',
                        // ticks: {
                        //     callback : (value,index,values) => {
                        //         _this.updateYAxisMax(value, index);
                        //         _this.updateYAxisMin(value, index, values);
                        //         return value;
                        //     }
                        // },
                        sampleSize: 2,
                    }],
                },
                responsive: true
            }
        });
        },
        updateYAxisMax(value, index){
            if(index == 0){
                this.YAxisMax = value;
            }
            
        },
        updateYAxisMin(value,index,values){
            if(index == values.length - 1){
                this.YAxisMin = value;
            }
        },
        updateXAxisMin(value, index){
            if(index == 0){
                this.XAxisMin = value;
            }
            
        },
        updateXAxisMax(value,index,values){
            if(index == values.length - 1){
                this.XAxisMax = value;
            }
        },
        addDataToChart(data, index) {
            this.chart.data.datasets[index].data.push(data);
        },
        clearData(){
            // this.chart.data.datasets[0].data = [];
            // this.chart.data.datasets[1].data = [];
            // this.chart.data.datasets[2].data = [];
            // this.chart.data.datasets[3].data = [];
            // this.chart.data.datasets[4].data = [];
            // this.chart.data.datasets[5].data = [];
            // this.chart.data.datasets[6].data = [];
            // this.chart.data.datasets[7].data = [];

            this.chart.destroy()
            this.createChart();
        },
        //getAllData needs to send the correct data to the correct dataset: 0 -> S11_dB, 1 -> S11_phase, 2: S12_dB etc
        getAllData(){
            this.clearData();
            let x_data = this.getXResult;       //array of frequencies
            let y_data = this.getYResult;       //array of results [{S11:{dB:0, phase:0}, {S12:{dB:0, phase:0}}...}, {S11:.....}]

            for(let i=0; i<this.getNumData;i++){
                let x = x_data[i];

                if(this.getResponse.sparam.s11){
                    this.addSParamData(x, y_data[i].s11, 0);
                }

                if(this.getResponse.sparam.s12){
                    this.addSParamData(x, y_data[i].s12, 2);
                }

                if(this.getResponse.sparam.s21){
                    this.addSParamData(x, y_data[i].s21, 4);
                }

                if(this.getResponse.sparam.s22){
                    this.addSParamData(x, y_data[i].s22, 6);
                }
                
            }

            //this.previous_phase = null;
        },
        // addSParamData(x_data, y_data, dB_index){
        //     let dB = y_data.dB;
        //     this.addDataToChart({x: x_data/this.unit, y: dB}, dB_index);
        //     let unwrapped_phase = this.unwrapPhase(y_data.phase, this.previous_phase);
        //     this.addDataToChart({x: x_data/this.unit, y: unwrapped_phase}, dB_index + 1);

        //     this.previous_phase = unwrapped_phase;
        // },
        addSParamData(x_data, y_data, dB_index){
            let dB = y_data.dB;
            this.addDataToChart({x: x_data/this.unit, y: dB}, dB_index);
            if(this.plot_phase == 'unwrapped'){
                this.addDataToChart({x: x_data/this.unit, y: y_data.phase_unwrapped}, dB_index + 1);
            } else{
                this.addDataToChart({x: x_data/this.unit, y: y_data.phase}, dB_index + 1);
            }
            
        },
        removeChart(){
            this.chart.destroy();
        },
        // unwrapPhase(angle, previous_angle){
        //     if(previous_angle != null && Math.abs(previous_angle - angle) > 180.0){
        //         let unwrap_angle = angle + 360.0;
        //         if(Math.abs(previous_angle - unwrap_angle) < 180.0){
        //             return unwrap_angle;
        //         } else{
        //             let unwrap_angle = angle - 360.0;
        //             if(Math.abs(previous_angle - unwrap_angle) < 180.0){
        //                 return unwrap_angle;
        //             }
        //         }
        //     } else{
        //         return angle;
        //     }
        // },
        getDataSets(){
            let datasets = [];
            if(this.sparams.includes('s11')){
                datasets.push(
                    //dataset[0] -> S11 dB
                    {
                        label: 'S11_dB',
                        yAxisID: 'dB',
                        data: [],
                        pointBackgroundColor: 'rgba(0, 0, 0, 1)',
                        backgroundColor: 'rgba(0, 0, 0, 0)',
                        borderColor: 'rgba(0, 0, 0, 1)'
                    },
                    //dataset[1] -> S11 phase
                    {
                        label: 'S11_phase',
                        yAxisID: 'phase',
                        data: [],
                        pointBackgroundColor: 'rgba(255, 0, 0, 1)',
                        backgroundColor: 'rgba(0, 0, 0, 0)',
                        borderColor: 'rgba(255, 0, 0, 1)'
                    }
                )
            }

            if(this.sparams.includes('s12')){
                datasets.push(
                    //dataset[2] -> S12 dB
                    {
                        label: 'S12_dB',
                        yAxisID: 'dB',
                        data: [],
                        pointBackgroundColor: 'rgba(0, 255, 0, 1)',
                        backgroundColor: 'rgba(0, 0, 0, 0)',
                        borderColor: 'rgba(0, 255, 0, 1)'
                    },
                    //dataset[3] -> S12 phase
                    {
                        label: 'S12_phase',
                        yAxisID: 'phase',
                        data: [],
                        pointBackgroundColor: 'rgba(0, 0, 255, 1)',
                        backgroundColor: 'rgba(0, 0, 0, 0)',
                        borderColor: 'rgba(0, 0, 255, 1)'
                    },
                )
            }

            if(this.sparams.includes('s21')){
                datasets.push(
                    //dataset[4] -> S21 dB
                    {
                        label: 'S21_dB',
                        yAxisID: 'dB',
                        data: [],
                        pointBackgroundColor: 'rgba(255, 255, 0, 1)',
                        backgroundColor: 'rgba(0, 0, 0, 0)',
                        borderColor: 'rgba(255, 255, 0, 1)'
                    },
                    //dataset[5] -> S21 phase
                    {
                        label: 'S21_phase',
                        yAxisID: 'phase',
                        data: [],
                        pointBackgroundColor: 'rgba(0, 255, 255, 1)',
                        backgroundColor: 'rgba(0, 0, 0, 0)',
                        borderColor: 'rgba(0, 255, 255, 1)'
                    },
                )
            }

            if(this.sparams.includes('s22')){
                datasets.push(
                    //dataset[6] -> S22 dB
                    {
                        label: 'S22_dB',
                        yAxisID: 'dB',
                        data: [],
                        pointBackgroundColor: 'rgba(255, 0, 255, 1)',
                        backgroundColor: 'rgba(0, 0, 0, 0)',
                        borderColor: 'rgba(255, 0, 255, 1)'
                    },
                    //dataset[7] -> S22 phase
                    {
                        label: 'S22_phase',
                        yAxisID: 'phase',
                        data: [],
                        pointBackgroundColor: 'rgba(0, 0, 0, 0.5)',
                        backgroundColor: 'rgba(0, 0, 0, 0)',
                        borderColor: 'rgba(0, 0, 0, 0.5)'
                    }
                )
            }

            return datasets;
        }

      },
      
}
</script>



<style scoped>

#linear_function{
    width: 120px;
    height: 30px;
}

#trig_function{
    width: 150px;
    height: 30px;
}

#plotFunctionButton       {background-color: #4CAF50FF; color: rgb(255, 255, 255)}
#plotFunctionButton:hover {background-color: #3e8e41} 

#clearFunctionButton        {background-color: #e13131ff; color: rgb(255, 255, 255)}
#clearFunctionButton:hover {background-color: #cc1e1eff;}

#clearButton  {background-color: #e17a31ff;}
#clearButton:hover  {background-color: #cc661eff;}

#outputButton        {background-color: #e1b131ff;}
#outputButton:hover  {background-color: #cc9d1eff;}


label {
    font-size:16px;
    color: #0501f7;
    font-weight: bold;
    display: inline-block;
    /* vertical-align: middle; */
    /* width: 20px; */
    /* padding-top: 20px; */
    /* float: left; */
}

select{
    color: white;
    padding-top: 5px;
    padding-bottom: 5px;
    
    background-color: #4490d8;
}



</style>
