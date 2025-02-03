export default {
  template: `<div>
    <table class="table table-secondary">
  <thead>
    <tr>
        <th scope="col" v-for="(column ,index) in headers" :key="index">{{column}}</th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="(row, index) in rows_data" :key="index">
        <td v-for="(column, index) in columns" :key="index">{{row[column]}}</td>
        <td>
            <router-link class="btn btn-primary" :to="{name:'UpdateServiceForm', params:{id:row.id}}">Edit</router-link>
            <button class="btn btn-danger" @click="deleteService(row.id)">Delete</button>
        </td>
    </tr>
  </tbody>
</table>
    </div>`,

  data() {
    return {
      headers: ["ID", "Service Name", "Base Price", "Action"],
      token: localStorage.getItem("token"),
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
  },
  methods: {
    async deleteService(id) {
      const res = await fetch(`/api/serviceResource/${id}`, {
        method: "DELETE",
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
  },
};
