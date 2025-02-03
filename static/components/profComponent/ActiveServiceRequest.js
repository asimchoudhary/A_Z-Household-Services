export default {
  template: `<div>
        <div v-if="serviceRequests.length==0">No Earning Oppurtunity Yet!</div>
        <div v-else>
            <table class="table table-secondary">
                <thead>
                    <tr>
                        <th v-for="column in column_headers">{{column}}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="serviceRequest in serviceRequests">
                        <td v-for="header in serviceRequest_headers">{{serviceRequest[header]}}</td>
                        <td><button class="btn btn-primary mr-3" @click="acceptServiceRequest(serviceRequest['id'])">Accept</button></td>
                    </tr>

                </tbody>
            </table>
        </div>
    </div>
    `,
  data() {
    return {
      serviceRequests: [],
      prof_id: localStorage.getItem("id"),
      column_headers: [
        "Service Request ID",
        "Service Name",
        "Customer Name",
        "Price",
        "Action",
      ],
      serviceRequest_headers: ["id", "service_name", "customer_name", "price"],
    };
  },
  async mounted() {
    const res = await fetch("/get-serviceRequests", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prof_id: this.prof_id }),
    });
    const data = await res.json();
    this.serviceRequests = data;
  },
  methods: {
    async acceptServiceRequest(serviceRequestID) {
      const res = await fetch("/accept-serviceRequest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          service_request_id: serviceRequestID,
          prof_id: this.prof_id,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        alert("Congrats , on accepting the service request");
        this.$router.go(0);
      } else {
        alert("Something happend wrong");
      }
    },
  },
};
