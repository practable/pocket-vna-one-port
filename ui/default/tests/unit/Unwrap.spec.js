import { describe, expect, test } from 'vitest'
import { helpers } from '../../src/modules/dataStore.js';



describe('difference < 180 return original angle', () => {

    test('10, 20', () => {

      const angle = helpers.unwrapPhase(10,20);

      expect(angle).toBe(10);
    
    })

    test('10, 100', () => {

        const angle = helpers.unwrapPhase(10,100);
  
        expect(angle).toBe(10);
      
      })

      test('-10, 100', () => {

        const angle = helpers.unwrapPhase(-10,100);
  
        expect(angle).toBe(-10);
      
      })

})

describe('difference = 180 return original angle', () => {

    test('10, 190', () => {

      const angle = helpers.unwrapPhase(10,190);

      expect(angle).toBe(10);
    
    })

    test('180, 360', () => {

        const angle = helpers.unwrapPhase(180,360);
  
        expect(angle).toBe(180);
      
      })

      test('0, -180', () => {

        const angle = helpers.unwrapPhase(0,-180);
  
        expect(angle).toBe(0);
      
      })

})

describe('difference > 180 return unwrapped angle', () => {

    test('10, 200', () => {

      const angle = helpers.unwrapPhase(10,200);

      expect(angle).toBe(370);
    
    })

    test('90, 300', () => {

        const angle = helpers.unwrapPhase(90,300);
  
        expect(angle).toBe(450);
      
      })

      test('60, -180', () => {

        const angle = helpers.unwrapPhase(60,-180);
  
        expect(angle).toBe(-300);
      
      })

      test('-60, 180', () => {

        const angle = helpers.unwrapPhase(-60,180);
  
        expect(angle).toBe(300);
      
      })

})

describe('difference = 360 return unwrapped angle', () => {

    test('-180, 180', () => {

      const angle = helpers.unwrapPhase(-180,180);

      expect(angle).toBe(180);
    
    })

    test('90, -270', () => {

        const angle = helpers.unwrapPhase(90,-270);
  
        expect(angle).toBe(-270);
      
      })

})

describe('difference near 360 return unwrapped angle', () => {

    test('-170, 180', () => {

      const angle = helpers.unwrapPhase(-170,180);

      expect(angle).toBe(190);
    
    })

    test('170, -180', () => {

        const angle = helpers.unwrapPhase(170,-180);
  
        expect(angle).toBe(-190);
      
      })

})

describe('difference > 540 return unwrapped angle', () => {

  test('-170, 380', () => {

    const angle = helpers.unwrapPhase(-170,380);

    expect(angle).toBe(550);
  
  })

  test('0, 900', () => {

      const angle = helpers.unwrapPhase(0,900);

      expect(angle).toBe(720);
    
    })

})