import BaseCurve from './BaseCurve'

export default class PolyCurve extends BaseCurve {
  /**
   * Static Properties
   */

  static get type() {
    return 'poly'
  }

  static get defaultParams() {
    return {
      totalSupply: 1000000, // hard code
      priceStart: 0, // 0 - 100
      slope: 5, //
      reserveRatio: 20, // 10% - 100%
      minSlope: 1,
      maxSlope: 100,
      minPriceStart: 0,
      maxPriceStart: 100,
      minReserveRatio: 20,
      maxReserveRatio: 49,
    }
  }

  /**
   * Derived Properties
   */

  get convertedSlope() {
    return this.slope * Math.pow(10, -24)
  }

  get priceGraphConfig() {
    // if (this.reserveRatio < 28.7) {
    //   return {
    //     stepSize: 15000,
    //     suggestedMax: 150000,
    //   }
    // }
    // if (this.reserveRatio < 31.7) {
    //   return {
    //     stepSize: 1000,
    //     suggestedMax: 10000,
    //   }
    // }
    return {
      stepSize: 10,
      suggestedMax: 100,
    }
  }

  get collateralGraphConfig() {
    // if (this.reserveRatio < 32.2) {
    //   return {
    //     stepSize: 100,
    //     suggestedMax: 1000,
    //   }
    // }
    return {
      stepSize: 200000,
      suggestedMax: 2000000,
    }
  }

  get degree() {
    return 100 / this.reserveRatio - 1
  }
  get intregralDegree() {
    return this.degree + 1
  }

  get rootMaximumBancor() {
    // 8000000 is maximum value that bancor can handle.
    return Math.pow(8000000, 1 / this.intregralDegree)
  }

  get theoriticalSupply() {
    const y = Math.pow(10, 26)
    const A =
      this.convertedSlope /
      (this.intregralDegree * Math.pow(10, this.degree * 18))
    const T = Math.pow(y / A, 1 / this.intregralDegree)
    return T
  }

  // convert equation to y = c * (x / baseD) ^ (n * 1000000)

  get baseD() {
    return this.theoriticalSupply / this.rootMaximumBancor
  }

  get c() {
    return (
      (this.convertedSlope /
        (Math.pow(10, this.degree * 18) * this.intregralDegree)) *
      Math.pow(this.baseD, this.intregralDegree)
    )
  }

  /**
   * Calculations
   */

  // use degree
  generateEquation() {
    const convertedSlope = this.convertedSlope.toString()

    const degree = this.degree.toLocaleString(undefined, {
      maximumFractionDigits: 3,
    })

    if (convertedSlope === 1) {
      if (this.priceStart === 0) {
        return `y = x^{${degree}}`
      } else {
        return `y = x^{${degree}} + ${this.priceStart}`
      }
    }

    if (this.priceStart === 0) {
      return `y = (${convertedSlope})x^{${degree}}`
    } else {
      return `y = (${convertedSlope})x^{${degree}} + ${this.priceStart}`
    }
  }

  // use degree
  generateDataset() {
    let xDataSet = []
    let bondingDataSet = []
    let collateralDataSet = []
    for (let i = 0; i <= this.totalSupply; i += 50000) {
      xDataSet.push(i)
      bondingDataSet.push({
        x: i,
        y: this.convertedSlope * Math.pow(i, this.degree) + this.priceStart,
      })
      console.log(
        this.convertedSlope * Math.pow(i, this.degree) + this.priceStart,
      )
      collateralDataSet.push({
        x: i,
        y:
          (this.convertedSlope / this.intregralDegree) *
            Math.pow(i, this.intregralDegree) +
          this.priceStart * i,
      })
    }
    return {
      xDataSet,
      bondingCurve: bondingDataSet,
      collateralCurve: collateralDataSet,
    }
  }

  generateCollateralArray() {
    const expV = Math.floor(this.intregralDegree * 1000000)
    const baseD = this.baseD.toLocaleString('fullwide', { useGrouping: false })
    const cString = this.c.toString()
    if (this.priceStart === 0) {
      const withZero = [
        '18',
        '12',
        '1',
        '0',
        baseD,
        '7',
        '6',
        '0',
        cString,
        '1',
        '0',
        baseD,
        '20',
        '0',
        cString,
        '1',
        '0',
        baseD,
        '0',
        expV.toString(),
      ]
      // const withZero = `[18, 12, 1, 0, ${baseD}, 7, 6, 0, ${
      //   this.c
      // }, 1, 0, ${baseD}, 20, 0, ${this.c}, 1, 0, ${baseD}, 0, ${expV}]`
      return withZero
    } else {
      const withNoZero = [
        '4',
        '18',
        '12',
        '1',
        '0',
        baseD,
        '7',
        '6',
        '0',
        cString,
        '1',
        '0',
        baseD,
        '20',
        '0',
        cString,
        '1',
        '0',
        baseD,
        '0',
        expV.toString(),
        '0',
        (this.priceStart * Math.pow(10, 18)).toLocaleString('fullwide', {
          useGrouping: false,
        }),
      ]
      // const withNoZero = `[4, 18, 12, 1, 0, ${baseD}, 7, 6, 0, ${
      //   this.c
      // }, 1, 0, ${baseD}, 20, 0, ${this.c}, 1, 0, ${baseD}, 0, ${expV}, 0, ${this
      //   .priceStart * Math.pow(10, 18)}]`
      return withNoZero
    }
  }

  // don't use right now
  generateTree() {
    const baseD = this.baseD.toLocaleString('fullwide', { useGrouping: false })
    const expV = this.intregralDegree * 1000000
    if (this.priceStart === 0) {
      return [
        {
          name: '18 ( Opcode Ternary)',
          children: [
            {
              name: '12 (Opcode <)',
              children: [
                {
                  name: '1 (Opcode Variable)',
                },
                {
                  name: '0 (Opcode Constant)',
                  children: [
                    {
                      name: `${this.baseD} (Values)`,
                    },
                  ],
                },
              ],
            },
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
                          name: `${this.c} (Values)`,
                        },
                      ],
                    },
                    {
                      name: '1 (Opcode Variable)',
                    },
                  ],
                },
                {
                  name: '0 (Opcode Constant)',
                  children: [
                    {
                      name: `${this.baseD} (Values)`,
                    },
                  ],
                },
              ],
            },
            {
              name: "20 (Opcode Bancor's power)",
              children: [
                {
                  name: '0 (Opcode Constant)',
                  children: [
                    {
                      name: `${this.c} (Value)`,
                    },
                  ],
                },
                {
                  name: '1 (Opcode Variable)',
                },
                {
                  name: '0 (Opcode Constant)',
                  children: [
                    {
                      name: `${baseD} (Value)`,
                    },
                  ],
                },
                {
                  name: '0 (Opcode Constant)',
                  children: [
                    {
                      name: `${expV} (Value)`,
                    },
                  ],
                },
              ],
            },
          ],
        },
      ]
    }
  }
}
