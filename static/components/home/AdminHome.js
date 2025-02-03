import Navbar from "../Navbar.js";
import ServiceTable from "../tables/ServiceTable.js";
import ProfessionalTable from "../tables/ProfessionalTable.js";
import CustomerTable from "../tables/CustomerTable.js";
import Csv from "../adminComponents/Csv.js";
// TODO Service professional verification of documents by viewing them

export default {
  template: `<div>
  <Navbar/>
  <Csv/>

  <p class="h4 text-center mt-3">Services</p>
  <div class="text-center" v-if="services.length==0">There are no services yet</div>
  <div v-else>
    <ServiceTable :columns="service_headers" :rows_data="services" />
  </div>
  <p class="h4 text-center mt-3">Professionals</p>
  <div class="text-center" v-if="users.length==0">There are no professionals yet</div>
  <div v-else>
    <ProfessionalTable :columns="professional_headers" :rows_data="users" />
  </div>
  <p class="h4 text-center mt-3">Customers</p>
  <div class="text-center" v-if="users.length==0">There are no customers</div>
  <div v-else>
    <CustomerTable :columns="customer_headers" :rows_data="users" />
  </div>
  </div>`,
  components: {
    Navbar,
    ServiceTable,
    ProfessionalTable,
    CustomerTable,
    Csv,
  },
  data() {
    return {
      token: localStorage.getItem("token"),
      services: [],
      service_headers: ["id", "name", "price"],
      users: [],
      professional_headers: ["id", "username", "exp_in_years", "service_name"],
      customer_headers: ["id", "username", "address"],
    };
  },
  async mounted() {
    const res = await fetch("/api/serviceResource", {
      method: "GET",
      headers: {
        "Authentication-Token": this.token,
      },
    });
    const data = await res.json();
    if (res.ok) {
      this.services = data;
      console.log(data[0]["time_required"]);
    } else {
      alert("Some errror found");
    }
    const res2 = await fetch("/api/userResource", {
      method: "GET",
      headers: {
        "Authentication-Token": this.token,
      },
    });
    const data2 = await res2.json();
    if (res2.ok) {
      this.users = data2;
    } else {
      alert("some error found");
    }
  },
};
