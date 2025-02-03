export default {
  template: `
    <div>
        <div v-if="services.length==0" >No Request Yet!</div>
        <div v-else>
            <table class="table mt-2 table-secondary">
                <thead>
                    <tr>
                        <th scope="col" v-for="(column ,index) in column_headers" :key="index">{{column}}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(service, index) in services" :key="index" >
                        <td v-for="(column, index) in service_headers" :key="index">{{service[column]}}</td>
                        <router-link class="btn btn-warning" v-if="service['service_status']=='accepted'" :to="{ name: 'CloseService', params: { id: service.id } }">Close it?</router-link>
                        <button class="btn btn-danger" v-if="service['service_status']=='requested'" @click="deleteRequest(service.id)">Delete</button>
                    </tr>
                </tbody>
            </table>

        </div>
    </div>
    `,
  data() {
    return {
      user_id: localStorage.getItem("id"),
      column_headers: [
        "ID",
        "Service Name",
        "Professional Name",
        "Experience in years",
        "Status",
        "Action",
      ],
      services: [],
      service_headers: [
        "id",
        "service_name",
        "professional_name",
        "exp_in_years",
        "service_status",
      ],
    };
  },
  async mounted() {
    const res = await fetch("/get-serviceHistory", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: this.user_id,
      }),
    });
    const data = await res.json();
    if (res.ok) {
      this.services = data;
    } else {
      alert("Some error occured");
    }
  },
  methods: {
    async deleteRequest(service_id) {
      try {
        const res = await fetch(`/delete-serviceRequest/${service_id}`, {
          method: "GET",
          headers: {
            "Authentication-Token": localStorage.getItem("token"),
          },
        });
        const data = await res.json();
        if (res.ok) {
          alert("Service request deleted successfully");
          this.$router.go(0);
        } else {
          alert("Some error occurred");
        }
      } catch (error) {
        console.error("Error:", error);
        alert("Some error occurred");
      }
    },
  },
};
