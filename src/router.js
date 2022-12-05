import VueRouter from "vue-router";

const route = [
  // path별 component를 추가한다.
  {
    path: "/stock/price/:stock_code",
    component: () => import("@/components/TradingVue.vue"),
  },
  {
    path: "/admin",
    component: () => import("@/components/AdminPage.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  routes: route,
});

export default router;
