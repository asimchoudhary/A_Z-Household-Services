export default {
  template: `<div>
        <h4>Add new Service</h4>
        <form @submit.prevent="createService">
            <label for="name">Name:  </label>
            <input type="text" id="name" name="name" v-model="service.name" />
            <br>
            <label for="description">Description: </label>
            <input type="text" id="description" name="description" v-model="service.description" />
            <br>
            <label for="price">Price:</label>
            <input type="number" id="price" name="price" v-model="service.price" />
            <br>
            <label for="time_required">Time Required:</label>
            <input type="text" id="time_required" name="time_required" v-model="service.time_required" />
            <br>
            <button type="submit"> Add Service</button>
        </form>
        </div>
    `,
  data() {
    return {
      service: {
        name: "",
        description: "",
        price: "",
        time_required: "",
      },
      token: localStorage.getItem("token"),
    };
  },
  methods: {
    async createService() {
      const res = await fetch("/api/serviceResource", {
        method: "POST",
        headers: {
          "Authentication-Token": this.token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(this.service),
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        this.$router.push({ path: "/admin-home" });
      }
    },
  },
};
