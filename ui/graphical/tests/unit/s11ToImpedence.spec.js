import SmithChart from '../../src/components/SmithChart.vue';


describe('Calculations of Impedence from s11 data', () => {


    test('{real: 0.0, imag: 0.0}', () => {
        let s = {real: 0.0, imag: 0.0};
        let result = SmithChart.methods.convertSToImpedence(s);

        expect(result.real).toBe(1);
        expect(result.imag).toBe(0);
        
    })

    test('{real: 1.0, imag: 0.0}', () => {
        let s = {real: 1.0, imag: 0.0};
        let result = SmithChart.methods.convertSToImpedence(s);
        
        expect(result.real).toBe(Infinity);
        expect(result.imag).toBe(Infinity);
        
    })

    test('{real: -1.0, imag: 0.0}', () => {
        let s = {real: -1.0, imag: 0.0};
        let result = SmithChart.methods.convertSToImpedence(s);
        
        expect(result.real).toBe(0);
        expect(result.imag).toBe(0);
        
    })

    test('{real: 0.0, imag: 1.0}', () => {
        let s = {real: 0.0, imag: 1.0};
        let result = SmithChart.methods.convertSToImpedence(s);
        
        expect(result.real).toBe(0);
        expect(result.imag).toBe(1);
        
    })

    test('{real: 2.0, imag: 1.0}', () => {
        let s = {real: 2.0, imag: 1.0};
        let result = SmithChart.methods.convertSToImpedence(s);
        
        expect(result.real).toBe(-2);
        expect(result.imag).toBe(1);
        
    })

})