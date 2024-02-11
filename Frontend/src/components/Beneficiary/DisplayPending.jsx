import axios from "../../api/axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

function DisplayPending() {
  const { auth, setAuth } = useAuth();
  const [task, setTask] = useState({});
  const [loading, setLoading] = useState(true);
  const [pending, setpending] = useState([]);
  const param = useParams();
  const { id } = useParams();

  useEffect(() => {
    const { accessToken } = auth;

    async function getTask() {
      try {
        const res = await axios.get(`task/getonetask/${id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
        });
        setTask(res.data.task);
        setpending(res.data.task.pending);
        setLoading(false);
      } catch (err) {
        alert(err);
      }
    }

    getTask();
  }, [param.id]);

  return (
    <>
      <div class="bg-slate-400 ml-96 mt-36 mb-20 mr-36 w-auto rounded-2xl">
        <div class="pt-10">
          <h1 class="text-2xl font-bold text-[#131342] text-center">
            Pending Task Details
          </h1>
        </div>
        <div class="ml-[600px] -mt-7">
          <Link
            to={`/offsys/employee/updatepen/${id}`}
            className=" bg-[#2E4960] hover:bg-[#084469] px-[15px] py-[8px] rounded-[120px] font-bold text-white text-[14px] block w-[150px] text-center mb-7 mx-auto"
          >
            {" "}
            Edit Details
          </Link>
        </div>
        <div class="flex gap-4 ml-20 mt-5">
          <h1 class="text-lg font-bold"> Task : </h1>
          <h1 class="text-lg">{task.task}</h1>
        </div>
        <div class="flex gap-4 ml-20 mt-2">
          <h1 class="text-lg font-bold"> Beneficiary : </h1>
          <h1 class="text-lg">{task.benname}</h1>
        </div>
        <div class="flex gap-4 ml-20 mt-2">
          <h1 class="text-lg font-bold">NIC / Adult ID / House HN : </h1>
          <h1 class="text-lg">{task.nic}</h1>
        </div>
        <div class="flex gap-4 ml-20 mt-2">
          <h1 class="text-lg font-bold"> Contact : </h1>
          <h1 class="text-lg">{task.phone}</h1>
        </div>

        <div class="flex gap-4 ml-20 mt-2">
          <h1 class="text-lg font-bold">Task Status : </h1>
          <h1 class="text-lg">
            <span
              class={`text-white text-sm w-1/3 pb-1 font-semibold px-2 rounded-full  ${
                task.status === "Done"
                  ? "bg-green-600"
                  : task.status === "Rejected"
                  ? "bg-red-600"
                  : "bg-orange-600"
              }`}
            >
              {task.status === "Done"
                ? "Done"
                : task.status === "Pending"
                ? "Pending"
                : "Rejected"}
            </span>
          </h1>
        </div>

        <div class="flex gap-4 ml-20 mt-2">
          <h1 class="text-lg font-bold">Schedule Date : </h1>
          <p class="text-lg">{task.scheduledate}</p>
        </div>
        <div class="flex gap-4 ml-20 mt-2">
          <h1 class="text-lg font-bold">Last Updated Date : </h1>
          <p class="text-lg">{task.lastUpdatedDate}</p>
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
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead>
                  <tr className="bg-blue-400">
                    <th
                      scope="col"
                      className="px-2 py-3 text-center text-xs font-medium text-black uppercase"
                    >
                      Pending Resons
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-center text-xs font-medium text-black uppercase"
                    >
                      Marked Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {task.pending.map((tasks, index) => (
                    <tr
                      key={index}
                      className={`${
                        index % 2 === 0
                          ? "bg-white"
                          : "bg-blue-100 dark:bg-blue-100"
                      }`}
                    >
                      <td className="px-1 py-2 text-center whitespace-nowrap text-sm font-medium text-black">
                        {tasks.reason}
                      </td>
                      <td className="px-1 py-2 text-center whitespace-nowrap text-sm font-medium text-black">
                        {tasks.sysdate}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <br></br>
      </div>
    </>
  );
}

export default DisplayPending;
