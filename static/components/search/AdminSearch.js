import ProfessionalTable from "../tables/ProfessionalTable.js";

export default {
  template: `
    <div>
      <h2>Search: Professional  by Name</h2>
      <form @submit.prevent="searchUser">
        <div class="mb-3">
          <label for="username" class="form-label">Username</label>
          <input type="text" class="form-control" id="username" v-model="username" required>
        </div>
        <button type="submit" class="btn btn-primary">Search</button>
      </form>
      <div v-if="searchResults.length > 0">
        <h3>Search Results</h3>
        <ProfessionalTable :columns="columns" :rows_data="searchResults" :username="username"/>
      </div>
    </div>
  `,
  components: {
    ProfessionalTable,
  },
  data() {
    return {
      username: "",
      searchResults: [],
      columns: ["id", "username", "exp_in_years", "service_name"],
    };
  },
  methods: {
    async searchUser() {
      const res = await fetch(`/api/userResource`, {
        method: "GET",
        headers: {
          "Authentication-Token": localStorage.getItem("token"),
        },
      });
      const data = await res.json();
      if (res.ok) {
        this.searchResults = data;
      } else {
        alert("No users found");
      }
    },
  },
};
