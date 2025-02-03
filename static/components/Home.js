import Login from "./Login.js";
export default {
  template: `<div>
    <p class="h3 text-center text-primary"> Welcome to A_Z HouseHold Service </p>
    <Login/>

  </div>`,
  data() {
    return {
      userRole: localStorage.getItem("role"),
    };
  },
  components: {
    Login,
  },
};
