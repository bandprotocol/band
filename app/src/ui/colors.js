import hsl from 'hsl-to-hex'

export default {
  purple: {
    light: '#aa93ff',
    blueberry: '#4e3ca9',
    normal: '#5973e7', // '#8868ff',
    dark: '#3b57d1', // '#4e3ca9',
  },
  background: {
    lighter: '#fafbff',
    light: '#f4f6fe',
    lightGrey: '#e7ecff',
    darkGrey: '#626b90',
    paleGrey: '#f6f8fb',
  },
  text: {
    grey: '#7c84a6',
    normal: '#2a304e',
    light: '#868FCD',
    graph: '#4A4A4A',
  },
  white: '#FFFFFF',
  green: {
    normal: '#42c47f',
    dark: '#2bbe70',
  },
  red: {
    normal: '#ff6757',
    dark: '#ff6757',
  },
  grey: {
    dark: '#6A6B81',
  },
  blue: {
    light: '#718bff',
    normal: '#5973e7',
    dark: '#2741b4',
    text: '#3b57d1',
  },
  border: {
    light: 'solid 1px #E5E6F5',
  },
  gradient: {
    purple: 'linear-gradient(-45deg, #7365FF 0%, #6679F7 100%)',
    purple2: 'linear-gradient(-45deg, #968CFF 0%, #8998FF 100%)',
    purple3: 'linear-gradient(45deg, #6C70FB 0%, #6F6BFC 100%)',
    red: 'linear-gradient(135deg, #FD8F59 0%, #F6387B 100%)',
    dark: 'linear-gradient(134deg, #4D4E68 0%, #31314C 100%)',
  },
  shadow: {
    light: '0 4px 20px 0 #EEF1FF',
    lightActive: '0 6px 20px 0 #dde1f5',
    dark: '0 4px 10px 0 rgba(0,0,0,0.15)',
    darkLarge: '0 4px 20px 0 rgba(0,0,0,0.15)',
  },
  chart: [
    '#7365FF',
    '#F14ED4',
    '#FF5B9C',
    '#FF8F6C',
    '#FFC756',
    '#F9F871',
    '#65ff73',
  ],
  createChartColors: n =>
    [...Array(n)].map((_, i) => hsl(Math.floor((i * 360) / n), 80, 70)),
}
