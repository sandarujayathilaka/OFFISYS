import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import useAuth from "../../hooks/useAuth";
import { Link } from "react-router-dom";

const GET_Employee_URL = "employee/getemp";
const Department_URL = "dep/getdep";
const All_Task_URL = "task/getallcases";

function AgDepartment() {
  const { auth } = useAuth();
  const [employee, setEmployee] = useState([]);
  const [department, setDepartment] = useState([]);
  const [cases, setCases] = useState([]);

  useEffect(() => {
    async function getEmployee() {
      try {
        const { accessToken } = auth;

        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
        };
        const res = await axios.get(GET_Employee_URL, config);
        const dep = await axios.get(Department_URL, config);
        const respons = await axios.get(All_Task_URL, config);

        setCases(respons.data.cases);
        setEmployee(res.data);
        setDepartment(dep.data);
      } catch (err) {
        alert(err);
      }
    }

    getEmployee();
  }, []);

  return (
    <div className="p-4 sm:ml-64 mt-[150px]">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-4">
        {department &&
          department.map((dep, index) => (
            <Link
              to={`/offsys/ag/allemployee/${dep.name}`}
              key={index}
              className="block"
            >
              <div className="px-6 py-4 text-center bg-red-900 text-white transition-all duration-300 h-100 rounded-lg shadow-lg border-2 border-gray-300 hover:translate-y-[-5px] hover:bg-[#0A4754] hover:text-white">
                {dep.name}
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
}

export default AgDepartment;
