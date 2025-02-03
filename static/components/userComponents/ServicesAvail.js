export default {
  template: `
  <div>
    <table class="table mt-2 table-secondary">
  <thead>
    <tr>
        <th scope="col" v-for="(column ,index) in column_headers" :key="index">{{column}}</th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="(service, index) in filteredServices" :key="index" >
        <td v-for="(column, index) in service_headers" :key="index">{{service[column]}}</td>
        <td><button class="btn btn-primary "@click="bookService(service['id'])">Book</button>
        </td>
    </tr>
  </tbody>
    </table>
  </div >`,
  data() {
    return {
      token: localStorage.getItem("token"),
      user_id: localStorage.getItem("id"),
      services: [],
      service_headers: ["id", "name", "description", "price", "time_required"],
      column_headers: [
        "ID",
        "Service Name",
        "Service Description",
        "Service Cost",
        "Service Duration",
        "Action",
      ],
    };
  },
  props: {
    serviceName: {
      type: String,
      default: "",
    },
  },
  computed: {
    filteredServices() {
      if (this.serviceName == "") return this.services;
      return this.services.filter((service) =>
        service.name.toLowerCase().includes(this.serviceName.toLowerCase())
      );
    },
  },
  async mounted() {
    const res = await fetch("/get-services", {
      method: "GET",
      headers: {
        "Authentication-Token": this.token,
      },
    });
    const data = await res.json();
    if (res.ok) {
      this.services = data;
      console.log(this.services[0]["name"]);
    } else {
      console.log("error");
      alert("Some error occured");
    }
  },
  methods: {
    async bookService(service_id) {
      const res = await fetch("/create-serviceRequest", {
        method: "POST",
        headers: {
          "Authentication-Token": this.token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          service_id: service_id,
          user_id: this.user_id,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        alert("Service booked successfully");
        this.$router.go(0);
      } else {
        alert("Some error occured");
      }
    },
  },
};
