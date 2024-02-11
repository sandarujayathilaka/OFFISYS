import axios from "../../api/axios";
import React, { useState } from "react";
import { useEffect } from "react";
import useAuth from "../../hooks/useAuth";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function EmployeeDash() {
  const { auth, setAuth } = useAuth();
  const [officerid, setOid] = useState("");
  const [subject, setSubject] = useState("");
  const [benname, setBname] = useState("");
  const [nic, setNic] = useState("");
  const [phone, setPnum] = useState("");
  const [task, setTask] = useState("");
  const [status, setStatus] = useState("");
  const [rejReason, setRreason] = useState("");
  const [pending, setPreason] = useState([]);
  const [scheduledate, setDate] = useState("");
  const [employee, setEmployee] = useState({});
  const [subTask, setSubTask] = useState({});

  useEffect(() => {
    const { user, accessToken } = auth;

    setOid(user);
    async function getEmployee() {
      try {
        const res = await axios.get(`/task/emp/${user}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
        });

        setEmployee(res.data);
      } catch (err) {
        alert(err);
      }
    }

    getEmployee();
  }, []);

  useEffect(() => {
    if (
      subject !== "" &&
      subject !== "choose one" &&
      employee.subject.length > 0
    ) {
      // Add a conditional check here
      const { user, accessToken } = auth;
      const id = user;
      async function getSubject() {
        try {
          const res = await axios.get(`/task/sub/${id}/${subject}`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            withCredentials: true,
          });

          setSubTask(res.data);
        } catch (err) {
          alert(err);
        }
      }

      getSubject();
    }
  }, [subject]);

  function registerCase(e) {
    e.preventDefault();

    if (subject == "") {
      toast.warn("Please Fill the NIC Field", {
        autoClose: 5000, // Display for 3 seconds
      });
      return;
    }

    if (benname == "") {
      toast.warn("Please Fill the Name Field", {
        autoClose: 5000, // Display for 3 seconds
      });
      return;
    }

    if (phone == "") {
      toast.warn("Please Fill the Phone Number Field", {
        autoClose: 5000, // Display for 3 seconds
      });
      return;
    }

    if (nic == "") {
      toast.warn("Please Fill the NIC Field", {
        autoClose: 5000, // Display for 3 seconds
      });
      return;
    }

    if (task == "") {
      toast.warn("Please Fill the Task Field", {
        autoClose: 5000, // Display for 3 seconds
      });
      return;
    }

    if (status == "") {
      toast.warn("Please Fill the Status Field", {
        autoClose: 5000, // Display for 3 seconds
      });
      return;
    }

    const newCase = {
      section: employee.department,
      officerid,
      subject,
      benname,
      nic,
      phone,
      task,
      rejReason,
      pending,
      status,
      scheduledate,
      date: new Date().toISOString().split("T")[0],
    };
    const { user, pwd, accessToken } = auth;

    axios
      .post("/task/addben", newCase, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true,
      })
      .then(() => {
        setOid("");
        setSubject("");
        setBname("");
        setNic("");
        setPnum("");
        setTask("");
        setStatus("");
        setRreason("");
        setPreason([]);
        setDate("");
        toast.success("Details are Submitted successfully", {
          autoClose: 1000, // Display for 3 seconds
        });
        setTimeout(
          () => (window.location.href = `/offsys/employee/employeeform`),
          2000
        );
      })
      .catch((err) => {
        alert(`Failed to add Case: ${err}`);
      });
  }

  const handleReasonChange = (index, event) => {
    const newPending = [...pending];
    newPending[index] = {
      reason: event.target.value,
      sysdate: new Date().toISOString().split("T")[0],
    };
    setPreason(newPending);
  };

  const handleAddReason = () => {
    setPreason([...pending, { reason: "" }]);
  };

  const handleRemoveReason = (index) => {
    const newReasons = [...pending];
    newReasons.splice(index, 1); // delete 1 element specify by the index
    setPreason(newReasons);
  };

  return (
    <>
      <div className="flex justify-center items-center  h-full w-full bg-white pt-5">
        <div className="w-2/3 bg-white rounded-xl border-black border-4  shadow-xl p-8 m-4 ml-64 mt-24 ">
          <h1 className="block w-full text-center text-black text-3xl font-bold mb-6">
            Submit Details
          </h1>

          <form method="post" className="grid grid-cols-2 gap-1">
            <div className="flex flex-col mb-4 mr-4 pt-8">
              <label
                className="mb-2 font-bold text-lg text-black ml-5"
                for="subject"
              >
                Subject
              </label>
              {employee.subject && (
                <select
                  name="subject"
                  id="subject"
                  required
                  onChange={(e) => {
                    setSubject(e.target.value);
                  }}
                  className="border py-2 px-3 text-grey-800 w-full rounded-xl shadow-md"
                >
                  <option value="choose one">choose one </option>
                  {employee.subject.map((subject, index) => (
                    <option key={index} value={subject.name}>
                      {subject.name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="flex flex-col mb-4 mr-5 mt-8">
              <label
                className="mb-2 font-bold text-lg text-black ml-5"
                for="benName"
              >
                {" "}
                Benificery Name{" "}
              </label>
              <input
                className="border py-2 px-3 text-grey-800 w-full rounded-xl shadow-md"
                required
                type="text"
                placeholder="Eg: S.J.Rasika"
                name="benName"
                id="benName"
                onChange={(e) => {
                  setBname(e.target.value.toUpperCase());
                }}
              />
            </div>

            <div className="flex flex-col mb-4 mr-5">
              <label
                className="mb-2 font-bold text-lg text-black ml-5"
                for="pnum"
              >
                {" "}
                Phone Number
              </label>
              <input
                className="border py-2 px-3 text-grey-800 w-full rounded-xl shadow-md"
                required
                type="text"
                placeholder="Eg: 0777123456"
                name="pnum"
                id="pnum"
                onChange={(e) => {
                  setPnum(e.target.value);
                }}
              />
            </div>

            <div className="flex flex-col mb-4 mr-5">
              <label
                className="mb-2 font-bold text-lg text-black ml-5"
                for="nic"
              >
                NIC / Adult ID / House HN
              </label>
              <input
                className="border py-2 px-3 text-grey-800 w-full rounded-xl shadow-md"
                required
                placeholder="199934110856"
                type="text"
                name="nic"
                id="nic"
                onChange={(e) => {
                  setNic(e.target.value);
                }}
              />
            </div>

            <div className="flex flex-col mb-4 mr-5">
              <label
                className="mb-2 font-bold text-lg text-black ml-5"
                for="matter"
              >
                Task
              </label>
              {subTask && subTask.task && (
                <select
                  name="subjectTask"
                  id="subjectTask"
                  required
                  onChange={(e) => {
                    setTask(e.target.value);
                  }}
                  className="border py-2 px-3 text-grey-800 w-full rounded-xl shadow-md"
                >
                  <option>Select one</option>
                  {subTask.task.map((task, index) => (
                    <option key={index} value={task.name}>
                      {task.name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="flex flex-col mb-4 mr-5">
              <label
                className="mb-2 font-bold text-lg text-black ml-5"
                for="status"
              >
                Task Status{" "}
              </label>
              <select
                name="status"
                id="status"
                required
                onChange={(e) => {
                  setStatus(e.target.value);
                }}
                className="border py-2 px-3 text-grey-800 w-full rounded-xl shadow-md"
              >
                <option selected>Select Status</option>
                <option value="Done">Done</option>
                <option value="Pending">Pending</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            {status === "Rejected" && (
              <div className="flex flex-col mb-4 mr-5">
                <label
                  className="mb-2 font-bold text-lg text-black ml-5"
                  for="reason"
                >
                  Rejected Reason
                </label>
                {subTask && subTask.reject && (
                  <select
                    name="subjectTask"
                    id="subjectTask"
                    required
                    onChange={(e) => {
                      setRreason(e.target.value);
                    }}
                    className="border py-2 px-3 text-grey-800 w-full rounded-xl shadow-md"
                  >
                    <option value="choose one">choose one </option>
                    {subTask.reject.map((task, index) => (
                      <option key={index} value={task.name}>
                        {task.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            )}

            {status === "Pending" && (
              <div className="flex flex-col mb-4 mr-5">
                <label
                  className="mb-2 font-bold text-lg text-black ml-5"
                  for="date"
                >
                  Schedule Date
                </label>
                <input
                  className="border py-2 px-3 text-grey-800 w-full rounded-xl shadow-md"
                  required
                  type="date"
                  name="date"
                  id="date"
                  onChange={(e) => {
                    setDate(e.target.value);
                  }}
                />
              </div>
            )}

            {status === "Pending" &&
              pending.map((reason, index) => (
                <div key={index} className="flex flex-col">
                  <div className="flex flex-col mb-4 mr-5">
                    <div className="flex flex-col">
                      <label
                        htmlFor="name"
                        className="mb-2 font-bold text-lg text-black ml-5"
                      >
                        Pending Reason:
                      </label>
                      {subTask && subTask.pending && (
                        <select
                          name="pendingTask"
                          id="pendingTask"
                          required
                          onChange={(e) => {
                            handleReasonChange(index, e);
                          }}
                          className="border py-2 px-3 text-grey-800 w-full rounded-xl shadow-md"
                        >
                          <option value="choose one">choose one </option>
                          {subTask.pending.map((task, index) => (
                            <option key={index} value={task.name}>
                              {task.name}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-row items-center justify-center mt-4 ">
                    <button
                      onClick={() => handleRemoveReason(index)}
                      className="bg-red-600 rounded-[8px] mt-[-20px] w-[80px] mr-[370px] hover:bg-red-800 text-white font-bold shadow focus:outline-none focus:shadow-outline"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
          </form>

          {status === "Pending" && (
            <div class="mt-[5px] ml-[350px]">
              <button
                type="button"
                onClick={handleAddReason}
                className="bg-green-600 rounded-[10px] mt-5 h-10 w-[200px] m-auto hover:bg-green-700 text-white font-bold py-2 px-4 shadow focus:outline-none focus:shadow-outline"
              >
                Add Reason
              </button>
            </div>
          )}

          <div className="  ml-[350px]">
            <button
              className="bg-[#E65F2B] text-white rounded-[10px] mt-5 h-10 w-[200px] m-auto font-bold py-2 px-4 shadow focus:outline-none focus:shadow-outline"
              type="submit"
              onClick={registerCase}
            >
              Save Details
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default EmployeeDash;
