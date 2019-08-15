export default class BaseCurve {
  constructor(params = {}) {
    Object.assign(this, params)

    this.equation = this.generateEquation()
    this.dataset = this.generateDataset()
    this.tree = this.generateTree()
    this.collateral = this.generateCollateralArray()
  }

  /**
   * Static Properties
   */

  static get type() {
    throw new Error("Curve's type not override")
  }
  static get defaultParams() {
    throw new Error("Curve's default property not override")
  }

  /**
   * Calculations
   */

  generateEquation() {
    throw new Error("Curve's equation property not override")
  }
  generateDataset() {
    throw new Error("Curve's dataset property not override")
  }
  generateTree() {
    throw new Error("Curve's tree property not override")
  }
  generateCollateralArray() {
    throw new Error("Curve's collateral array property not override")
  }
}
