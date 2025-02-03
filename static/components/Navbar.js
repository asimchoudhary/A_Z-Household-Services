export default {
  template: `<nav class="navbar navbar-expand-lg bg-body-tertiary">
  <div class="container-fluid">
    <a class="navbar-brand" href="#">HHS App</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse justify-content-end" id="navbarNav">
      <ul class="navbar-nav">
        <li class="nav-item">
          <a class="nav-link active" aria-current="page" href="#">Home</a>
        </li>
        <li class="nav-item">
          <router-link class="nav-link" :to="searchRoute" v-if="role!='prof'">Search</router-link>
        </li>
       
        <li class="nav-item" v-if="role=='admin'">
          <router-link class="nav-link" to="/createNewService">Add Service</router-link>
        </li>
        <li class="nav-item text-end" v-if="is_login">
          <button class="nav-link btn btn-danger " @click="logout" >Logout</button>
        </li>
        
      </ul>
    </div>
  </div>
</nav>`,

  data() {
    return {
      role: localStorage.getItem("role"),
    };
  },
  methods: {
    logout() {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      this.$router.push("/");
    },
  },
  // ! Why logout button is not appearning without reload ?
  computed: {
    is_login() {
      return localStorage.getItem("token") ? true : false;
    },
    searchRoute() {
      switch (this.role) {
        case "admin":
          return "/admin-search";
        case "cust":
          return "/cust-search";
        case "prof":
          return "/prof-search";
        default:
          return "/login";
      }
    },
  },
};
