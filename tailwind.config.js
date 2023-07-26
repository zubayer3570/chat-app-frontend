/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        '1': "rgba(0, 0, 0, 0.24) 0px 3px 8px"
      },
      colors: {
        "test-3": "rgb(192, 132, 252)",
        "test-2": "rgb(134, 239, 172)",
      },
      backgroundImage: {
        "1": "linear-gradient(to left , rgb(134, 239, 172), rgb(192, 132, 252))",
        "2": "linear-gradient(to right, rgb(134, 239, 172), rgb(192, 132, 252))",
        "3": "linear-gradient(to bottom left, rgb(134, 239, 172), rgb(192, 132, 252))",
      }
    },
  }
}
