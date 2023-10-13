
<template>
<div class='container-sm m-2 background-white border rounded'>
    <div class="row m-0 justify-content-center" id="smith-chart-canvas">
        <div class="col-12">
            <canvas id='smith-graph-canvas'></canvas>
        </div>
    </div>

    <div class="col-sm-2">
        <input class="form-check-inline me-2" type="checkbox" v-model="showPlotLine" id="showlinecheck" @change="updateShowLine">
        <label class="" for="showlinecheck">Show line</label>
    </div>

</div>

</template>

<script>

import { Chart } from 'chart.js';
import 'chartjs-chart-smith';
import { mapGetters } from 'vuex';
import * as math from 'mathjs';

export default {
    
    name: 'SmithChart',
    props: ['sparams'],
    emits: [],
    components:{
       
    },
    data(){
        return{
            chart: null,
            showPlotLine: false,
            maxDataPoints: 5000,
            
        }
    },
    mounted() {
        this.createChart();
        //this.getAllData();
      },
    computed:{
        ...mapGetters([
            'getResponse',
            'getNumData',
        ]),
      },
    watch:{
        getResponse(){
            this.updateChart();
        },
    },
    methods: {
        updateChart(){
            this.clearData();
            let max_index = this.getNumData - 1;
            if(max_index < this.maxDataPoints){
                this.getAllData();
                this.chart.update();                       //actually updating the chart moved to here!
            } 
        },
        createChart() {
            let _this = this;
            const canvas = document.getElementById('smith-graph-canvas');
            const ctx = canvas.getContext('2d');
            this.chart = new Chart(ctx, {
            type: 'smith',
            data: {
                datasets: _this.createDataSets()
            },
            options: {
                aspectRatio: 1,
                elements: {
                point: {
                    pointStyle: 'cross',
                    radius: 10,
                    hoverRadius: 10,
                    borderColor: 'black'
                    }
                }
            },
            config: {
                scale: {
                    display: true, // setting false will hide the scale
                    gridLines: {
                        // setting false will hide the grid lines
                        display: true, 
                        // the color of the grid lines
                        color: 'rgba(0, 0, 0, 0.1)', 
                        // thickness of grid lines
                        lineWidth: 1, 
                    },
                    ticks: {
                        // The color of the scale label text
                        fontColor: 'black',
                        // The font family used to render labels
                        fontFamily: 'Helvetica',
                        // The font size in px
                        fontSize: 12,
                        // Style of font
                        fontStyle: 'normal'
                    }
                },
                
            }
            
        });
        },
        addDataToChart(data, index) {
            this.chart.data.datasets[index].data.push(data);
        },
        clearData(){
            this.chart.destroy()
            this.createChart();
        },
        getAllData(){
            let response = this.getResponse;     //full response from Pocket VNA
            let result = response.result;           //just the data to display

            for(let i=0; i<this.getNumData;i++){
                
                let data = result[i];

                if(response.sparam.s11){
                    let data_s11 = {real: data.s11.real, imag: data.s11.imag};
                    let data_s11_smith = this.convertSToImpedence(data_s11)
                    this.addDataToChart(data_s11_smith, 0);
                }

                if(response.sparam.s12){
                    let data_s12 = {real: data.s12.real, imag: data.s12.imag};
                    this.addDataToChart(data_s12, 1);
                }

                if(response.sparam.s21){
                    let data_s21 = {real: data.s21.real, imag: data.s21.imag};
                    this.addDataToChart(data_s21, 2);
                }

                if(response.sparam.s22){
                    let data_s22 = {real: data.s22.real, imag: data.s22.imag};
                    this.addDataToChart(data_s22, 3);
                }

                
                
            }

        },
        convertSToImpedence(data){
            let one = math.complex(1);
            let s11 = math.complex(data.real, data.imag)
            let top = math.add(one,s11);
            let bottom = math.subtract(one,s11);
            let z = math.divide(top,bottom);
            return {real: z.re, imag: z.im};
        },
        removeChart(){
            this.chart.destroy();
        },
        createDataSets(){
            let datasets = [];
            if(this.sparams.includes('s11')){
                datasets.push(
                    //dataset[0] -> S11
                    {
                        label:'s11',
                        data: [],
                        pointBackgroundColor: 'rgba(0, 0, 0, 1)',
                        backgroundColor: 'rgba(0, 0, 0, 0)',
                        borderColor: 'rgba(0, 0, 0, 1)',
                        showLine: false,
                    }
                )
            }

            if(this.sparams.includes('s12')){
                datasets.push(
                    //dataset[1] -> S12
                    {
                        label:'s12',
                        data: [],
                        pointBackgroundColor: 'rgba(0, 0, 0, 1)',
                        backgroundColor: 'rgba(0, 0, 0, 0)',
                        borderColor: 'rgba(0, 0, 0, 1)',
                        showLine: false,
                    }
                )
            }

            if(this.sparams.includes('s21')){
                datasets.push(
                    //dataset[2] -> S21
                    {
                        label:'s21',
                        data: [],
                        pointBackgroundColor: 'rgba(0, 0, 0, 1)',
                        backgroundColor: 'rgba(0, 0, 0, 0)',
                        borderColor: 'rgba(0, 0, 0, 1)',
                        showLine: false,
                    }
                )
            }

            if(this.sparams.includes('s22')){
                datasets.push(
                    //dataset[3] -> S22
                    {
                        label:'s22',
                        data: [],
                        pointBackgroundColor: 'rgba(0, 0, 0, 1)',
                        backgroundColor: 'rgba(0, 0, 0, 0)',
                        borderColor: 'rgba(0, 0, 0, 1)',
                        showLine: false,
                    }
                )
            }

            return datasets;
        },
        updateShowLine(){
            
            this.chart.data.datasets.forEach(dataset => {
                dataset.showLine = this.showPlotLine;
            });

            this.chart.update();
        }

      },
      
}
</script>



<style scoped>



</style>
