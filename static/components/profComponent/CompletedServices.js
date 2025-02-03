export default {
  template: `
    <div>

        <div v-if="approvedServiceRequests.length===0">No Closed service yet!</div>
        <div v-else>
            <table class="table table-secondary">
                <thead>
                    <tr>
                        <th v-for="column in column_headers_1">{{column}}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="serviceRequest in approvedServiceRequests">
                        <td>{{serviceRequest.id}}</td>
                        <td>{{serviceRequest.service_name}}</td>
                        <td>{{serviceRequest.customer_name}}</td>
                        <td>{{serviceRequest.price}}</td>
                        <td>{{serviceRequest.status}}</td>
                        <td>{{serviceRequest.remarks}}</td>
                    </tr>

                </tbody>
            </table>
        </div>
    
    </div>

    `,
  data() {
    return {
      prof_id: localStorage.getItem("id"),
      approvedServiceRequests: [],
      column_headers_1: [
        "Service Request ID",
        "Service Name",
        "Customer Name",
        "Price",
        "Status",
        "Remarks",
      ],
    };
  },
  async mounted() {
    const res = await fetch("/completed-serviceRequests", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prof_id: this.prof_id }),
    });
    const data = await res.json();
    this.approvedServiceRequests = data;
    console.log(this.approvedServiceRequests);
  },
};
