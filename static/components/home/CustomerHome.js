import NavBar from "../Navbar.js";
import ServicesAvail from "../userComponents/ServicesAvail.js";
import ServiceRequest from "../userComponents/ServiceRequest.js";
export default {
  template: `<div>
  <NavBar/>
  <p class="h6 mt-3"  >Services Availaible </p>
  <ServicesAvail :key="keyServiceAvail" />
    <p class="h6 mt-3">Services History </p>
  <ServiceRequest :key="keyServiceRequest"/>


  </div>`,
  components: {
    NavBar,
    ServicesAvail,
    ServiceRequest,
  },
  data() {
    return {
      keyServiceAvail: 0,
      keyServiceRequest: 0,
    };
  },
  mounted() {
    this.keyServiceAvail += 1;
    this.keyServiceRequest += 1;
  },
};
