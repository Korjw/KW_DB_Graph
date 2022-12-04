<template>
  <div class="gap-10 max-w-[64rem] sticky top-0">
    <div id="card">
      <a
        href="#"
        class="block p-6 bg-white border border-gray-200 rounded-lg shadow-md hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
      >
        <h5
          class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white"
        >
          {{ corp["cop_name"] }} ({{ corp["market"] }})
        </h5>
        <p class="font-normal text-gray-700 dark:text-gray-400">
          {{ corp["cop_info"] }}
        </p>
      </a>
    </div>

    <div class="flex flex-col-reverse md:flex-row gap-10">
      <!-- NOTE: list view -->

      <div class="flex gap-10 justify-between">
        <div id="chart">
          <trading-vue
            :data="this.chart"
            :color-back="colors.colorBack"
            :color-grid="colors.colorGrid"
            :color-text="colors.colorText"
            :legend-buttons="['up', 'down']"
            v-on:legend-button-click="on_button_click"
            :overlays="overlays"
          >
          </trading-vue>
        </div>

        <!-- sidebar -->
        <div class="flex flex-col gap-5 min-w-[40rem] max-h-[42rem]">
          주식거래 창 사고팔기
        </div>
      </div>
    </div>

    <div id="information">
      <footer
        class="p-4 bg-white rounded-lg shadow md:px-6 md:py-8 dark:bg-gray-900"
      >
        <div class="sm:flex sm:items-center sm:justify-between">
          <span
            class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white"
            >{{ corp["cop_name"] }} 총 주식량 : {{ corp["stock_amount"] }}</span
          >
        </div>
        <div class="sm:flex sm:items-center sm:justify-between">
          <span
            class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white"
            >{{ corp["cop_name"] }} 주식 보유자 :
            {{ corp["stockholder_name"] }}</span
          >
        </div>
        <div class="sm:flex sm:items-center sm:justify-between">
          <span
            class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white"
            >{{ corp["cop_name"] }} 보유 주식량 :
            {{ corp["stock_holding_amount"] }}</span
          >
        </div>
        <div class="sm:flex sm:items-center sm:justify-between">
          <span
            class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white"
            >{{ corp["cop_name"] }} 보유 주식 비율 :
            {{ corp["stock_holding_ratio"] }}</span
          >
        </div>
      </footer>
    </div>
  </div>
</template>

<script>
import TradingVue from "trading-vue-js";
import Overlays from "tvjs-overlays";
import axios from "axios";

export default {
  name: "app",
  components: { TradingVue },
  methods: {
    on_button_click(event) {
      if (event.button === "up") {
        this.count += 1;
      }
      if (event.button === "down") {
        this.count -= 1;
      }
      const types = ["EMA", "MOM", "BBW", "MFI", "RSI", "SMA"];
      const names = [
        "Exponential Moving Average, 20",
        "Momentum, 10",
        "Bollinger Bands Width, 20",
        "Money Flow Index, 14",
        "Relative Strength Index, 20",
        "Simple Moving Average, 20",
      ];
      if (this.count % 6 == 0) {
        this.chart["offchart"][0]["name"] = names[0];
        this.chart["offchart"][0]["type"] = types[0];
        this.chart["offchart"][0]["data"] = this.EMA(this.chart["ohlcv"]);
      }
      if (this.count % 6 == 1) {
        this.chart["offchart"][0]["name"] = names[1];
        this.chart["offchart"][0]["type"] = types[1];
        this.chart["offchart"][0]["data"] = this.MOM(this.chart["ohlcv"]);
      }
      if (this.count % 6 == 2) {
        this.chart["offchart"][0]["name"] = names[2];
        this.chart["offchart"][0]["type"] = types[2];
        this.chart["offchart"][0]["data"] = this.BBW(this.chart["ohlcv"]);
      }
      if (this.count % 6 == 3) {
        this.chart["offchart"][0]["name"] = names[3];
        this.chart["offchart"][0]["type"] = types[3];
        this.chart["offchart"][0]["data"] = this.MFI(this.chart["ohlcv"]);
      }
      if (this.count % 6 == 4) {
        this.chart["offchart"][0]["name"] = names[4];
        this.chart["offchart"][0]["type"] = types[4];
        this.chart["offchart"][0]["data"] = this.RSI(this.chart["ohlcv"]);
      }
      if (this.count % 6 == 5) {
        this.chart["offchart"][0]["name"] = names[5];
        this.chart["offchart"][0]["type"] = types[5];
        this.chart["offchart"][0]["data"] = this.SMA(this.chart["ohlcv"]);
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
    BB(ohlcv) {
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
          data.push([
            ohlcv[i][0],
            lower_limit,
            (upper_limit - lower_limit) / average,
            upper_limit,
          ]);
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
    axios
      .post("http://127.0.0.1:3000/api/stock/info/", {
        stock_code: this.stock_code,
      })
      .then((res) => {
        console.log(res.data);
        this.corp = res.data;
      })
      .catch((err) => {
        console.log(err);
      });
    axios
      .post("http://127.0.0.1:3000/api/stock/price/", {
        stock_code: this.stock_code,
      })
      .then((res) => {
        console.log(res.data);
        for (var i = 0; i < res.data.length; i++) {
          this.chart["ohlcv"] = [];
          this.chart["ohlcv"].push([
            res.data["price_date"],
            res.data["open_price"],
            res.data["max_price"],
            res.data["min_price"],
            res.data["close_price"],
            res.data["volume"],
          ]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
    console.log(this.stock_code);
    for (var i = 0; i < this.chart["ohlcv"].length; i++) {
      let str = this.chart["ohlcv"][i][0].replaceAll("T15:00:00.000Z", "");
      str += " 00:00:00";
      //console.log(str);
      this.chart["ohlcv"][i][0] = Math.floor(new Date(str).getTime());
    }
    this.chart["onchart"][0]["data"] = this.BB(this.chart["ohlcv"]);
    this.chart["offchart"][0]["data"] = this.MFI(this.chart["ohlcv"]);
  },
  mounted() {
    window.addEventListener("resize", this.onResize);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.onResize);
  },
  data() {
    return {
      stock_code: window.location.href.split("/")[5],
      corp: {
        stock_code: "005930",
        cop_name: "삼성전자",
        stock_amount: 596978255,
        cop_info:
          "한국 및 DX부문 해외 9개 지역총괄과 DS부문 해외 5개 지역총괄, SDC, Harman 등 233개의 종속기업으로 구성된 글로벌 전자기업임.",
        market: "KOSPI 500",
        stockholder_name: "삼성생명보험 외 15인",
        stock_holding_amount: 1241176035,
        stock_holding_ratio: 20.79,
      },
      count: 1000,
      overlays: [
        Overlays["MOM"],
        Overlays["SMA"],
        Overlays["EMA"],
        Overlays["BBW"],
        Overlays["MFI"],
        Overlays["RSI"],
        Overlays["BB"],
      ],
      chart: {
        ohlcv: [
          [
            "2022-11-15T15:00:00.000Z",
            4239.4,
            4239.6,
            4079.6,
            4079.63478779,
            2993.45281556,
          ],
          [
            "2022-11-16T15:00:00.000Z",
            4082.2,
            4082.2,
            4020.2,
            4033.5,
            3216.95571165,
          ],
          [
            "2022-11-17T15:00:00.000Z",
            4035.6,
            4072.78348726,
            3965,
            4055.6,
            2157.50135341,
          ],
          [
            "2022-11-18T15:00:00.000Z",
            4055.6,
            4100,
            4035,
            4059.1719252,
            1660.6115119,
          ],
          [
            "2022-11-19T15:00:00.000Z",
            4059.1,
            4076.6,
            4014.1,
            4060,
            1070.09946267,
          ],
          [
            "2022-11-20T15:00:00.000Z",
            4060.5,
            4060.5,
            3987.2,
            4049.2,
            1530.46774287,
          ],
          [
            "2022-11-21T15:00:00.000Z",
            4049.2,
            4092.7,
            4035,
            4089.6691106,
            922.84509291,
          ],
          [
            "2022-11-22T15:00:00.000Z",
            4089.9,
            4098.6,
            4060,
            4073.2,
            793.81081878,
          ],
          [
            "2022-11-23T15:00:00.000Z",
            4073.7,
            4084.3,
            4045.3,
            4049.7,
            382.60686566,
          ],
          [
            "2022-11-24T15:00:00.000Z",
            4049.9,
            4074.5,
            4041,
            4042.1554296,
            587.91082169,
          ],
          [
            "2022-11-25T15:00:00.000Z",
            4042.1,
            4058.2,
            4025,
            4031.3,
            399.88361961,
          ],
          [
            "2022-11-26T15:00:00.000Z",
            4031.3,
            4054.8,
            3953.5,
            4005,
            1462.60523159,
          ],
          [
            "2022-11-27T15:00:00.000Z",
            4005,
            4026.5,
            3953.6,
            4022.7,
            818.53015592,
          ],
          [
            "2022-11-28T15:00:00.000Z",
            4022.8,
            4065,
            4018.9,
            4039.5,
            971.06384284,
          ],
          [
            "2022-11-29T15:00:00.000Z",
            4038.5,
            4065,
            4010.1,
            4052,
            726.79477438,
          ],
          [
            "2022-11-30T15:00:00.000Z",
            4052.1,
            4070.8,
            4040.1,
            4045,
            495.99207452,
          ],
          [
            "2022-12-01T15:00:00.000Z",
            4045,
            4045.9,
            4014.5,
            4014.6,
            487.14701364,
          ],
          [
            "2022-12-02T15:00:00.000Z",
            4014.6,
            4041.7,
            4005.6,
            4031.8,
            505.30648465,
          ],
          [
            "2022-12-03T15:00:00.000Z",
            4032,
            4032,
            3986.1,
            4008.8,
            792.52103654,
          ],
          [
            "2022-12-04T15:00:00.000Z",
            4008.8,
            4017.1,
            3975.8,
            4003.7,
            489.94574863,
          ],
          [
            "2022-12-05T15:00:00.000Z",
            4003.7,
            4017.2,
            3964.5,
            3991.7,
            1004.91928605,
          ],
          [
            "2022-12-06T15:00:00.000Z",
            3992.6,
            4010,
            3980.1,
            4009.3,
            297.78849893,
          ],
          [
            "2022-12-07T15:00:00.000Z",
            4009.3,
            4061.9,
            4007.4,
            4025.2,
            498.21371364,
          ],
          [
            "2022-12-08T15:00:00.000Z",
            4025,
            4056.9,
            4023.6,
            4047,
            373.52977661,
          ],
          [
            "2022-12-09T15:00:00.000Z",
            4046.9,
            4208,
            4038.6,
            4191.9,
            2589.49296961,
          ],
          [
            "2022-12-10T15:00:00.000Z",
            4192,
            4233.5,
            4182.2,
            4200,
            1875.67597075,
          ],
          [
            "2022-12-11T15:00:00.000Z",
            4200,
            4268.3,
            4199.9,
            4216.6,
            1197.42649634,
          ],
          [
            "2022-12-12T15:00:00.000Z",
            4216.7,
            4260.7,
            4208.5,
            4216.1,
            1067.10928935,
          ],
          [
            "2022-12-13T15:00:00.000Z",
            4214.9,
            4257.6,
            4205,
            4247.3,
            970.81717333,
          ],
          [
            "2022-12-14T15:00:00.000Z",
            4247.3,
            4264.4,
            4230,
            4263.9,
            869.00302097,
          ],
          ["2022-12-15T15:00:00.000Z", 4263, 4340, 4263, 4313.4, 1458.724505],
        ],
        onchart: [
          {
            name: "Bollinger Bands, 20",
            type: "BB",
            data: [],
            settings: {
              "z-index": 5,
              legend: false,
              color: "#2cc6c9ab",
              backColor: "#2cc6c90a",
            },
          },
          // {
          //   name: "Simple Moving Average, 20",
          //   type: "SMA",
          //   data: [],
          //   settings: {
          //     "z-index": 5,
          //     legend: false,
          //     color: "#f7890c",
          //   },
          // },
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
      colors: {
        colorBack: "#fff",
        colorGrid: "#eee",
        colorText: "#333",
      },
    };
  },
};
</script>
