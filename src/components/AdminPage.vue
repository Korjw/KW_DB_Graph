<template>
  <div class="gap-10 max-w-[100rem] sticky top-0">
    <div class="flex flex-col-reverse gap-10">
      <!-- NOTE: list view -->

      <div class="flex gap-10 justify-between">
        <div
          class="w-full p-4 bg-white border rounded-lg shadow-md sm:p-8 dark:bg-gray-800 dark:border-gray-700"
        >
          <div>
            <h5
              class="text-2xl font-bold leading-none text-gray-900 dark:text-white"
            >
              주식 정보 관리
            </h5>
          </div>
          <div class="my-3">
            <label
              for="submit_type"
              class="block mb-2 text-xl font-bold text-gray-900 dark:text-gray-400"
            >
              등록/변경
            </label>
            <select
              id="submit_type"
              v-model="stock_info['submit_type']"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-l rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            >
              <option value="" selected disabled hidden>선택</option>
              <option value="등록">등록</option>
              <option value="변경">변경</option>
            </select>
          </div>
          <div class="my-3">
            <label
              for="stock_code"
              class="block mb-2 text-xl font-bold text-gray-900 dark:text-white"
              >주식코드</label
            >
            <input
              type="text"
              v-model="stock_info['stock_code']"
              id="stock_code"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-l rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="0"
              required
            />
          </div>
          <div class="my-3">
            <label
              for="stock_name "
              class="block mb-2 text-xl font-bold text-gray-900 dark:text-white"
              >주식이름</label
            >
            <input
              type="text"
              v-model="stock_info['stock_name']"
              id="stock_name"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-l rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="삼성전자"
              required
            />
          </div>

          <div class="my-3">
            <label
              for="stock_amount"
              class="block mb-2 text-xl font-bold text-gray-900 dark:text-white"
              >주식수</label
            >
            <input
              type="text"
              v-model="stock_info['stock_amount']"
              id="stock_amount"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-l rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="0"
              required
            />
          </div>
          <div class="my-3">
            <label
              for="cop_info"
              class="block mb-2 text-xl font-bold text-gray-900 dark:text-white"
              >기업정보</label
            >
            <textarea
              id="cop_info"
              v-model="stock_info['cop_info']"
              rows="4"
              class="block p-2.5 w-full text-l text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="기업정보"
            ></textarea>
          </div>

          <div class="my-3">
            <label
              for="market"
              class="block mb-2 text-xl font-bold text-gray-900 dark:text-white"
              >주식시장</label
            >
            <input
              type="text"
              v-model="stock_info['market']"
              id="market"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-l rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="KOSPI 500"
              required
            />
          </div>

          <div>
            <button
              v-on:click="submit_stock"
              class="text-white font-bold bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              입력
            </button>
          </div>
        </div>
        <div class="gap-5 min-w-[50rem] max-h-[40rem]">
          <div
            class="w-full p-4 bg-white border rounded-lg shadow-md sm:p-8 dark:bg-gray-800 dark:border-gray-700"
          >
            <h5
              class="text-2xl font-bold leading-none text-gray-900 dark:text-white"
            >
              미승인 유저
            </h5>
            <div class="overflow-y-auto relative h-96 shadow-md sm:rounded-lg">
              <table
                class="my-3 w-full text-sm text-left text-gray-500 dark:text-gray-400"
              >
                <thead
                  class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
                >
                  <tr>
                    <th scope="col" class="text-xl py-3 px-6">유저 아이디</th>
                    <th scope="col" class="text-xl py-3 px-6">유저 이름</th>
                    <th scope="col" class="text-xl py-3 px-6">승인</th>
                    <th scope="col" class="text-xl py-3 px-6">거절</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="user in users_info"
                    :key="user.idx"
                    class="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                  >
                    <th
                      scope="row"
                      class="py-4 px-6 font-bold text-xl text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      {{ user["id"] }}
                    </th>
                    <td
                      class="py-4 px-6 font-bold text-xl text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      {{ user["user_name"] }}
                    </td>

                    <td class="py-4 px-6">
                      <button
                        v-on:click="submit_user(user)"
                        class="text-white font-bold bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                      >
                        승인
                      </button>
                    </td>
                    <td class="py-4 px-6">
                      <button
                        v-on:click="decline_user(user)"
                        class="text-white font-bold bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
                      >
                        거절
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "app",
  components: {},
  methods: {
    submit_stock() {
      axios
        .post("http://127.0.0.1:3000/api/stock/submit/", {
          submit_type: this.stock_info["submit_type"],
          stock_code: this.stock_info["stock_code"],
          stock_name: this.stock_info["stock_name"],
          stock_amount: this.stock_info["stock_amount"],
          cop_info: this.stock_info["cop_info"],
          market: this.stock_info["market"],
        })
        .then((res) => {
          console.log(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    submit_user(user) {
      console.log(user["id"]);
      console.log(user["user_name"]);
      axios
        .post("http://127.0.0.1:3000/api/user/submit/", {
          id: user["id"],
          user_name: user["user_name"],
        })
        .then((res) => {
          console.log(res.data);
          axios
            .get("http://127.0.0.1:3000/api/user/info/pending/", {})
            .then((res) => {
              console.log(res.data);
              this.user_info = res.data;
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    decline_user(user) {
      console.log(user["id"]);
      console.log(user["user_name"]);
      axios
        .post("http://127.0.0.1:3000/api/user/decline/", {
          id: user["id"],
          user_name: user["user_name"],
        })
        .then((res) => {
          console.log(res.data);
          axios
            .get("http://127.0.0.1:3000/api/user/info/pending/", {})
            .then((res) => {
              console.log(res.data);
              this.user_info = res.data;
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  created() {
    axios
      .get("http://127.0.0.1:3000/api/user/info/pending/", {})
      .then((res) => {
        console.log(res.data);
        this.user_info = res.data;
      })
      .catch((err) => {
        console.log(err);
      });
  },
  mounted() {},
  data() {
    return {
      stock_info: {
        submit_type: "",
        stock_code: 0,
        stock_name: "",
        stock_amount: 0,
        cop_info: "",
        market: "",
      },
      users_info: [
        {
          id: "1",
          user_name: "a",
        },
        {
          id: "2",
          user_name: "b",
        },
        {
          id: "3",
          user_name: "c",
        },
        {
          id: "4",
          user_name: "d",
        },
        {
          id: "1",
          user_name: "a",
        },
        {
          id: "2",
          user_name: "b",
        },
        {
          id: "3",
          user_name: "c",
        },
        {
          id: "4",
          user_name: "d",
        },
        {
          id: "1",
          user_name: "a",
        },
        {
          id: "2",
          user_name: "b",
        },
        {
          id: "3",
          user_name: "c",
        },
        {
          id: "4",
          user_name: "d",
        },
      ],
    };
  },
};
</script>
