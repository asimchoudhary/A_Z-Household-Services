import router from "./router.js";
import Navbar from "./components/Navbar.js";

router.beforeEach((to, from, next) => {
  if (to.name != "Login" && !localStorage.getItem("token") ? true : false) {
    next({ name: "Login" });
  } else {
    next();
  }
});

new Vue({
  el: "#app",
  template: `<div>
  <router-view class="m-3"/>
  </div>`,
  router,
  components: {
    Navbar,
  },
  data() {
    return {
      is_changed: true,
    };
  },
  watch: {
    $route(to, from) {
      this.is_changed = !this.is_changed;
    },
  },
});
