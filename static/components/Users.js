export default {
  template: `<div> List of all the users 
        <div v-for="(user,index) in allUsers">{{user.email}}
          <button class="btn btn-primary" v-if="!user.active" @click="approveUser(user.id)">Approve </button>
        </div>
    
    </div>`,
  data() {
    return {
      allUsers: [],
      token: localStorage.getItem("token"),
    };
  },
  methods: {
    async approveUser(id) {
      const res = await fetch(`/activate_user/${id}`, {
        headers: {
          "Authentication-Token": this.token,
        },
      });
      if (res.ok) {
        alert("User approved");
      }
    },
  },
  async mounted() {
    console.log("mounted");
    const res = await fetch("/users", {
      headers: {
        "Authentication-Token": this.token,
      },
    });
    console.log(res);
    const data = await res.json();
    console.log(data);
    if (res.ok) {
      this.allUsers = data;
    }
  },
};
