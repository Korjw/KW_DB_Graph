module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },

  content: ["./node_modules/flowbite/**/*.js"],
  plugins: [require("flowbite/plugin")],
};
