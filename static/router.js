import Home from "./components/Home.js";
import Login from "./components/Login.js";
import Users from "./components/Users.js";
import ServiceResourceForm from "./components/ServiceResourceForm.js";
import UserRegister from "./components/register/UserRegister.js";
import ProfessionalRegister from "./components/register/ProfessionalRegister.js";
import AdminHome from "./components/home/AdminHome.js";
import CustomerHome from "./components/home/CustomerHome.js";
import ProfessionalHome from "./components/home/ProfessionalHome.js";
import UpdateServiceForm from "./components/UpdateServiceForm.js";
import CloseService from "./components/userComponents/CloseService.js";
import AdminSearch from "./components/search/AdminSearch.js";
import CustSearch from "./components/search/CustSearch.js";
import ProfSearch from "./components/search/ProfSearch.js";

const routes = [
  { path: "/", component: Home },
  { path: "/login", component: Login, name: "Login" },
  { path: "/users", component: Users, name: "Users" },
  { path: "/createNewService", component: ServiceResourceForm },
  { path: "/user-register", component: UserRegister },
  { path: "/professional-register", component: ProfessionalRegister },
  { path: "/admin-home", component: AdminHome, name: "AdminHome" },
  { path: "/cust-home", component: CustomerHome, name: "CustomerHome" },
  { path: "/prof-home", component: ProfessionalHome },
  {
    path: "/update-service",
    component: UpdateServiceForm,
    name: "UpdateServiceForm",
  },
  { path: "/close-service/:id", component: CloseService, name: "CloseService" },
  { path: "/admin-search", component: AdminSearch },
  { path: "/cust-search", component: CustSearch },
  { path: "/prof-search", component: ProfSearch },
];

// ? You can also parameter to the routes like this
// /:id

export default new VueRouter({
  routes,
});
