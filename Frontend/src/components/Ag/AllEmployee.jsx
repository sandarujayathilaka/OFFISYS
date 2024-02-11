import React, { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import { Link, useParams } from "react-router-dom";
import axios from "../../api/axios";

function AllEmployee() {
  const { auth, setAuth } = useAuth();
  const [employee, setEmployee] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState({});
  const [showDescriptonModal, setShowDescriptonModal] = useState(false);
  const { id } = useParams();

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

        const res = await axios.get(`/employee/getdepemp/${id}`, config);

        const filteredEmployees = res.data.filter(
          (emp) => emp.roles && emp.roles.Employee
        );

        setEmployee(filteredEmployees);
      } catch (err) {
        alert(err);
      }
    }

    getEmployee();
  }, []);

  const handleDescription = (task) => {
    setShowDescriptonModal(true);
    setSelectedEmployee(task);
  };

  return (
    <div class="p-4 sm:ml-64">
  <div class="overflow-x-auto w-full mt-36 max-h-[500px]">
    <table class="mx-auto max-w-5xl shadow-2xl w-full whitespace-nowrap rounded-lg bg-white divide-y divide-gray-300 overflow-hidden table-auto">
    
      <thead class="bg-[#2E4960] sticky top-0">
        <tr class="text-white text-left">
          <th class="font-semibold text-sm uppercase text-center px-6 py-4">
            ID
          </th>
          <th class="font-semibold text-sm uppercase text-center px-6 py-4">
            Name
          </th>
          <th class="font-semibold text-sm uppercase px-6 py-4 text-center">
            Contact
          </th>
          <th class="font-semibold text-sm uppercase px-6 py-4 text-center">
            Action
          </th>
        </tr>
      </thead>
    
      <tbody class="divide-y divide-gray-400">
        {employee &&
          employee.map((emp, index) => (
            <tr key={index} class="bg-gray-200 hover:bg-slate-100">
              <td class="px-6 py-4 text-center">{emp.eid}</td>
              <td class="px-6 py-4 text-center">{emp.name}</td>
              <td class="px-6 py-4 text-center">{emp.phoneNumber}</td>

              <td class="py-3 px-6 text-center">
                <div class="flex item-center justify-center">
                  <Link to={`/offsys/ag/employeetask/${emp.eid}`}>
                    <button
                      type="button"
                      class="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
                    >
                      Tasks
                    </button>
                  </Link>

                  <button
                    onClick={() => handleDescription(emp)}
                    type="button"
                    class="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
                  >
                    Reports
                  </button>
                </div>
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  </div>


  {showDescriptonModal && (
    <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-8">
        <div className="m-9">
          <table class="mx-auto max-w-5xl shadow-2xl w-full whitespace-nowrap rounded-lg bg-white divide-y divide-gray-300 overflow-hidden table-auto">
           
            <thead class="bg-[#2E4960] sticky top-0">
              <tr class="text-white text-left">
                <th class="font-semibold text-sm uppercase text-center px-6 py-4">
                  Report Name
                </th>
                <th class="font-semibold text-sm uppercase text-center px-6 py-4">
                  Due Date
                </th>
                <th class="font-semibold text-sm uppercase text-center px-6 py-4">
                  Submitted Date
                </th>
              </tr>
            </thead>
          
            <tbody class="divide-y divide-gray-400">
              {selectedEmployee.report &&
                selectedEmployee.report.map((data, index) => (
                  <tr key={index} class="bg-gray-200 hover:bg-slate-100">
                    <td class="px-6 py-4 text-center"> {data.name}</td>
                    <td class="px-6 py-4 text-center text-red-600">
                      {" "}
                      {data.due}
                    </td>
                    <td class="px-6 py-4 text-center"> {data.date} </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-center">
          <button
            className="bg-sky-950 text-white h-[35px] w-[70px] rounded-full"
            onClick={() => setShowDescriptonModal(false)}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )}
</div>

  );
}

export default AllEmployee;
