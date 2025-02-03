export default {
  template: `<div>
    <p class="h3">Edit Service</p>
    <form @submit.prevent="updateService">
      <div>
        <label for="name">Name:</label>
        <input type="text" v-model="serviceData.name" id="name">
      </div>
      <div>
        <label for="price">Price:</label>
        <input type="number" v-model="serviceData.price"  id="name">
      </div>
      <div>
        <label for="time_required">Time Required:</label>
        <input type="text" v-model="serviceData.time_required" id="name">
      </div>
      <div>
        <label for="description">Description:</label>
        <input type="text" v-model="serviceData.description"id="name" >
      </div>
      <button class="btn btn-primary" type="submit">Update </button>
    </form>
    </div>`,
  data() {
    return {
      token: localStorage.getItem("token"),
      service_id: this.$route.params.id,
      serviceData: {
        name: "",
        price: "",
        time_required: "",
        description: "",
      },
    };
  },
  async mounted() {
    const res = await fetch(`/api/serviceResource/${this.service_id}`, {
      method: "GET",
      headers: {
        "Authentication-Token": this.token,
      },
    });
    const data = await res.json();
    this.serviceData = data;
  },
  methods: {
    async updateService() {
      const res = await fetch(`/api/serviceResource/${this.service_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authentication-Token": this.token,
        },
        body: JSON.stringify(this.serviceData),
      });
      const data = await res.json();
      if (res.ok) {
        alert("service updated");
        this.$router.push({ name: "AdminHome" });
      } else {
        alert("Not updated, Error");
      }
    },
  },
};
