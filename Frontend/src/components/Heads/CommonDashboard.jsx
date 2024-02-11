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
import useAuth from '../../hooks/useAuth';
import { startOfDay, endOfDay } from 'date-fns';

const GET_Employee_URL = "/employee/getemp";

const AgDashboard = () => {
  const [ben, setBen] = useState([]);
  const { auth } = useAuth();
  const [pendingTasks, setPendingTasks] = useState(0);
  const [rejectTasks, setRejectTasks] = useState(0);
  const [total, setTotal] = useState(0);
  const [progress, setProgress] = useState(0);
  const [successTasks, setSuccessTasks] = useState(0);
  const [department, setDepartment] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState("All");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [employee,setEmployee] = useState([])

  useEffect(() => {
    const getEmps = async () => {
      try {
        const { user, accessToken } = auth;
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
        };
        const res = await axios.get(GET_Employee_URL, config);

        let filteredEmployees = res.data;

        const matchedEmployee = filteredEmployees.find(
          (emp) => emp.eid === user
        );
        const department = matchedEmployee ? matchedEmployee.department : null;

        setDepartment(department);

        filteredEmployees = filteredEmployees.filter(
          (emp) => emp.department === department
        );

        filteredEmployees = filteredEmployees.filter(
          (emp) => emp.roles && emp.roles.Employee
        );

        setEmployee(filteredEmployees);
      } catch (err) {
      
        toast.error('Error occurred while fetching employees.');
      }
    };

    getEmps();
  }, [auth]);

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
  
        
          filteredTasks = filteredTasks.filter(
            (task) => task.division === department
          );
          if(selectedEmployee !== "All"){
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

    // Fetch initial data for the current date
    getTasks();

    // Set the current date as the selected date if it's empty
    const currentDate =
      selectedDate !== ""
        ? selectedDate
        : new Date().toISOString().split("T")[0];
    setSelectedDate(currentDate);
  }, [department, selectedEmployee, selectedDate, auth]);

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
    },
    {
      name: "Total Pending Task",
      value: pendingTasks,
    },
    {
      name: "Total Reject Task",
      value: rejectTasks,
    },
  ];

  return (
    <div class="p-4 sm:ml-64">
      <div
        className="flex justify-center items-center h-full "
        style={{ marginTop: "100px" }}
      >
        <div
          className="bg-white rounded-lg shadow-2xl p-8 m-4 w-3/4"
          style={{ backgroundColor: "#ffffff" }}
        >
          <div class="-mt-[42px] fixed ml-[125px] flex">
            <select
              id="employee"
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
              className="bg-[#2E4960] border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-15 p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              style={{ color: "#FFFFFF" }}
            >
              <option value="All">All Employee</option>
              {employee.map((emp) => (
                <option key={emp.id} value={emp.eid}>
                  {emp.eid}
                </option>
              ))}
            </select>
          </div>
          <div className="-mt-[42px] fixed ml-[575px] flex">
            <input
              type="date"
              id="simple-search"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-white border ml-5 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Search by ID or Name"
              required
            />
          </div>
          <div
            className="flex justify-around mt-4"
            style={{ marginTop: "20px" }}
          >
            <div className="bg-gray-100 p-4 rounded-lg shadow-md">
              <h2 className="text-lg font-medium">Total Success</h2>
              <p className="text-3xl font-bold">{successTasks}</p>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg shadow-md">
              <h2 className="text-lg font-medium">Total Pending</h2>
              <p className="text-3xl font-bold">{pendingTasks}</p>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg shadow-md">
              <h2 className="text-lg font-medium">Total Reject</h2>
              <p className="text-3xl font-bold">{rejectTasks}</p>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg shadow-md">
              <h2 className="text-lg font-medium">Total Customer</h2>
              <p className="text-3xl font-bold">{total}</p>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg shadow-md">
              <h2 className="text-lg font-medium">Total Progress</h2>
              <p className="text-3xl font-bold">{progress}</p>
            </div>
          </div>

          <div className="mt-8">
            {eventStatus.length > 0 && (
              <div style={{ display: "flex" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ textAlign: "center" }}>
                    <h1
                      style={{
                        textAlign: "left",
                        marginLeft: "200px",
                        fontWeight: "bold",
                      }}
                    >
                      Task Status Bar Chart
                    </h1>
                    <div style={{ width: "100%" }}>
                      <BarChart
                        width={500}
                        height={300}
                        data={eventStatus}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                        barSize={20}
                      >
                        <XAxis
                          dataKey="name"
                          scale="point"
                          padding={{ left: 10, right: 10 }}
                        />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <CartesianGrid strokeDasharray="3 3" />
                        <Bar
                          dataKey="value"
                          fill="#8884d8"
                          background={{ fill: "#eee" }}
                        />
                      </BarChart>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgDashboard;
