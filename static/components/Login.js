export default {
  template: `
  <div>
    <div class="bg-light" style="display: flex; justify-content: center; align-items: center; height: 70vh;">
      <form @submit.prevent="login">
      <div class="mb-3">
      <label for="user-email" class="form-label">Email address</label>
      <input type="email" class="form-control" id="user-email" v-model="cred.email">
      </div>
      <div class="mb-3">
      <label for="user-password" class="form-label">Password</label>
      <input type="password" class="form-control" id="user-password" v-model="cred.password">
      </div>
      <button type="submit" class="btn btn-primary">Submit</button>
      </form>
    </div>
  <p class="mt-3 text-center">  <router-link to="/user-register"> Create Account </router-link> </p>
  <p class="mt-3 text-center">  <router-link to="/professional-register"> Register as Professional </router-link> </p>
  </div>`,
  data() {
    return {
      cred: {
        email: null,
        password: null,
      },
    };
  },
  methods: {
    async login() {
      const res = await fetch("/user-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(this.cred),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);
        localStorage.setItem("id", data.id);
        if (data.role == "admin") {
          this.$router.push("/admin-home");
        } else if (data.role == "cust") {
          this.$router.push("/cust-home");
        } else {
          this.$router.push("/prof-home");
        }
      } else {
        alert(data.message);
      }
    },
  },
};
