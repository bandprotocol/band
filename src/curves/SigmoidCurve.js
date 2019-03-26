import BaseCurve from './BaseCurve'

export default class SigmoidCurve extends BaseCurve {
  /**
   * Static Properties
   */

  static get type() {
    return 'sigmoid'
  }

  static get defaultParams() {
    return {
      slope: 1, //TODO: use suitable name for this!!!
      b: 0, //TODO: use suitable name for this too!!!
      priceEnd: 300,
      totalSupply: 20,
    }
  }

  /**
   * Derived Properties
   */

  // e * 10^18
  get eExpEighteen() {
    return 2718281828459045235
  }

  // 10 ^ 18
  get tenExpEighteen() {
    return Math.pow(10, 18)
  }

  /**
   * Maximum value is 16 because of e^16 = 8.8 * 10^6(Maximum of bancor.power())
   * So, ax+b = 16, then x = (16 - b) / a
   * Finally, x = ((16 - b) / a) * 10^18
   */
  get maximumTotalSupply() {
    return ((16 - this.b) / this.slope) * this.tenExpEighteen
  }

  /**
   * Given (x,y) = (0,0) then find it.
   */
  get integralConstant() {
    return -(this.priceEnd / 2) * Math.log(this.exp(this.b) + 1)
  }

  /**
   * return integralConstant * 10^18
   */
  get integralConstantMulTenExpEighteen() {
    return this.integralConstant * this.tenExpEighteen
  }

  /**
   * (a * c / 2) * 10^18
   */
  get case1Constant1() {
    return this.slope * this.priceEnd * 0.5 * this.tenExpEighteen
  }

  /**
   * (b * c * 10^18 / 2) + integralConstantMulTenExpEighteen
   */
  get case1Constant2() {
    const frac = (this.b * this.priceEnd * this.tenExpEighteen) / 2
    return frac + this.integralConstantMulTenExpEighteen
  }

  /**
   * Calculations
   */

  exp(input) {
    return Math.pow(Math.E, input)
  }

  generateEquation() {
    if (this.slope === 1) {
      if (this.b > 0)
        return `y = \\frac{${this.priceEnd}}{1+e^{-(x+${this.b})}}`
      else if (this.b < 0) {
        return `y = \\frac{${this.priceEnd}}{1+e^{-(x-${Math.abs(this.b)})}}`
      } else {
        return `y = \\frac{${this.priceEnd}}{1+e^{-x}}`
      }
    }

    if (this.b > 0)
      return `y = \\frac{${this.priceEnd}}{1+e^{-(${this.slope}x+${this.b})}}`
    else if (this.b < 0) {
      return `y = \\frac{${this.priceEnd}}{1+e^{-(${this.slope}x-${Math.abs(
        this.b,
      )})}}`
    } else {
      return `y = \\frac{${this.priceEnd}}{1+e^{-${this.slope}x}}`
    }
  }

  generateDataset() {
    let xDataSet = []
    let bondingDataSet = []
    let collateralDataSet = []
    for (let i = 0; i <= this.totalSupply; i++) {
      xDataSet[i] = i
      bondingDataSet[i] =
        this.priceEnd / (1 + this.exp(-(this.slope * i + this.b)))
      collateralDataSet[i] =
        (this.priceEnd / 2) * Math.log(this.exp(this.slope * i + this.b) + 1) +
        this.integralConstant
    }
    return {
      xDataSet,
      bondingCurve: bondingDataSet,
      collateralCurve: collateralDataSet,
    }
  }

  generateTree() {
    return [
      {
        name: `${this.integralConstant >= 0 ? '4 (Opcode +)' : '5 (Opcode -)'}`,
        children: [
          {
            name: '17 (Opcode Ternary)',
            children: [
              {
                name: '14 (Opcode >=)',
                children: [
                  {
                    name: '1 (Opcode Variable)',
                  },
                  {
                    name: '0 (Opcode Constant)',
                    children: [
                      {
                        name: `${this.maximumTotalSupply} (Value)`,
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            name: '0 (Opcode Constant)',
            children: [
              {
                name: `${Math.abs(this.integralConstant) *
                  this.tenExpEighteen} (Value)`,
              },
            ],
          },
        ],
      },
    ]
  }

  generateCollateralArray() {
    const signOfCase1Constant2 = this.case1Constant2 > 0 ? '4' : '5'
    const signOfIntegralConstant =
      this.integralConstantMulTenExpEighteen > 0 ? '4' : '5'
    const bNoSign = Math.abs(this.b)

    // for log
    const firstParamLog = this.priceEnd * 0.5 * this.tenExpEighteen
    const signOfB = this.b > 0 ? '4' : '5'

    // locale string
    const maximumTotalSupply = this.maximumTotalSupply.toLocaleString(
      'fullwide',
      { useGrouping: false },
    )
    const case1Constant2 = Math.abs(this.case1Constant2).toLocaleString(
      'fullwide',
      {
        useGrouping: false,
      },
    )

    // if (this.b === 0) {
    //   const result = `[18, 15, 1, 0, ${maximumTotalSupply}, ${signOfCase1Constant2}, 9, 1, 0, ${
    //     this.case1Constant1
    //   }, 0, ${case1Constant2}, ${signOfIntegralConstant}, 19, 0, ${firstParamLog}, 4, 20, 0, ${
    //     this.tenExpEighteen
    //   }, 0, ${this.eExpEighteen}, 0, ${this.tenExpEighteen}, 9, 1, 0, ${this
    //     .slope * Math.pow(10, 6)}, 0, ${this.tenExpEighteen}, 0, ${
    //     this.tenExpEighteen
    //   }, 0, ${Math.abs(this.integralConstantMulTenExpEighteen)}]`
    //   return result
    // }

    // // result
    // const result = `[18, 15, 1, 0, ${maximumTotalSupply}, ${signOfCase1Constant2}, 9, 1, 0, ${
    //   this.case1Constant1
    // }, 0, ${case1Constant2}, ${signOfIntegralConstant}, 19, 0, ${firstParamLog}, 4, 20, 0, ${
    //   this.tenExpEighteen
    // }, 0, ${this.eExpEighteen}, 0, ${
    //   this.tenExpEighteen
    // }, ${signOfB}, 9, 1, 0, ${this.slope * Math.pow(10, 6)}, 0, ${bNoSign *
    //   Math.pow(10, 6)}, 0, ${this.tenExpEighteen}, 0, ${
    //   this.tenExpEighteen
    // }, 0, ${Math.abs(this.integralConstantMulTenExpEighteen)}]`
    // return result
    return '[18, 15, 1, 0, 1700000000000000000000, 5, 9, 1, 0, 5000000000000000000, 0, 656630843759111400000, 5, 18, 15, 1, 0, 100000000000000000000, 19, 0, 500000000000000000000, 4, 20, 0, 1000000000000000000, 0, 2718281828459045400, 0, 1000000000000000000, 5, 9, 1, 0, 10000, 0, 1000000, 0, 1000000000000000000, 0, 1000000000000000000, 19, 0, 500000000000000000000, 4, 0, 1000000000000000000, 20, 0, 1000000000000000000, 0, 2718281828459045400, 0, 1000000000000000000, 5, 0, 1000000, 9, 1, 0, 10000, 20, 0, 1000000000000000000, 0, 2718281828459045400, 0, 1000000000000000000, 5, 0, 1000000, 9, 1, 0, 10000, 0, 156630843759111440000]'
  }
}
