import axios from "../../api/axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function UpdatePending() {
  const param = useParams();
  const id = param.id;
  const { auth, setAuth } = useAuth();
  const [task, setTask] = useState({});
  const [division_up, setDivision] = useState("");
  const [officerid_up, setOfficerId] = useState("");
  const [subject_up, setSubject] = useState("");
  const [benname_up, setBname] = useState("");
  const [nic_up, setNic] = useState("");
  const [phone_up, setPhone] = useState("");
  const [task_up, setPtask] = useState("");
  const [status_up, setStatus] = useState("");
  const [rejReason_up, setRreason] = useState("");
  const [pending, setPreason] = useState([]);
  const [scheduledate_up, setDate] = useState("");

  async function getTask() {
    try {
      const { user, pwd, accessToken } = auth;
      const res = await axios.get(`task/getonetask/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true,
      });
      const oneTask = res.data;

      setTask(oneTask.task);
    } catch (err) {
      alert(err);
    }
  }

  useEffect(() => {
    getTask();
  }, []);

  useEffect(() => {
    setDivision(task.division);
    setOfficerId(task.officerid);
    setSubject(task.subject);
    setBname(task.benname);
    setNic(task.nic);
    setPhone(task.phone);
    setPtask(task.task);
    setStatus(task.status);
    setRreason(task.reason);
    setDate(task.scheduledate);
    setPreason(task.pending);
  }, [task]);

  async function UpdateData(e) {
    e.preventDefault();

    try {
      const updateTask = {
        division_up,
        officerid_up,
        subject_up,
        benname_up,
        nic_up,
        phone_up,
        task_up,
        status_up,
        rejReason_up,
        pending,
        scheduledate_up,
        date: new Date().toISOString().split("T")[0],
      };
      const { accessToken } = auth;
      await axios.put(`/task/penupdate/${id}`, updateTask, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true,
      });

      toast.success("Case Updated Successfully", {
        autoClose: 1000,
      });
      setTimeout(
        () => (window.location.href = `/offsys/employee/diaplaypending/${id}`),
        1000
      );
    } catch (err) {
      alert(err);
    }
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
        <div className="w-2/3 bg-white rounded-xl border-black border-4  shadow-xl p-8 m-4 ml-64 mt-24">
          <h1 className="block w-full text-center text-black text-3xl font-bold mb-6">
            Submit Details
          </h1>

          <div
            className="grid grid-cols-2 gap-1"
          >
            <div className="flex flex-col mb-4 mr-4 pt-8">
              <label
                className="mb-2 font-bold text-lg text-black ml-5"
                for="subject"
              >
                Subject
              </label>
              <input
                name="subject"
                id="subject"
                value={subject_up}
                required
                readOnly
                onChange={(e) => {
                  setSubject(e.target.value);
                }}
                className="border py-2 px-3 text-grey-800 w-full rounded-xl shadow-md"
              ></input>
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
                value={benname_up}
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
                value={phone_up}
                id="pnum"
                onChange={(e) => {
                  setPhone(e.target.value);
                }}
              />
            </div>

            <div className="flex flex-col mb-4 mr-5">
              <label
                className="mb-2 font-bold text-lg text-black ml-5"
                for="nic"
              >
                ID number
              </label>
              <input
                className="border py-2 px-3 text-grey-800 w-full rounded-xl shadow-md"
                required
                placeholder="199934110856"
                type="text"
                name="nic"
                value={nic_up}
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
              <input
                className="border py-2 px-3 text-grey-800 w-full rounded-xl shadow-md"
                required
                type="text"
                name="matter"
                value={task_up}
                id="matter"
                onChange={(e) => {
                  setTask(e.target.value);
                }}
              />
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
                value={status_up}
                required
                onChange={(e) => {
                  setStatus(e.target.value);
                }}
                className="border py-2 px-3 text-grey-800 w-full rounded-xl shadow-md"
              >
                <option selected>Choose Status</option>
                <option value="Done">Done</option>
                <option value="Pending">Pending</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            {status_up === "Rejected" && (
              <div className="flex flex-col mb-4 mr-5">
                <label
                  className="mb-2 font-bold text-lg text-black ml-5"
                  for="reason"
                >
                  Rejected Reason
                </label>
                <input
                  className="border py-2 px-3 text-grey-800 w-full rounded-xl shadow-md"
                  required
                  type="text"
                  name="reason"
                  value={rejReason_up}
                  placeholder="Eg: Reason"
                  onChange={(e) => {
                    setRreason(e.target.value);
                  }}
                />
              </div>
            )}

            {status_up === "Pending" && (
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
                  value={scheduledate_up}
                  name="date"
                  id="date"
                  onChange={(e) => {
                    setDate(e.target.value);
                  }}
                />
              </div>
            )}

            {status_up === "Pending" &&
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
                      <input
                        type="text"
                        name="name"
                        value={reason.reason}
                        onChange={(event) => handleReasonChange(index, event)}
                        className="border py-2 px-3 text-grey-800 w-full rounded-xl shadow-md"
                        placeholder="Enter the Reason"
                      />
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
          </div>

          {status_up === "Pending" && (
            <div class="mt-[5px] ml-[350px]">
              <button
                type="button"
                onClick={handleAddReason}
                className="bg-green-600 rounded-[10px] mt-5 h-10 w-[200px] m-auto hover:bg-green-700 text-white font-bold py-2 px-4 shadow focus:outline-none focus:shadow-outline"
              >
                ADD
              </button>
            </div>
          )}

          <div className="  ml-[350px]">
            <button
              className="bg-[#E65F2B] text-white rounded-[10px] mt-5 h-10 w-[200px] m-auto font-bold py-2 px-4 shadow focus:outline-none focus:shadow-outline"
              type="submit"
              onClick={UpdateData}
            >
              Save Details
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default UpdatePending;
