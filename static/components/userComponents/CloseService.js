export default {
  template: `
    <div>
      <h2>Close Service Request</h2>
      <form @submit.prevent="submitForm">
        <div class="form-group">
          <label for="remarks">Remarks</label>
          <input type="text" id="remarks" v-model="remarks" class="form-control" required>
        </div>
        <button type="submit" class="btn btn-primary">Submit</button>
      </form>
    </div>
  `,
  data() {
    return {
      remarks: "",
      service_id: this.$route.params.id,
      token: localStorage.getItem("token"),
    };
  },
  methods: {
    async submitForm() {
      try {
        const res = await fetch("/close-serviceRequest-remarks", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authentication-Token": this.token,
          },
          body: JSON.stringify({
            service_request_id: this.service_id,
            remarks: this.remarks,
          }),
        });
        const data = await res.json();
        if (res.ok) {
          alert("Service request closed successfully");
          this.$router.push({ name: "CustomerHome" });
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
