export default {
  template: `
    <div>
        <table class="table mt-2 table-secondary">
  <thead>
    <tr>
        <th scope="col" v-for="(column ,index) in headers" :key="index">{{column}}</th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="(row, index) in rowsFiltered" :key="index" v-if="row.roles=='prof'">
        <td v-for="(column, index) in columns" :key="index">{{row[column]}}</td>
        <td>
            <button class="btn btn-primary" v-if="row['active']==false" @click="statusUpdate(row['id'])">Approve</button>
            <button class="btn btn-warning" v-else @click="statusUpdate(row['id'])">Block</button>
            <button class="btn btn-danger" @click="deleteUser(row['id'])">Delete</button>
        </td>
    </tr>
  </tbody>
</table>

    </div>
    `,
  data() {
    return {
      headers: ["ID", "Name", "Experience(Yrs)", "Service Name", "Action"],
      token: localStorage.getItem("token"),
      role: localStorage.getItem("role"),
    };
  },
  props: {
    columns: {
      type: Array,
      required: true,
    },
    rows_data: {
      type: Array,
      required: true,
    },
    username: {
      type: String,
      default: "",
    },
  },
  computed: {
    rowsFiltered() {
      if (this.username) {
        return this.rows_data.filter((row) =>
          row.username.includes(this.username)
        );
      } else {
        return this.rows_data;
      }
    },
  },
  methods: {
    async statusUpdate(id) {
      const res = await fetch(`/api/userResource/${id}/${this.role}`, {
        method: "PUT",
        headers: {
          "Authentication-Token": this.token,
        },
      });
      const data = await res.json();
      if (res.ok) {
        this.$router.go(0);
      } else {
        alert("Some errror found");
      }
    },
    async deleteUser(id) {
      const res2 = await fetch(`/api/userResource/${id}/${this.role}`, {
        method: "DELETE",
        headers: {
          "Authentication-Token": this.token,
        },
      });
      const data2 = await res2.json();
      if (res2.ok) {
        this.$router.go(0);
      } else {
        alert("Some error found");
      }
    },
  },
};
