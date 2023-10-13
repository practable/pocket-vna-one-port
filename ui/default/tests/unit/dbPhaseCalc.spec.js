import { describe, expect, test } from 'vitest'
import { helpers } from '../../src/modules/dataStore.js';

describe('dB and phase calculations', () => {

    test('{real: 0.5, imag: 0.1}', () => {
        let s = {real: 0.5, imag: 0.1};
        
        let result = helpers.calculatedB(s, 0);

        expect(result.dB).toBeCloseTo(-5.85);
        expect(result.phase).toBeCloseTo(11.31);
    
    })

    test('{real: -0.5, imag: 0.1}', () => {
        let s = {real: -0.5, imag: 0.1};
        
        let result = helpers.calculatedB(s, 0);

        expect(result.dB).toBeCloseTo(-5.85);
        expect(result.phase).toBeCloseTo(168.69);
    
    })

    test('{real: -0.5, imag: -0.1}', () => {
        let s = {real: -0.5, imag: -0.1};
        
        let result = helpers.calculatedB(s, 0);

        expect(result.dB).toBeCloseTo(-5.85);
        expect(result.phase).toBeCloseTo(-168.69);
    
    })

    test('{real: 0.5, imag: -0.1}', () => {
        let s = {real: 0.5, imag: -0.1};
        
        let result = helpers.calculatedB(s, 0);

        expect(result.dB).toBeCloseTo(-5.85);
        expect(result.phase).toBeCloseTo(-11.31);
    
    })

    test('{real: 10, imag: -123}', () => {
        let s = {real: 10, imag: -123};
        
        let result = helpers.calculatedB(s, 0);

        expect(result.dB).toBeCloseTo(41.83);
        expect(result.phase).toBeCloseTo(-85.35);
    
    })

    test('{real: 0, imag: -123}', () => {
        let s = {real: 0, imag: -123};
        
        let result = helpers.calculatedB(s, 0);

        expect(result.dB).toBeCloseTo(41.80);
        expect(result.phase).toBeCloseTo(-90);
    
    })

    test('{real: 0, imag: 123}', () => {
        let s = {real: 0, imag: 123};
        
        let result = helpers.calculatedB(s, 0);

        expect(result.dB).toBeCloseTo(41.80);
        expect(result.phase).toBeCloseTo(90);
    
    })

    test('{real: 1, imag: 0}', () => {
        let s = {real: 1, imag: 0};
        
        let result = helpers.calculatedB(s, 0);

        expect(result.dB).toBeCloseTo(0);
        expect(result.phase).toBeCloseTo(0);
    
    })

    test('{real: -1, imag: 0}', () => {
        let s = {real: -1, imag: 0};
        
        let result = helpers.calculatedB(s, 0);

        expect(result.dB).toBeCloseTo(0);
        expect(result.phase).toBeCloseTo(180);
    
    })

})