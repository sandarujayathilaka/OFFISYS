import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { Link, Outlet } from "react-router-dom";
import axios from "../../api/axios";
import useAuth from "../../hooks/useAuth";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function EmployeeTasks() {
  const { auth, setAuth } = useAuth();
  const [Task, setTask] = useState([]);
  const [filterOption, setFilterOption] = useState("All");
  const [showDescriptonModal, setShowDescriptonModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    async function getTasks() {
      try {
        const { user, accessToken } = auth;

        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
        };
        const res = await axios.get(`task/getall/${user}`, config);

        setTask(res.data.tasks);
      } catch (err) {
        alert(err);
      }
    }

    getTasks();
  }, []);

  function filterContent(Task, searchTerm) {
    const result = Task.filter(
      (r) =>
        r.nic.includes(searchTerm) ||
        r.benname.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setTask(result);
  }

  const handleTextSearch = (e) => {
    const searchTerm = e.currentTarget.value;
    const { user, accessToken } = auth;

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      withCredentials: true,
    };
    axios.get(`task/getall/${user}`, config).then((res) => {
      if (res.data.tasks) {
        filterContent(res.data.tasks, searchTerm);
      }
    });
  };

  const handleFilterChange = (event) => {
    setFilterOption(event.target.value);
  };

  const handleDescription = (task) => {
    setShowDescriptonModal(true);
    setSelectedTask(task);
  };

  const onDelete = (id) => {
    const { accessToken } = auth;
    toast.warn(
      <div>
        <p class="text-red-700 ml-8">Do you want to delete ?</p>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <button
            style={{ marginRight: "1rem" }}
            onClick={() => {
              axios
                .delete(`task/deletetask/${id}`, {
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                  },
                  withCredentials: true,
                })
                .then((res) => {})
                .catch((err) => {
                  toast.warning(err);
                });
              toast.success("Task Deleted successfully", {
                autoClose: 1000,
              });
              setTimeout(() => {
                window.location.href = `/offsys/employee/employeetasks`;
              }, 1500);
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
      <div class="min-h-screen  py-5 ml-[17%] pt-20 ">
        <div class="fixed ">
          <form class="flex items-center mt-10">
            <label for="simple-search" class="sr-only">
              Search
            </label>
            <div class="relative w-[300px] ml-[230px]">
              <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
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
                placeholder="Search by ID or Name"
                required
              />
            </div>
          </form>

          <div class="-mt-[42px] fixed ml-[125px]">
            <select
              id="countries"
              value={filterOption}
              onChange={handleFilterChange}
              class="bg-[#2E4960] border border-gray-300 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-15 p-2.5  dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            >
              <option selected value="All">
                All
              </option>
              <option value="Done">Done</option>
              <option value="Pending">Pending</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        <div class="overflow-x-auto w-full mt-36 max-h-[500px] ">
          <table class="mx-auto max-w-5xl shadow-2xl w-full whitespace-nowrap rounded-lg bg-white divide-y divide-gray-300 overflow-hidden table-auto">
            <thead class="bg-[#2E4960] sticky top-0">
              <tr class="text-white text-left">
                <th class="font-semibold text-sm uppercase text-center px-6 py-4">
                  {" "}
                  ID{" "}
                </th>
                <th class="font-semibold text-sm uppercase text-center px-6 py-4">
                  {" "}
                  Benificery{" "}
                </th>
                <th class="font-semibold text-sm uppercase px-6 py-4 text-center">
                  {" "}
                  Contact{" "}
                </th>
                <th class="font-semibold text-sm uppercase px-6 py-4 text-center">
                  {" "}
                  STATUS{" "}
                </th>
                <th class="font-semibold text-sm uppercase px-6 py-4 text-center">
                  ACTION
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-400">
              {Task.filter((r) =>
                filterOption === "All" ? true : r.status === filterOption
              ).map((Task, index) => (
                <tr key={index} class="bg-gray-200 hover:bg-slate-100">
                  <td
                    class="px-6 py-4 text-center"
                    onClick={() => handleDescription(Task)}
                  >
                    {" "}
                    {Task.nic}
                  </td>
                  <td class="px-6 py-4 text-center"> {Task.benname} </td>
                  <td class="px-6 py-4 text-center"> {Task.phone} </td>
                  <td class="px-6 py-4 text-center">
                    <span
                      class={`text-white text-sm w-1/3 pb-1 font-semibold px-2 rounded-full ml-[18px] ${
                        Task.status === "Done"
                          ? "bg-green-600"
                          : Task.status === "Rejected"
                          ? "bg-red-600"
                          : "bg-orange-600"
                      }`}
                    >
                      {Task.status === "Done"
                        ? "Done"
                        : Task.status === "Pending"
                        ? "Pending"
                        : "Rejected"}
                    </span>
                  </td>

                  <td class="py-3 px-6 text-center">
                    <div class="flex item-center justify-center">
                      <div class="w-4 mr-2 transform hover:text-green-600 hover:scale-110">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          onClick={() => handleDescription(Task)}
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

                      <button onClick={() => onDelete(Task._id)}>
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

        {showDescriptonModal && (
          <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-8">
              <div className="m-9">
                <table class="border-collapse w-full">
                  <tbody>
                    <tr class="bg-gray-100">
                      <td class="border border-gray-400 px-4 py-1 font-medium">
                        Task
                      </td>
                      <td class="border border-gray-400 px-4 py-1">
                        {selectedTask.task}
                      </td>
                    </tr>
                    <tr class="bg-gray-100">
                      <td class="border border-gray-400 px-4 py-1 font-medium">
                        Subject
                      </td>
                      <td class="border border-gray-400 px-4 py-1">
                        {selectedTask.subject}
                      </td>
                    </tr>
                    <tr class="bg-gray-200">
                      <td class="border border-gray-400 px-4 py-1 font-medium">
                        Benificery
                      </td>
                      <td class="border border-gray-400 px-4 py-1">
                        {selectedTask.benname}
                      </td>
                    </tr>
                    <tr class="bg-gray-100">
                      <td class="border border-gray-400 px-4 py-1 font-medium">
                        NIC / Adult ID / House HN
                      </td>
                      <td class="border border-gray-400 px-4 py-1">
                        {selectedTask.nic}
                      </td>
                    </tr>
                    <tr class="bg-gray-100">
                      <td class="border border-gray-400 px-4 py-1 font-medium">
                        Phone
                      </td>
                      <td class="border border-gray-400 px-4 py-1">
                        {selectedTask.phone}
                      </td>
                    </tr>

                    <tr class="bg-gray-100">
                      <td class="border border-gray-400 px-4 py-1 font-medium">
                        Status
                      </td>
                      <td class="border border-gray-400 px-4 py-1">
                        {selectedTask.status}
                      </td>
                    </tr>
                    <tr class="bg-gray-100">
                      <td class="border border-gray-400 px-4 py-1 font-medium">
                        Reject Reason
                      </td>
                      <td class="border border-gray-400 px-4 py-1">
                        {selectedTask.rejreason
                          ? selectedTask.rejreason
                          : "Nil"}
                      </td>
                    </tr>

                    <tr className="bg-gray-100">
                      <td className="border border-gray-400 px-4 py-1 font-medium">
                        Pending Reason
                      </td>
                      <td className="border border-gray-400 px-4 py-1">
                        {selectedTask.pending.length > 0 ? (
                          <ul>
                            {selectedTask.pending.map((task, index) => (
                              <li key={index}>
                                {task.reason ? task.reason : "Nil"}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <span>Nil</span>
                        )}
                      </td>
                    </tr>

                    <tr class="bg-gray-100">
                      <td class="border border-gray-400 px-4 py-1 font-medium">
                        Created Date
                      </td>
                      <td class="border border-gray-400 px-4 py-1">
                        {selectedTask.createdDate
                          ? selectedTask.createdDate
                          : "Nil"}
                      </td>
                    </tr>
                    <tr class="bg-gray-100">
                      <td class="border border-gray-400 px-4 py-1 font-medium">
                        Schedule Date
                      </td>
                      <td class="border border-gray-400 px-4 py-1">
                        {selectedTask.scheduledate
                          ? selectedTask.scheduledate
                          : "Nil"}
                      </td>
                    </tr>
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

      <Outlet />
    </div>
  );
}

export default EmployeeTasks;
