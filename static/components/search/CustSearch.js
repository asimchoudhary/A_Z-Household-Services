import ServiceAvail from "../userComponents/ServicesAvail.js";

export default {
  template: `
    <div>
      <h2>Search: Services by Name</h2>
      <form @submit.prevent="searchService">
        <div class="mb-3">
          <label for="serviceName" class="form-label">Service Name</label>
          <input type="text" class="form-control" id="serviceName" v-model="serviceName" required>
        </div>
        <button type="submit" class="btn btn-primary">Search</button>
      </form>
      <div v-if="showServiceAvail">
        <ServiceAvail :serviceName="serviceName" />
      </div>
    </div>
  `,
  components: {
    ServiceAvail,
  },
  data() {
    return {
      serviceName: "",
      showServiceAvail: false,
    };
  },
  methods: {
    searchService() {
      this.showServiceAvail = true;
    },
  },
};
