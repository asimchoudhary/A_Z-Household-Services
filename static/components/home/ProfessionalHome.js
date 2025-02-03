import Navbar from "../Navbar.js";
import ActiveServiceRequest from "../profComponent/ActiveServiceRequest.js";
import CompletedServices from "../profComponent/CompletedServices.js";
export default {
  template: `<div>
  <Navbar/>
  <p class="h6 mt-3">Availaible Services</p>
  <ActiveServiceRequest :key="keyActiveService"/>
  <p class="h6 mt-3">Completed Services</p>
  <CompletedServices :key="keyCompleteService" />
  </div>`,
  components: {
    Navbar,
    ActiveServiceRequest,
    CompletedServices,
  },
  data() {
    return {
      keyActiveService: 0,
      keyCompleteService: 0,
    };
  },
  mounted() {
    this.keyActiveService += 1;
    this.keyCompleteService += 1;
  },
};
