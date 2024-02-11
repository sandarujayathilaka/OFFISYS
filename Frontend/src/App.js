import EmployeePortal from "./components/portal/employeePortal";
import Employee from "./components/Beneficiary/EmployeeDash";
import EmployeeTasks from "./components/Beneficiary/EmployeeTasks";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Register from "./components/Register";
import Login from "./components/Login";
import Layout from "./components/Layout";
import Missing from "./components/Missing";
import Unauthorized from "./components/Unauthorized";
import RequireAuth from "./components/RequireAuth";
import PersistLogin from "./components/PersistLogin";
import { Routes, Route } from "react-router-dom";
import AdminPortal from "./components/portal/AdminPortal";
import AdminEmployee from "./components/Employee/AdminEmployee";
import AdminDepartment from "./components/Department/AdminDepartment";
import AllEmployees from "./components/Employee/AllEmployees";
import AllDepartment from "./components/Department/AllDepartment";
import EditDepartment from "./components/Department/EditDepartment";
import AddSubject from "./components/Employee/AddSubject";
import DisplaySubject from "./components/Employee/DisplaySubject";
import UpdateSubject from "./components/Employee/UpdateSubject";
import AddSubjectTask from "./components/Subject/AddSubject";
import AllSubject from "./components/Subject/AllSubject";
import DisplaySubjectTask from "./components/Subject/DisplaySubject";
import EditSubject from "./components/Subject/EditSubject";
import EditSub from "./components/Subject/EditSub";
import PendingTasks from "./components/Beneficiary/PendingTasks";
import DisplayPending from "./components/Beneficiary/DisplayPending";
import UpdatePending from "./components/Beneficiary/UpdatePending";
import AgDashboard from "./components/Ag/AgDashboard";
import AgPortal from "./components/portal/AgPortal";
import AllEmployee from "./components/Ag/AllEmployee";
import EmployeeTask from "./components/Ag/EmployeeTask";
import UpdatePassword from "./components/Beneficiary/UpdatePassword";
import ReportSubmit from "./components/Beneficiary/ReportSubmit";
import CommonPortal from "./components/portal/CommonPortal";
import AgDepartment from "./components/Ag/AgDepartment";
import HeadEmployee from "./components/Heads/HeadEmployee";
import HeadEmpTask from "./components/Heads/HeadEmpTask";
import CommonDashboard from "./components/Heads/CommonDashboard";

const ROLES = {
  Employee: 2001,
  Divisional_Secretariat: 1984,
  Admin: 5150,
  Assistant_Director: 2000,
  Assistant_District_Registar: 1990,
  Cheif_Clerk: 1980,
  Accountant: 1970,
  Administrative_Officer: 1960,
};

function App() {
  return (
    <>
      <Routes>
        {/* public routes */}
        <Route path="/offsys" element={<Login />} />
        <Route path="/offsys/register" element={<Register />} />
        <Route path="/offsys/unauthorized" element={<Unauthorized />} />

        {/* we want to protect these routes */}
        <Route element={<PersistLogin />}>
          <Route
            element={
              <RequireAuth allowedRoles={[ROLES.Divisional_Secretariat]} />
            }
          >
            <Route path="offsys/ag" element={<AgPortal />}>
              <Route path="dashboard" element={<AgDashboard />} />
              <Route path="departments" element={<AgDepartment />} />
              <Route path="allemployee/:id" element={<AllEmployee />} />
              <Route path="employeetask/:id" element={<EmployeeTask />} />
              <Route path="updatepass/:eid" element={<UpdatePassword />} />
            </Route>
          </Route>

          <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
            <Route path="offsys/admin" element={<AdminPortal />}>
              <Route path="addEmp" element={<AdminEmployee />} />
              <Route path="addDep" element={<AdminDepartment />} />
              <Route path="getEmp" element={<AllEmployees />} />
              <Route path="getDep" element={<AllDepartment />} />
              <Route path="updateDep/:id" element={<EditDepartment />} />
              <Route path="addSub/:id" element={<AddSubject />} />
              <Route path="show/:id" element={<DisplaySubject />} />
              <Route
                path="updateSub/:index/:id/:status"
                element={<UpdateSubject />}
              />
              <Route path="addSubject" element={<AddSubjectTask />} />
              <Route path="getSubject" element={<AllSubject />} />
              <Route path="showSub/:id" element={<DisplaySubjectTask />} />
              <Route path="updateSubject/:id" element={<EditSubject />} />
              <Route
                path="updateTask/:index/:id/:status"
                element={<EditSub />}
              />
              <Route path="updatepass/:eid" element={<UpdatePassword />} />
            </Route>
          </Route>

          <Route element={<RequireAuth allowedRoles={[ROLES.Employee]} />}>
            <Route path="offsys/employee" element={<EmployeePortal />}>
              <Route path="employeeform" element={<Employee />} />
              <Route path="employeetasks" element={<EmployeeTasks />} />
              <Route path="pendingtasks" element={<PendingTasks />} />
              <Route path="diaplaypending/:id" element={<DisplayPending />} />
              <Route path="updatepen/:id" element={<UpdatePending />} />
              <Route path="submitreport" element={<ReportSubmit />} />
              <Route path="updatepass/:eid" element={<UpdatePassword />} />
            </Route>
          </Route>

          <Route
            element={
              <RequireAuth
                allowedRoles={[
                  ROLES.Assistant_Director,
                  ROLES.Assistant_District_Registar,
                  ROLES.Cheif_Clerk,
                  ROLES.Accountant,
                  ROLES.Administrative_Officer,
                ]}
              />
            }
          >
            <Route path="offsys/common" element={<CommonPortal />}>
              <Route path="role" element={<CommonDashboard />} />
              <Route path="allemployee/:id" element={<HeadEmployee />} />
              <Route path="employeetask/:id" element={<HeadEmpTask />} />
              <Route path="updatepass/:eid" element={<UpdatePassword />} />
            </Route>
          </Route>
        </Route>

        {/* catch all */}
        <Route path="*" element={<Missing />} />
      </Routes>

      <ToastContainer />
    </>
  );
}

export default App;
