export default {
  template: `
    <div>
        <p class="h3 text-center"> Register as Professional </p>
            <div class="bg-light" style="display: flex; justify-content: center; align-items: center;">
                <form @submit.prevent="registerProf">
                        <div class="mb-3 mt-3">
                                <label for="prof-email" class="form-label">Email address</label>
                                <input type="email" name = "email" class="form-control" id="prof-email" v-model="prof.email">
                        </div>
                        <div class="mb-3">
                                <label for="prof-password" class="form-label">Password</label>
                                <input type="password" name="password" class="form-control" id="prof-password" v-model="prof.password">
                        </div>
                        <div class="mb-3">
                                <label for="prof-username" class="form-label">Username</label>
                                <input type="text" class="form-control" name="username" id="prof-username" v-model="prof.username">
                        </div>
                        <div class="mb-3">
                                <label for="prof-address" class="form-label">Address</label>
                                <input type="text" class="form-control" name="address" id="prof-address" v-model="prof.address">
                        </div>
                        <div class="mb-3">
                                <label for="prof-pincode" class="form-label">Pincode</label>
                                <input type="text" class="form-control" name="pincode" id="prof-pincode" v-model="prof.pincode">
                        </div>
                        <div class="mb-3">
                            <label for="prof-exp-in-years" class="form-label">Years of Experience</label>
                            <input type="text" class="form-control" name="exp_in_years" id="prof-exp-in-years" v-model="prof.exp_in_years">
                        </div>
                        <div class="mb-3">
                            <label for="prof-service-name" class="form-label">Service Name</label>
                            <select name="service_name" id="prof-service-name" v-model="prof.service_name">
                                <option value="Electrician">Electrician</option>
                                <option value="Plumber">Plumber</option>
                                <option value="Carpenter">Carpenter</option>
                                <option value="Painter">Painter</option>
                        </div>
                        
                        <button type="submit" class="btn btn-primary">Submit</button>
                </form>
            </div>
    </div>
    `,
  data() {
    return {
      prof: {
        email: null,
        password: null,
        username: null,
        address: null,
        pincode: null,
        role: "prof",
        exp_in_years: null,
        service_name: null,
      },
    };
  },
  methods: {
    async registerProf() {
      const res = await fetch("/api/userResource", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(this.prof),
      });
      const data = await res.json();
      if (res.ok) {
        alert("Professional Register Successfully");
        this.$router.push("/");
      } else {
        alert(data.message);
        this.$router.push("/");
      }
    },
  },
};
