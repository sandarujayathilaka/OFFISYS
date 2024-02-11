import axios from '../../api/axios';
import React,{ useEffect,useState } from 'react'
import { Link, Outlet,useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Department_URL = '/dep/getdep';

function AllDepartment() {

  const { auth } = useAuth();
  const [department,setDepartment] = useState([])
  const navigate = useNavigate();

  useEffect(() => {
    const getDeps = async () => {
      try {
        const { accessToken } = auth;
    
        const config = {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
        };
        const res = await axios.get(Department_URL, config);
        setDepartment(res.data);
      } catch (err) {
       
        toast.error('Error occurred while fetching departments.');
      }
    };
  
    getDeps();
  }, [auth]);
  

  function filterContent(department, searchTerm) {
    const result = department.filter(
      (r) =>
        r.did.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setDepartment(result);
  }

  const handleTextSearch = (e) => {
    const searchTerm = e.currentTarget.value;
    const { accessToken } = auth;
        const config = {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
        };
    axios.get(Department_URL,config).then((res) => {
      
      if (res.data) {
        filterContent(res.data, searchTerm);
      }
    });
  };

  const onDelete = async (id) => {
    toast.warn(
      <div>
        <p className="text-red-700 ml-8">Do you want to delete?</p>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <button
            style={{ marginRight: "1rem" }}
            onClick={async () => {
              try {
                const { accessToken } = auth;
  
                const response = await axios.delete(`dep/deleteDep/${id}`, {
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                  },
                  withCredentials: true,
                });
            
                if (response.status === 200) {
                  toast.success('Requested Department Deleted!!');
            
                  
                  setDepartment((prevDepartments) =>
                    prevDepartments.filter((department) => department._id !== id)
                  );
            
                  setTimeout(() => {
                    navigate("/offsys/admin/getDep");
                  }, 3000);
                } else {
                  toast.error('Failed to delete department.');
                }
              } catch (error) {
              
                toast.error('An error occurred while deleting the department.');
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
    <div>
      <div className="min-h-screen  py-5 ml-[17%] pt-20 ">
        <div className="fixed ">
          <form className="flex items-center mt-10">
            <label for="simple-search" className="sr-only">
              Search
            </label>
            <div className="relative w-[300px] ml-[230px]">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg
                  aria-hidden="true"
                  class="w-5 h-5 text-gray-500 dark:text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
              </div>
              <input
                type="text"
                id="simple-search"
                onChange={handleTextSearch}
                className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Search by ID or Name"
                required
              />
            </div>
          </form>

          <div className="-mt-[58px]">
            <button
              type="button"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4
     focus:ring-blue-300 font-medium rounded-xl text-sm px-3.5 py-2 text-center ml-[1045px] mt-5 mb-4 dark:bg-blue-600 
     dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              <Link to="/offsys/admin/addDep">Add Department</Link>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto w-full mt-36 max-h-[500px] ">
          <table class="mx-auto max-w-5xl shadow-2xl w-full whitespace-nowrap rounded-lg bg-white divide-y divide-gray-300 overflow-y-auto">
            <thead class="bg-[#2E4960] sticky top-0 z-10">
              <tr class="text-white text-left">
                <th class="font-semibold text-sm uppercase text-center px-6 py-4">
                  {" "}
                  Department ID{" "}
                </th>
                <th class="font-semibold text-sm uppercase text-center px-6 py-4">
                  {" "}
                  Department Name{" "}
                </th>
                <th class="font-semibold text-sm uppercase px-6 py-4 text-center">
                  ACTION
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-400">
              {department.map((department, index) => (
                <tr key={index} class="bg-gray-200 hover:bg-slate-100">
                  <td class="px-6 py-4 text-center"> {department.did}</td>
                  <td class="px-6 py-4 text-center"> {department.name} </td>

                  <td class="py-3 px-6 text-center">
                    <div className="flex item-center justify-center">
                      <Link to={`/offsys/admin/updateDep/${department._id}`}>
                        <div className="w-4 mr-2 transform hover:text-yellow-500 hover:scale-110">
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

                      <button onClick={() => onDelete(department._id)}>
                        <div className="w-4 mr-2 transform hover:text-red-600 hover:scale-110 z-0">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
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

      <Outlet />
    </div>
  );
}

export default AllDepartment