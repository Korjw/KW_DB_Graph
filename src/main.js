import Vue from "vue";
import App from "./App.vue";
import VueApexCharts from "vue-apexcharts";
import "./index.css";
import "flowbite";

Vue.config.productionTip = false;

Vue.use(VueApexCharts);
Vue.component("apex_chart", VueApexCharts);

new Vue({
  render: (h) => h(App),
}).$mount("#app");
