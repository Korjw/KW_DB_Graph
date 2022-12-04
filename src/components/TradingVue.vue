<template>
  <!-- TradingVueJs 101 (example from 'Getting Started' ) -->

  <trading-vue
    :data="this.chart"
    :width="this.width"
    :height="this.height"
    :color-back="colors.colorBack"
    :color-grid="colors.colorGrid"
    :color-text="colors.colorText"
    :legend-buttons="['up', 'down']"
    v-on:legend-button-click="on_button_click"
    :overlays="overlays"
  >
  </trading-vue>
</template>

<script>
import TradingVue from "trading-vue-js";
import Overlays from "tvjs-overlays";

export default {
  name: "app",
  components: { TradingVue },
  methods: {
    onResize() {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
    },
    on_button_click(event) {
      //오버레이 조절
      if (event.button === "up") {
        this.count += 1;
      }
      if (event.button === "down") {
        this.count -= 1;
      }
      const types = ["EMA", "MOM", "BBW", "MFI"];
      const names = [
        "Exponential Moving Average, 20",
        "Momentum, 10",
        "BollingerBandsWidth, 20",
        "Money Flow Index, 14",
      ];
      if (this.count % 4 == 0) {
        this.chart["offchart"][0]["name"] = names[0];
        this.chart["offchart"][0]["type"] = types[0];
        this.chart["offchart"][0]["data"] = this.EMA(this.chart["ohlcv"]);
      }
      if (this.count % 4 == 1) {
        this.chart["offchart"][0]["name"] = names[1];
        this.chart["offchart"][0]["type"] = types[1];
        this.chart["offchart"][0]["data"] = this.MOM(this.chart["ohlcv"]);
      }
      if (this.count % 4 == 2) {
        this.chart["offchart"][0]["name"] = names[2];
        this.chart["offchart"][0]["type"] = types[2];
        this.chart["offchart"][0]["data"] = this.BBW(this.chart["ohlcv"]);
      }
      if (this.count % 4 == 3) {
        this.chart["offchart"][0]["name"] = names[3];
        this.chart["offchart"][0]["type"] = types[3];
        this.chart["offchart"][0]["data"] = this.MFI(this.chart["ohlcv"]);
      }
    },
    SMA(ohlcv) {
      //console.log(ohlcv);
      var data = [];
      var close_data = [];
      let count = 0;
      for (var i = 0; i < ohlcv.length; i++) {
        if (count == 20) {
          const result = close_data.reduce(function add(sum, currValue) {
            return sum + currValue;
          }, 0);
          const average = result / close_data.length;
          data.push([ohlcv[i][0], average]);
          close_data.shift();
          close_data.push(ohlcv[i][4]);
          continue;
        }
        close_data.push(ohlcv[i][4]);
        count++;
      }
      for (var k = 0; k < data.length; k++) {
        //console.log(data[k]);
      }
      return data;
    },
    EMA(ohlcv) {
      //console.log(ohlcv);
      var data = [];
      var close_data = [];
      let count = 0;
      for (var i = 0; i < ohlcv.length; i++) {
        if (count == 20) {
          const result = close_data.reduce(function add(sum, currValue) {
            return sum + currValue;
          }, 0);
          const average = result / close_data.length;
          const multiplier = 2 / 21;
          const EMA = ohlcv[i][4] * multiplier + average * (1 - multiplier);
          data.push([ohlcv[i][0], EMA]);
          close_data.shift();
          close_data.push(ohlcv[i][4]);
          continue;
        }
        close_data.push(ohlcv[i][4]);
        count++;
      }
      for (var k = 0; k < data.length; k++) {
        //console.log(data[k]);
      }
      return data;
    },
    MOM(ohlcv) {
      var data = [];
      var before_data = [];
      let count = 0;
      for (var i = 0; i < ohlcv.length; i++) {
        if (count == 10) {
          const momentum = ohlcv[i][4] / before_data[0];
          data.push([ohlcv[i][0], momentum * 100]);
          before_data.shift();
          before_data.push(ohlcv[i][4]);
          continue;
        }
        before_data.push(ohlcv[i][4]);
        count++;
      }
      for (var k = 0; k < data.length; k++) {
        //console.log(data[k]);
      }
      return data;
    },
    BBW(ohlcv) {
      //console.log(ohlcv);
      var data = [];
      var close_data = [];
      let count = 0;
      for (var i = 0; i < ohlcv.length; i++) {
        if (count == 20) {
          const result = close_data.reduce(function add(sum, currValue) {
            return sum + currValue;
          }, 0);
          const average = result / close_data.length;

          var devTotal = 0; // 편차
          for (var j = 0; j < close_data.length; j++) {
            var dev = close_data[j] - average;
            devTotal += dev * dev;
          }

          var sStdDev = Math.sqrt(devTotal / (close_data.length - 1)); // 표본표준편차
          const upper_limit = average + sStdDev * 2;
          const lower_limit = average - sStdDev * 2;
          data.push([ohlcv[i][0], (upper_limit - lower_limit) / average]);
          close_data.shift();
          close_data.push(ohlcv[i][4]);
          continue;
        }
        close_data.push(ohlcv[i][4]);
        count++;
      }
      for (var k = 0; k < data.length; k++) {
        //console.log(data[k]);
      }
      return data;
    },
    MFI(ohlcv) {
      //console.log(ohlcv);
      var data = [];
      var close_data = [];
      var high_data = [];
      var low_data = [];
      let count = 0;
      for (var i = 0; i < ohlcv.length; i++) {
        if (count == 5) {
          const TP = (ohlcv[i][2] + ohlcv[i][3] + ohlcv[i][4]) / 3;
          var PMF = 0;
          var NMF = 0;
          for (var j = 0; j < close_data.length; j++) {
            const MF = (close_data[j] + high_data[j] + low_data[j]) / 3;
            if (TP < MF) PMF += MF;
            else NMF += MF;
          }
          const MFR = PMF / NMF;
          const MFI = MFR / (1 + MFR);
          data.push([ohlcv[i][0], MFI * 100]);
          close_data.shift();
          high_data.shift();
          low_data.shift();
          close_data.push(ohlcv[i][4]);
          high_data.push(ohlcv[i][2]);
          low_data.push(ohlcv[i][3]);
          continue;
        }
        close_data.push(ohlcv[i][4]);
        high_data.push(ohlcv[i][2]);
        low_data.push(ohlcv[i][3]);
        count++;
      }
      for (var k = 0; k < data.length; k++) {
        //console.log(data[k]);
      }
      return data;
    },
    RSI(ohlcv) {
      //console.log(ohlcv);
      var data = [];
      var close_data = [];
      let count = 0;
      for (var i = 0; i < ohlcv.length; i++) {
        if (count == 20) {
          var AU = 0;
          var AD = 0;
          for (var j = 0; j < close_data.length - 1; j++) {
            const diff = close_data[j + 1] - close_data[j];
            if (diff > 0) AU += diff;
            else AD += diff * -1;
          }
          const RS = AU / AD;
          const RSI = RS / (1 + RS);
          data.push([ohlcv[i][0], RSI * 100]);
          close_data.shift();
          close_data.push(ohlcv[i][4]);
          continue;
        }
        close_data.push(ohlcv[i][4]);
        count++;
      }
      for (var k = 0; k < data.length; k++) {
        //console.log(data[k]);
      }
      return data;
    },
  },
  created() {
    for (var i = 0; i < this.chart["ohlcv"].length; i++) {
      let str = this.chart["ohlcv"][i][0].replaceAll(" ", "");
      str += " 00:00:00";
      //console.log(str);
      this.chart["ohlcv"][i][0] = Math.floor(new Date(str).getTime());
    }
    this.chart["onchart"][0]["data"] = this.SMA(this.chart["ohlcv"]);
    this.chart["offchart"][0]["data"] = this.MFI(this.chart["ohlcv"]);
    // axios
    //   .post("http://127.0.0.1:8000/:stock", {
    //     //스탁 코드를 보내고 정보를 받아오고 그래프 그리기
    //   })
    //   .then((res) => {
    //     console.log(res.data);
    //     this.ohlcv = res.data;
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
  },
  mounted() {
    window.addEventListener("resize", this.onResize);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.onResize);
  },
  data() {
    return {
      count: 1000,
      overlays: [
        Overlays["MOM"],
        Overlays["SMA"],
        Overlays["EMA"],
        Overlays["BBW"],
        Overlays["MFI"],
        Overlays["RSI"],
      ],
      chart: {
        ohlcv: [
          [
            "2022 - 11 - 15",
            4239.4,
            4239.6,
            4079.6,
            4079.63478779,
            2993.45281556,
          ],
          ["2022 - 11 - 16", 4082.2, 4082.2, 4020.2, 4033.5, 3216.95571165],
          [
            "2022 - 11 - 17",
            4035.6,
            4072.78348726,
            3965,
            4055.6,
            2157.50135341,
          ],
          ["2022 - 11 - 18", 4055.6, 4100, 4035, 4059.1719252, 1660.6115119],
          ["2022 - 11 - 19", 4059.1, 4076.6, 4014.1, 4060, 1070.09946267],
          ["2022 - 11 - 20", 4060.5, 4060.5, 3987.2, 4049.2, 1530.46774287],
          ["2022 - 11 - 21", 4049.2, 4092.7, 4035, 4089.6691106, 922.84509291],
          ["2022 - 11 - 22", 4089.9, 4098.6, 4060, 4073.2, 793.81081878],
          ["2022 - 11 - 23", 4073.7, 4084.3, 4045.3, 4049.7, 382.60686566],
          ["2022 - 11 - 24", 4049.9, 4074.5, 4041, 4042.1554296, 587.91082169],
          ["2022 - 11 - 25", 4042.1, 4058.2, 4025, 4031.3, 399.88361961],
          ["2022 - 11 - 26", 4031.3, 4054.8, 3953.5, 4005, 1462.60523159],
          ["2022 - 11 - 27", 4005, 4026.5, 3953.6, 4022.7, 818.53015592],
          ["2022 - 11 - 28", 4022.8, 4065, 4018.9, 4039.5, 971.06384284],
          ["2022 - 11 - 29", 4038.5, 4065, 4010.1, 4052, 726.79477438],
          ["2022 - 11 - 30", 4052.1, 4070.8, 4040.1, 4045, 495.99207452],
          ["2022 - 12 - 1", 4045, 4045.9, 4014.5, 4014.6, 487.14701364],
          ["2022 - 12 - 2", 4014.6, 4041.7, 4005.6, 4031.8, 505.30648465],
          ["2022 - 12 - 3", 4032, 4032, 3986.1, 4008.8, 792.52103654],
          ["2022 - 12 - 4", 4008.8, 4017.1, 3975.8, 4003.7, 489.94574863],
          ["2022 - 12 - 5", 4003.7, 4017.2, 3964.5, 3991.7, 1004.91928605],
          ["2022 - 12 - 6", 3992.6, 4010, 3980.1, 4009.3, 297.78849893],
          ["2022 - 12 - 7", 4009.3, 4061.9, 4007.4, 4025.2, 498.21371364],
          ["2022 - 12 - 8", 4025, 4056.9, 4023.6, 4047, 373.52977661],
          ["2022 - 12 - 9", 4046.9, 4208, 4038.6, 4191.9, 2589.49296961],
          ["2022 - 12 - 10", 4192, 4233.5, 4182.2, 4200, 1875.67597075],
          ["2022 - 12 - 11", 4200, 4268.3, 4199.9, 4216.6, 1197.42649634],
          ["2022 - 12 - 12", 4216.7, 4260.7, 4208.5, 4216.1, 1067.10928935],
          ["2022 - 12 - 13", 4214.9, 4257.6, 4205, 4247.3, 970.81717333],
          ["2022 - 12 - 14", 4247.3, 4264.4, 4230, 4263.9, 869.00302097],
          ["2022 - 12 - 15", 4263, 4340, 4263, 4313.4, 1458.724505],
        ],
        onchart: [
          {
            name: "Simple Moving Average, 20",
            type: "SMA",
            data: [],
            settings: {
              "z-index": 5,
              legend: false,
              color: "#f7890c",
            },
          },
        ],
        offchart: [
          //   {
          //     name: "Relative Strength Index, 20",
          //     type: "RSI",
          //     data: [],
          //     settings: {
          //       color: "#f7890c",
          //     },
          //   },
          {
            name: "Money Flow Index, 14",
            type: "MFI",
            data: [],
            settings: {
              color: "#2cc6c9ab",
              backColor: "#2cc6c90a",
            },
          },
        ],
      },
      width: window.innerWidth,
      height: window.innerHeight,
      colors: {
        colorBack: "#fff",
        colorGrid: "#eee",
        colorText: "#333",
      },
    };
  },
};
</script>
