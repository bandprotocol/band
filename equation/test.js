const Decimal = require('decimal.js');
const { calculate } = require('./equation');

/**
 * Test Case
 */

// // y = x
// console.log(calculate([1], 5).equals(new Decimal(5)));
// // y = 5 ^ 0.5
// console.log(calculate([2, 0, 5], 1).equals(new Decimal(5).squareRoot()));
// // 2 + 5 = 7
// console.log(calculate([4, 1, 0, 5], 2).equals(new Decimal(7)));
// // 2 - 5 = -3
// console.log(calculate([5, 1, 0, 5], 2).equals(new Decimal(-3)));
// // (4^0.5) * 5 = 10
// console.log(calculate([6, 2, 1, 0, 5], 4).equals(new Decimal(10)));
// // ((5 ^ 4)/ 4) - 5 = 151.25
// console.log(
//   calculate([5, 7, 8, 1, 0, 4, 0, 4, 0, 5], 5).equals(new Decimal(151.25))
// );
// // (x <= 10) ? x + 5 : x - 2
// const plusFive = x => x + 5;
// const minusTwo = x => x - 2;
// const x = 10;
// console.log(
//   calculate([18, 14, 1, 0, 10, 4, 1, 0, 5, 5, 1, 0, 2], x).equals(
//     new Decimal(x <= 10 ? plusFive(x) : minusTwo(x))
//   )
// );
// // 2 * log(10 / 1)
// console.log(
//   calculate([19, 0, 2, 1, 0, 1], 10).equals(new Decimal(10).ln().mul(2))
// );
// // 5 * (x / 2) ^ (34.56)
// console.log(
//   calculate([20, 0, 5, 1, 0, 2, 0, 34560000], 5).equals(
//     new Decimal(5)
//       .div(2)
//       .pow(34.56)
//       .mul(5)
//   )
// );

// linear(y = (0.0001/2) x^2)
console.log(calculate([6, 4, 1, 0, 1, 0, 10000], 3).toFixed());

// Wrong
console.log(
  calculate(
    [7, 6, 0, 10000, 6, 1, 1, 0, 200000000000000000000000000],
    30000000000000000000,
  ).toFixed(),
);

// Correct
console.log(
  calculate(
    [7, 6, 6, 1, 1, 0, 10000, 0, 200000000000000000000000000],
    30000000000000000000,
  ).toFixed(),
);

// console.log(
//   "Linear test",
//   new Decimal(30000000000000000000)
//     .pow(2)
//     .mul(10000)
//     // .div(200000000000000000000000000)
//     .toFixed()
// );

// poly
// console.log(
//   calculate(
//     [
//       18,
//       12,
//       1,
//       0,
//       1041610425225491900000,
//       7,
//       6,
//       0,
//       12500000000000053000,
//       1,
//       0,
//       1041610425225491900000,
//       20,
//       0,
//       12500000000000053000,
//       1,
//       0,
//       1041610425225491900000,
//       0,
//       2482621
//     ],
//     7551000000000000000000
//   ).toFixed(0)
// );
