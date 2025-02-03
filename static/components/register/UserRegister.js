export default {
  template: `
        <div>
            <p class="h3 text-center"> Register as Customer </p>
            <div class="bg-light" style="display: flex; justify-content: center; align-items: center;">
                <form @submit.prevent="registerUser">
                    <div class="mb-3 mt-3">
                        <label for="user-email" class="form-label">Email address</label>
                        <input type="email" class="form-control" id="user-email" v-model="user.email">
                    </div>
                    <div class="mb-3">
                        <label for="user-password" class="form-label">Password</label>
                        <input type="password" class="form-control" id="user-password" v-model="user.password">
                    </div>
                    <div class="mb-3">
                        <label for="user-username" class="form-label">Username</label>
                        <input type="text" class="form-control" id="user-username" v-model="user.username">
                    </div>
                    <div class="mb-3">
                        <label for="user-address" class="form-label">Address</label>
                        <input type="text" class="form-control" id="user-address" v-model="user.address">
                    </div>
                    <div class="mb-3">
                        <label for="user-pincode" class="form-label">Pincode</label>
                        <input type="text" class="form-control" id="user-pincode" v-model="user.pincode">
                    </div>
                    <button type="submit" class="btn btn-primary">Submit</button>
                </form>
            </div>
        </div>
    `,
  data() {
    return {
      user: {
        email: null,
        password: null,
        username: null,
        address: null,
        pincode: null,
        role: "cust",
      },
    };
  },
  methods: {
    async registerUser() {
      const res = await fetch("/api/userResource", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(this.user),
      });
      if (res.ok) {
        const data = await res.json();
        if (res.ok) {
          alert("Registered Successfully");
          this.$router.push({ path: "/" });
        } else {
          alert(data.message);
        }
      }
    },
  },
};
