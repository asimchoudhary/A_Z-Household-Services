export default {
  template: `
    <div class="mt-3 d-flex flex-row">
    <button class="btn btn-success" @click="downloadCsv" >Download Service Requests Csv</button>
    <div class="spinner-grow" v-if="waiting" role="status">
  <span class="sr-only"></span>
</div>
    </div>
    
    `,
  data() {
    return {
      waiting: false,
      token: localStorage.getItem("token"),
    };
  },
  methods: {
    async downloadCsv() {
      this.waiting = true;
      const res = await fetch("/download-service-requests", {
        headers: {
          "Authentication-Token": this.token,
        },
      });
      const data = await res.json();
      const taskId = data["task_id"];
      const interval = setInterval(async () => {
        const res2 = await fetch(
          `/download-service-requests-status/${taskId}`,
          {
            headers: {
              "Authentication-Token": this.token,
            },
          }
        );
        if (res2.ok) {
          clearInterval(interval);
          this.waiting = false;
          alert("CSV ready to download");
          window.location.href = `/download-service-requests-status/${taskId}`;
        }
      }, 1000);
    },
  },
};
