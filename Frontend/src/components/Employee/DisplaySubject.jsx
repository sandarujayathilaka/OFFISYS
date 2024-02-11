import axios from '../../api/axios';
import React, { useEffect, useState } from "react";
import { Link, useParams,useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useAuth from '../../hooks/useAuth';

export default function DisplaySubject() {
    const { auth } = useAuth();
  const [employee, setEmployee] = useState({});
  const [oid, setOID] = useState("");
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    
    const getEmp= async () =>{
      try {
        const { accessToken } = auth;

        const res = await axios.get(`/employee/getoneemp/${id}`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
            withCredentials: true,
          }
        );
       setOID(res.data._id);
          setEmployee(res.data);
          setLoading(false);
        
      } catch (err) {
        toast.error(err);
      }
    }

    getEmp();
  }, [auth, id]);




  const onDelete = (index,word) => {
    const { accessToken } = auth;
    toast.warn(
      <div>
        <p className="text-red-700 ml-8">Do you want to delete?</p>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <button
            style={{ marginRight: "1rem" }}
            onClick={() => {
              axios
                .delete(`/employee/deletesub/${index}/${oid}`, {
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                  },
                  withCredentials: true,
                  data:{word},
                })
                .then((response) => {
                  if (response.status === 200) {
                    toast.success(`${word} deleted successfully`, {
                      autoClose: 1000,
                    });
                    setTimeout(() => {
                      window.location.reload();
                    }, 1500);
                    
                  } else {
                    toast.error('Failed to delete the subject.');
                  }
                })
                .catch((err) => {
                  toast.warning(err);
                });
            }}
          >
            Yes
          </button>
          <button onClick={() => toast.dismiss()}>No</button>
        </div>
      </div>,
      { autoClose: false }
    );
  };
  
  
const onDeleteEmployee = async (id) => {
  
  toast.warn(
    <div>
      <p className="text-red-700 ml-8">Do you want to delete?</p>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <button
          style={{ marginRight: "1rem" }}
          onClick={async () => {
            try {
              const { accessToken } = auth;
             
              const response = await axios.delete(`/employee/deleteemp/${oid}`, {
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${accessToken}`,
                },
                withCredentials: true,
              });

              if (response.status === 200) {
             
                setEmployee((prevEmployees) => {
                  if (Array.isArray(prevEmployees)) {
                    return prevEmployees.filter((emp) => emp._id !== id);
                  }
                  return [];
                });
                
                if (employee.eid) {
                  const userResponse = await axios.delete(`deleteUser?attribute=${employee.eid}`, {
                    headers: {
                      'Content-Type': 'application/json',
                      Authorization: `Bearer ${accessToken}`,
                    },
                    withCredentials: true,
                  });

                  if (userResponse.status === 200) {
                    toast.success('Requested Employee Deleted!!');
                  } else {
                    toast.error('Failed to delete the user table.');
                  }
                } else {
                  toast.error('Failed to find the username of the employee.');
                }

                setTimeout(() => {
                  navigate("/offsys/admin/getEmp");
                }, 1000);
              } else {
                toast.error('Failed to delete employee.');
              }
            } catch (error) {
              console.error(error);
              toast.error('An error occurred while deleting the employee.');
            }
          }}
        >
          Yes
        </button>
        <button onClick={() => toast.dismiss()}>No</button>
      </div>
    </div>,
    { autoClose: false }
  );
};

  return (
    <>
      <div class="bg-slate-400 ml-96 mt-36 mb-20 mr-36 w-auto rounded-2xl">
        <div class="pt-10">
          <h1 class="text-2xl font-bold text-[#131342] text-center">
            Employee Detail
          </h1>
        </div>
        <div class="ml-[600px] -mt-7">
          <Link
            to={`/offsys/admin/addSub/${id}`}
            className=" bg-[#2E4960] hover:bg-[#084469] px-[15px] py-[8px] rounded-[120px] font-bold text-white text-[14px] block w-[150px] text-center mb-7 mx-auto"
          >
            {" "}
            Edit Employee
          </Link>
        </div>
        <div class="flex gap-4 ml-20 mt-5">
          <h1 class="text-lg font-bold">Employee ID : </h1>
          <h1 class="text-lg">{employee.eid}</h1>
        </div>

        <div class="flex gap-4 ml-20 mt-2">
          <h1 class="text-lg font-bold">Employee Name : </h1>
          <h1 class="text-lg">{employee.name}</h1>
        </div>

        <div class="flex gap-4 ml-20 mt-2">
          <h1 class="text-lg font-bold">NIC : </h1>
          <h1 class="text-lg">{employee.nic}</h1>
        </div>

        <div class="flex gap-4 ml-20 mt-2">
          <h1 class="text-lg font-bold">Phone Number : </h1>
          <h1 class="text-lg">{employee.phoneNumber}</h1>
        </div>

        <div class="flex gap-4 ml-20 mt-2">
          <h1 class="text-lg font-bold">Email : </h1>
          <h1 class="text-lg">{employee.email}</h1>
        </div>

        <div className="flex gap-4 ml-20 mt-2">
          <h1 className="text-lg font-bold">Role : </h1>
          {employee.roles ? (
            <h1 className="text-lg">
              {Object.keys(employee.roles).join(", ")}
            </h1>
          ) : (
            <h1 className="text-lg">No roles</h1>
          )}
        </div>

        <div class="flex gap-4 ml-20 mt-2">
          <h1 class="text-lg font-bold">Department : </h1>
          <h1 class="text-lg">{employee.department}</h1>
        </div>

        {loading ? (
          <button
            disabled
            type="button"
            class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 inline-flex items-center"
          >
            <svg
              aria-hidden="true"
              role="status"
              class="inline w-4 h-4 mr-3 text-white animate-spin"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="#E5E7EB"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentColor"
              />
            </svg>
            Loading...
          </button>
        ) : (
          <div class="flex pt-[30px] pb-16">
            <div class=" w-full ml-20 mr-20 bg-slate-100 border rounded-lg overflow-hidden dark:border-gray-700">
              <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead>
                  <tr class="bg-blue-400">
                    <th
                      scope="col"
                      class="px-2 py-3 text-center text-xs font-medium text-black uppercase"
                    >
                      Subject Name
                    </th>

                    <th
                      scope="col"
                      class="px-6 py-3 text-center text-xs font-medium text-black uppercase"
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                  {employee.subject &&
                    employee.subject.map((subject, index) => (
                      <tr
                        key={index}
                        class={`${
                          index % 2 === 0
                            ? "bg-white"
                            : "bg-blue-100 dark:bg-blue-100"
                        }`}
                      >
                        <td class="px-1 py-2 text-center whitespace-nowrap text-sm font-medium text-black">
                          {subject.name}
                        </td>
                        <td class="py-3 px-6  text-center">
                          <div class="flex item-center justify-center">
                            <Link
                              to={`/offsys/admin/updateSub/${index}/${id}/subject`}
                            >
                              <div class="w-4 mr-2 transform hover:text-yellow-500 hover:scale-110">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                                  />
                                </svg>
                              </div>
                            </Link>

                            <button onClick={() => onDelete(index, "subject")}>
                              <div class="w-4 mr-2 transform hover:text-red-600 hover:scale-110">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                  />
                                </svg>
                              </div>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {loading ? (
          <button
            disabled
            type="button"
            class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 inline-flex items-center"
          >
            <svg
              aria-hidden="true"
              role="status"
              class="inline w-4 h-4 mr-3 text-white animate-spin"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="#E5E7EB"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentColor"
              />
            </svg>
            Loading...
          </button>
        ) : (
          <div class="flex pt-[30px] pb-16">
            <div class=" w-full ml-20 mr-20 bg-slate-100 border rounded-lg overflow-hidden dark:border-gray-700 ">
              <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead>
                  <tr class="bg-blue-400">
                    <th
                      scope="col"
                      class="px-2 py-3 text-center text-xs font-medium text-black uppercase"
                    >
                      Report Name
                    </th>

                    <th
                      scope="col"
                      class="px-6 py-3 text-center text-xs font-medium text-black uppercase"
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                  {employee.report &&
                    employee.report.map((report, index) => (
                      <tr
                        key={index}
                        class={`${
                          index % 2 === 0
                            ? "bg-white"
                            : "bg-blue-100 dark:bg-blue-100"
                        }`}
                      >
                        <td class="px-1 py-2 text-center whitespace-nowrap text-sm font-medium text-black">
                          {report.name}
                        </td>
                        <td class="py-3 px-6  text-center">
                          <div class="flex item-center justify-center">
                            <Link
                              to={`/offsys/admin/updateSub/${index}/${id}/report`}
                            >
                              <div class="w-4 mr-2 transform hover:text-yellow-500 hover:scale-110">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                                  />
                                </svg>
                              </div>
                            </Link>

                            <button onClick={() => onDelete(index, "report")}>
                              <div class="w-4 mr-2 transform hover:text-red-600 hover:scale-110">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                  />
                                </svg>
                              </div>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={() => onDeleteEmployee(employee._id)}
          className="bg-red-700 mt-3  hover:bg-red-600 px-[15px] py-[8px] rounded-[120px] font-bold text-white text-[14px] block w-[150px] text-center mx-auto"
        >
          Delete Employee
        </button>

        <br></br>
      </div>
    </>
  );
}
