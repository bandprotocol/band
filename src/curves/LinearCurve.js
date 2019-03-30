import BaseCurve from './BaseCurve'

export default class LinearCurve extends BaseCurve {
  /**
   * Static Properties
   */

  static get type() {
    return 'linear'
  }

  static get defaultParams() {
    return {
      priceStart: 0,
      slope: 0.1,
      totalSupply: 4500, //fixed
      minSlope: 0.001,
      maxSlope: 0.25,
      minPriceStart: 0,
      maxPriceStart: 100,
    }
  }

  /**
   * Derived Properties
   */

  get priceGraphConfig() {
    return {
      stepSize: 100,
      suggestedMax: 800,
    }
  }

  get collateralGraphConfig() {
    return {
      stepSize: 150000,
      suggestedMax: 1500000,
    }
  }

  /**
   * Calculations
   */

  generateEquation() {
    if (this.slope === 1) {
      if (this.priceStart === 0) {
        return `y = x`
      } else {
        return `y = x + ${this.priceStart}`
      }
    }

    if (this.priceStart === 0) {
      return `y = ${this.slope}x`
    } else {
      return `y = ${this.slope}x + ${this.priceStart}`
    }
  }

  generateDataset() {
    let xDataSet = []
    let bondingDataSet = []
    let collateralDataSet = []
    for (let i = 0; i <= this.totalSupply; i += 100) {
      xDataSet.push(i)
      bondingDataSet.push({
        x: i,
        y: this.slope * i + this.priceStart,
      })
      collateralDataSet.push({
        x: i,
        y: 0.5 * this.slope * i * i + this.priceStart * i,
      })
    }
    return {
      xDataSet,
      bondingCurve: bondingDataSet,
      collateralCurve: collateralDataSet,
    }
  }

  generateCollateralArray() {
    const slopeOnChain = Math.floor(this.slope * 100000000)
    const withZero = [
      '7',
      '6',
      '0',
      slopeOnChain.toString(),
      '6',
      '1',
      '1',
      '0',
      '200000000000000000000000000',
    ]
    const withPriceStart = [
      '7',
      '6',
      '0',
      slopeOnChain.toString(),
      '6',
      '1',
      '1',
      '0',
      '200000000000000000000000000',
      '6',
      '0',
      (this.priceStart * Math.pow(10, 18)).toLocaleString('fullwide', {
        useGrouping: false,
      }),
      '1',
    ]
    // const withZero = `[7, 6, 0, ${slopeOnChain}, 6, 1, 1, 0, 200000000000000000000000000]`
    // const withPriceStart = `[ 4, 7, 6, 0, ${slopeOnChain}, 6, 1, 1, 0, 200000000000000000000000000, 6, 0, ${this
    //   .priceStart * Math.pow(10, 18)},
    // 1]`

    if (this.priceStart === 0) {
      return withZero
    } else {
      return withPriceStart
    }
  }

  // Don't use right now
  generateTree() {
    const slopeOnChain = this.slope * 100000000 // 10^8
    if (this.priceStart === 0) {
      return [
        {
          name: '7 (Opcode /)',
          children: [
            {
              name: '6 (Opcode x)',
              children: [
                {
                  name: '0 (Opcode Constant)',
                  children: [
                    {
                      name: `${slopeOnChain} (Value)`,
                    },
                  ],
                },
                {
                  name: '6 (Opcode x)',
                  children: [
                    {
                      name: '1 (Opcode Variable)',
                    },
                    {
                      name: '1 (Opcode Variable)',
                    },
                  ],
                },
              ],
            },
            {
              name: '0 (Opcode Constant)',
              children: [
                {
                  name: '2 * 10^26',
                },
              ],
            },
          ],
        },
      ]
    } else {
      return [
        {
          name: '4 (Opcode +)',
          opcode: 4,
          children: [
            {
              name: '7 (Opcode /)',
              children: [
                {
                  name: '6 (Opcode x)',
                  children: [
                    {
                      name: '0 (Opcode Constant)',
                      children: [
                        {
                          name: `${slopeOnChain} (Value)`,
                        },
                      ],
                    },
                    {
                      name: '6 (Opcode x)',
                      children: [
                        {
                          name: '1 (Opcode Variable)',
                        },
                        {
                          name: '1 (Opcode Variable)',
                        },
                      ],
                    },
                  ],
                },
                {
                  name: '0 (Opcode Constant)',
                  children: [
                    {
                      name: '2 * 10^26',
                    },
                  ],
                },
              ],
            },
            {
              name: '6 (Opcode x)',
              children: [
                {
                  name: '0 (Constanst)',
                  children: [
                    {
                      name: `${this.priceStart} (value)`,
                    },
                  ],
                },
                {
                  name: '1 (Opcode Variable)',
                },
              ],
            },
          ],
        },
      ]
    }
  }
}
