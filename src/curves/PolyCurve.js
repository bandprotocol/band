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
      priceStart: 0,
      priceEnd: 2000,
      totalSupply: 100,
      //   degree: 2,
      reserveRatio: 50,
    }
  }

  /**
   * Derived Properties
   */

  get degree() {
    return 100 / this.reserveRatio
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
      this.slope / (this.intregralDegree * Math.pow(10, this.degree * 18))
    const T = Math.pow(y / A, 1 / this.intregralDegree)
    return T
  }

  get slope() {
    return (
      (this.priceEnd - this.priceStart) /
      Math.pow(this.totalSupply, this.degree)
    )
  }

  // convert equation to y = c * (x / baseD) ^ (n * 1000000)

  get baseD() {
    return this.theoriticalSupply / this.rootMaximumBancor
  }

  get c() {
    return (
      (this.slope / (Math.pow(10, this.degree * 18) * this.intregralDegree)) *
      Math.pow(this.baseD, this.intregralDegree)
    )
  }

  /**
   * Calculations
   */

  // use degree
  generateEquation() {
    // const slope = this.slope.toLocaleString(undefined, {
    //   maximumFractionDigits: 14,
    // })
    const slope = this.slope
    if (slope === 1) {
      if (this.priceStart === 0) {
        return `y = x^{${this.degree}}`
      } else {
        return `y = x^{${this.degree}} + ${this.priceStart}`
      }
    }

    if (this.priceStart === 0) {
      return `y = (${slope})x^{${this.degree}}`
    } else {
      return `y = (${slope})x^{${this.degree}} + ${this.priceStart}`
    }
  }

  // use degree
  generateDataset() {
    let xDataSet = []
    let bondingDataSet = []
    let collateralDataSet = []
    for (let i = 0; i <= this.totalSupply; i++) {
      xDataSet[i] = i
      bondingDataSet[i] =
        this.slope * Math.pow(i, this.degree) + this.priceStart
      collateralDataSet[i] =
        (this.slope / this.intregralDegree) *
          Math.pow(i, this.intregralDegree) +
        this.priceStart * i
    }
    return {
      xDataSet,
      bondingCurve: bondingDataSet,
      collateralCurve: collateralDataSet,
    }
  }

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

  generateCollateralArray() {
    const expV = this.intregralDegree * 1000000
    const baseD = this.baseD.toLocaleString('fullwide', { useGrouping: false })
    const withZero = `[18, 12, 1, 0, ${baseD}, 7, 6, 0, ${
      this.c
    }, 1, 0, ${baseD}, 20, 0, ${this.c}, 1, 0, ${baseD}, 0, ${expV}]`
    return withZero
  }
}
