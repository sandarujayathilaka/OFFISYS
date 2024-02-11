import axios from '../../api/axios';
import React,{ useEffect,useState } from 'react'
import { Link, Outlet } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const GET_Subject_URL = '/sub/getsubject';

function AllSubject() {

 const { auth } = useAuth();
  const [subjects,setSubjects] = useState([])


  useEffect(() => {
    const getSubs = async () => {
      try {
        const { accessToken } = auth;
        const config = {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
        };
        const res = await axios.get(GET_Subject_URL, config);
        setSubjects(res.data);
      } catch (err) {
        toast.error('Error occurred while fetching subjects.');
      }
    };
  
    getSubs();
  }, [auth]);


  
  

  function filterContent(subjects, searchTerm) {
    const result = subjects.filter(
      (r) =>
        r.department.toLowerCase().includes(searchTerm.toLowerCase())  ||
        r.subject.toLowerCase().includes(searchTerm.toLowerCase()) 
    );
    setSubjects(result);
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
    axios.get(GET_Subject_URL,config).then((res) => {
      if (res.data) {
        filterContent(res.data, searchTerm);
      }
    });
  };




  return (
    <div>
      <div class="min-h-screen  py-5 ml-[17%] pt-20 ">
        <div class="fixed ">
          <form class="flex items-center mt-10">
            <label for="simple-search" class="sr-only">
              Search
            </label>
            <div class="relative mx-auto w-[300px]">
              <div class="absolute inset-y-0 left-0 flex items-center justify-center pointer-events-none">
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
                class="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Search by Subject Name or Department"
                required
              />
            </div>
          </form>

          <div class="-mt-[58px]">
            <button
              type="button"
              class="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4
     focus:ring-blue-300 font-medium rounded-xl text-sm px-3.5 py-2 text-center ml-[1045px] mt-5 mb-4 dark:bg-blue-600 
     dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              <Link to="/offsys/admin/addSubject">Add Subject</Link>
            </button>
          </div>
        </div>

        <div class="overflow-x-auto w-full mt-36 max-h-[500px] ">
          <table class="mx-auto max-w-5xl shadow-2xl w-full whitespace-nowrap rounded-lg bg-white divide-y divide-gray-300 overflow-y-auto">
            <thead class="bg-[#2E4960] sticky top-0 z-10">
              <tr class="text-white text-left">
                <th class="font-semibold text-sm uppercase text-center px-6 py-4">
                  {" "}
                  Subject Name{" "}
                </th>
                <th class="font-semibold text-sm uppercase text-center px-6 py-4">
                  {" "}
                  Department{" "}
                </th>

                <th class="font-semibold text-sm uppercase px-6 py-4 text-center">
                  ACTION
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-400">
              {subjects.map((subjects, index) => (
                <tr key={index} class="bg-gray-200 hover:bg-slate-100">
                  <td class="px-6 py-4 text-center"> {subjects.subject}</td>
                  <td class="px-6 py-4 text-center"> {subjects.department} </td>

                  <td class="py-3 px-6 text-center">
                    <div class="flex item-center justify-center">
                      <Link to={`/offsys/admin/showSub/${subjects._id}`}>
                        <div class="w-4 mr-2 transform hover:text-green-600 hover:scale-110 z-0">
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
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                        </div>
                      </Link>
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

export default AllSubject