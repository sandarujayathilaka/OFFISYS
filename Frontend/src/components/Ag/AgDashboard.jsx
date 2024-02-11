import React, { useState, useEffect } from "react";
import axios from "../../api/axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useAuth from "../../hooks/useAuth";
import { startOfDay, endOfDay } from "date-fns";

const Department_URL = "/dep/getdep";
const GET_Employee_URL = "/employee/getemp";

const AgDashboard = () => {

  const [ben, setBen] = useState([]);
  const { auth } = useAuth();
  const [pendingTasks, setPendingTasks] = useState(0);
  const [rejectTasks, setRejectTasks] = useState(0);
  const [progress, setProgress] = useState(0);
  const [successTasks, setSuccessTasks] = useState(0);
  const [department, setDepartment] = useState([]);
  const [total, setTotal] = useState(0);
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [selectedEmployee, setSelectedEmployee] = useState("All");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [employee, setEmployee] = useState([]);
  

  useEffect(() => {
    async function getTasks() {
      try {
        const { accessToken } = auth;

        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
        };
        const res = await axios.get(`task/getall`, config);

        let filteredTasks = res.data;

        if (selectedDepartment !== "All") {
          filteredTasks = filteredTasks.filter(
            (task) => task.division === selectedDepartment
          );
        }
        if (selectedEmployee !== "All") {
          filteredTasks = filteredTasks.filter(
            (task) => task.officerid === selectedEmployee
          );
        }

        if (selectedDate) {
          const startDate = startOfDay(new Date(selectedDate));
          const endDate = endOfDay(new Date(selectedDate));

          filteredTasks = filteredTasks.filter((task) => {
            const taskDate = new Date(task.lastUpdatedDate);
            return taskDate >= startDate && taskDate <= endDate;
          });
        }

        setBen(filteredTasks);
      } catch (err) {
        alert(err);
      }
    }

    getTasks();
  }, [selectedDepartment, selectedEmployee, selectedDate, auth]);

  useEffect(() => {
    const getEmps = async () => {
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

        let filteredEmployees = res.data;

        if (selectedDepartment !== "All") {
          filteredEmployees = filteredEmployees.filter(
            (emp) => emp.department === selectedDepartment
          );
        }
  
    
          filteredEmployees = filteredEmployees.filter(
            (emp) => emp.roles && emp.roles.Employee
          );
       
  
        setEmployee(filteredEmployees);
      } catch (err) {
        
        toast.error('Error occurred while fetching employees.');
      }
    };

    getEmps();
  }, [selectedDepartment, auth]);

  useEffect(() => {
    const eventStatusData = ben.map((event) => {
      let pendingCount = 0;
      let successCount = 0;
      let rejectCount = 0;

      if (event.status === "Done") {
        successCount += 1;
      }
      if (event.status === "Pending") {
        pendingCount += 1;
      }
      if (event.status === "Rejected") {
        rejectCount += 1;
      }

      return [pendingCount, successCount, rejectCount];
    });

    const [pendingCount, successCount, rejectCount] = eventStatusData.reduce(
      (
        [pending, available, finished],
        [pendingCount, successCount, rejectCount]
      ) => [
        pending + pendingCount,
        available + successCount,
        finished + rejectCount,
      ],
      [0, 0, 0]
    );

    setPendingTasks(pendingCount);
    setSuccessTasks(successCount);
    setRejectTasks(rejectCount);
   let progress;
   let total;
   if (successCount === 0 && pendingCount === 0 && rejectCount === 0) {
     progress = 0;
     total = 0;
   } else {
     progress =
       ((Number(successCount) +
         Number(rejectCount) +
         Number(pendingCount) * 0.5) /
         (Number(pendingCount) + Number(rejectCount) + Number(successCount))) *
       100;
     progress = progress.toFixed(2);
     total = Number(successCount) + Number(rejectCount) + Number(pendingCount);
   }
   setProgress(progress);
   setTotal(total);
  }, [ben]);

  const eventStatus = [
    {
      name: "Total Success Task",
      value: successTasks,
    },//get
    {
      name: "Total Pending Task",
      value: pendingTasks,
    },
    {
      name: "Total Reject Task",
      value: rejectTasks,
    },
  ];

  useEffect(() => {
    const getDeps = async () => {
      try {
        const { accessToken } = auth;

        const config = {
          headers: {
            "Content-Type": "application/json",
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

  return (
    <div class="p-4 sm:p-0 sm:ml-64">
      <div
        className="flex justify-center items-center h-full"
        style={{ marginTop: "100px" }}
      >
        <div className="bg-slate-400 rounded-lg shadow-2xl p-8 m-4 w-full sm:w-96 md:w-[90%] lg:w-[70%] xl:w-[60%]">
          <div className="mt-5 sm:mt-0 flex flex-wrap justify-center items-center">
            <div class="mb-3 md:mb-0 md:mr-3">
              <select
                id="department"
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="bg-[#2E4960] border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full sm:w-40 p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 text-white"
              >
                <option value="All">All Department</option>
                {department.map((dept) => (
                  <option key={dept.id} value={dept.name}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>
            <div class="mb-3 md:mb-0 md:mr-3">
              <select
                id="employee"
                value={selectedEmployee}
                onChange={(e) => setSelectedEmployee(e.target.value)}
                className="bg-[#2E4960] border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full sm:w-40 p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 text-white"
              >
                <option value="All">All Employee</option>
                {employee.map((emp) => (
                  <option key={emp.id} value={emp.eid}>
                    {emp.eid}
                  </option>
                ))}
              </select>
            </div>
            <div class="mb-3 md:mb-0 md:ml-3 md:mr-3">
              <input
                type="date"
                id="simple-search"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full sm:w-auto pl-2.5 md:pl-10 p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Search by ID or Name"
                required
              />
            </div>
          </div>

          <div className="flex flex-wrap justify-around mt-5">
            <div className="bg-gray-100 p-4 rounded-lg shadow-md m-2 w-full sm:w-44 md:w-56 lg:w-60">
              <h2 className="text-lg font-bold text-green-600">
                Total Success
              </h2>
              <p className="text-3xl font-extrabold  text-green-600">
                {successTasks}
              </p>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg shadow-md m-2 w-full sm:w-44 md:w-56 lg:w-60">
              <h2 className="text-lg font-bold text-amber-600">
                Total Pending
              </h2>
              <p className="text-3xl font-extrabold  text-amber-600">
                {pendingTasks}
              </p>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg shadow-md m-2 w-full sm:w-44 md:w-56 lg:w-60">
              <h2 className="text-lg font-bold text-red-600">Total Reject</h2>
              <p className="text-4xl font-extrabold  text-red-600">
                {rejectTasks}
              </p>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg shadow-md m-2 w-full sm:w-44 md:w-56 lg:w-60">
              <h2 className="text-lg font-bold text-blue-700">
                Total Customers
              </h2>
              <p className="text-3xl font-extrabold  text-blue-700">{total}</p>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg shadow-md m-2 w-full sm:w-44 md:w-56 lg:w-60">
              <h2 className="text-lg font-bold text-rose-950">
                Total Progress
              </h2>
              <p className="text-3xl font-extrabold  text-rose-950">
                {" "}
                {progress} %
              </p>
            </div>
          </div>
         
        </div>
        
      </div>
    </div>
  );
};

export default AgDashboard;
