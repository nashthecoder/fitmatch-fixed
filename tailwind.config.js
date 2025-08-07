/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./helpers/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        'kavivanar': ['Kavivanar-Regular'],
        'roboto': ['Roboto-Regular'],
        'roboto-bold': ['Roboto-Bold'],
        'roboto-thin': ['Roboto-Thin'],
        'roboto-condensed': ['RobotoCondensed-Regular'],
        'roboto-condensed-bold': ['RobotoCondensed-Bold'],
        'roboto-condensed-light': ['RobotoCondensed-Light'],
        'roboto-condensed-light-italic': ['RobotoCondensed-LightItalic'],
        'roboto-condensed-medium': ['RobotoCondensed-Medium'],
        'inter': ['Inter_18pt-Regular'],
        'inter-bold': ['Inter_18pt-Bold'],
        'reddit-sans-bold': ['Reddit_Sans-Bold'],
      },
    },
  },
  plugins: [],
}