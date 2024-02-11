import axios from "../../api/axios";
import React, { useState, useEffect } from "react";
import useAuth from "../../hooks/useAuth";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, Link, useParams } from "react-router-dom";

function EditSub() {
  const param = useParams();
  const id = param.id;

  const { auth } = useAuth();
  const [subject, setSubject] = useState("");
  const [loading, setLoading] = useState(true);
  const [task, setTask] = useState([]);
  const [pending, setPending] = useState([]);
  const [reject, setReject] = useState([]);

  const navigate = useNavigate();
  const index = param.index;
  const status = param.status;

  useEffect(() => {
    const getSub = async () => {
      try {
        const { accessToken } = auth;
        const res = await axios.get(`/sub/getonesubject/${id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
        });

        setSubject(res.data.subject);

        setTask(res.data.task);
        setPending(res.data.pending);
        setReject(res.data.reject);

        setLoading(false);
      } catch (err) {
        toast.error(err);
      }
    };

    getSub();
  }, [auth, id]);

  const updateSub = async (e) => {
    e.preventDefault();
    if (status === "task") {
      if (task == "") {
        toast.warn("Please fill the task", {
          autoClose: 2000, // Display for 3 seconds
        });
        return;
      }
    } else if (status === "pending") {
      if (pending == "") {
        toast.warn("Please fill the pending reason", {
          autoClose: 2000, // Display for 3 seconds
        });
        return;
      }
    } else {
      if (reject == "") {
        toast.warn("Please fill the reject reason", {
          autoClose: 2000, // Display for 3 seconds
        });
        return;
      }
    }

    try {
      const { accessToken } = auth;

      await axios.put(
        `/sub/updatetask/${index}/${id}`,
        JSON.stringify({ subject, index, task, pending, reject, status }),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
        }
      );

      toast.success("Updated successfully");

      setTask("");
      setPending("");
      setSubject("");
      setReject("");

      setTimeout(() => {
        navigate(`/offsys/admin/showSub/${id}`);
      }, 1000);
    } catch (err) {
      if (!err?.response) {
        toast.error("No Server Response");
      } else if (err.response?.status === 402) {
        toast.error(" Task is already saved in the database.");
      } else if (err.response?.status === 403) {
        toast.error(" Pending reason is already saved in the database.");
      } else if (err.response?.status === 405) {
        toast.error(" Reject reason is already saved in the database.");
      } else {
        toast.error("Registration Failed");
      }
    }
  };

  let renderContent;

  if (status === "task") {
    renderContent = loading ? (
      <button>Loading...</button>
    ) : (
      <>
        <div className="flex flex-row items-center space-x-16">
          <div className="flex flex-col">
            <label htmlFor={`task-${index}`} className="mb-2 font-bold">
              Task name:
            </label>
            <input
              className="border py-2 px-3 text-grey-800 w-80 rounded-xl shadow-md"
              required
              type="text"
              id={`task-${index}`}
              value={task[index]?.name || ""}
              onChange={(e) => {
                const updatedTask = [...task];
                if (updatedTask[index]) {
                  updatedTask[index] = {
                    ...updatedTask[index],
                    name: e.target.value,
                  };
                  setTask(updatedTask);
                }
              }}
            />
          </div>
        </div>
      </>
    );
  } else if (status === "pending") {
    renderContent = loading ? (
      <button>Loading...</button>
    ) : (
      <>
        <div className="flex flex-row items-center space-x-16">
          <div className="flex flex-col">
            <label htmlFor={`pending-${index}`} className="mb-2 font-bold">
              Pending Reason:
            </label>
            <input
              className="border py-2 px-3 text-grey-800 w-80 rounded-xl shadow-md"
              required
              type="text"
              id={`pending-${index}`}
              value={pending[index]?.name || ""}
              onChange={(e) => {
                const updatedPend = [...pending];
                if (updatedPend[index]) {
                  updatedPend[index] = {
                    ...updatedPend[index],
                    name: e.target.value,
                  };
                  setPending(updatedPend);
                }
              }}
            />
          </div>
        </div>
      </>
    );
  } else if (status === "reject") {
    renderContent = loading ? (
      <button>Loading...</button>
    ) : (
      <>
        <div className="flex flex-row items-center space-x-16">
          <div className="flex flex-col">
            <label htmlFor={`reject-${index}`} className="mb-2 font-bold">
              Reject Reason:
            </label>

            <input
              className="border py-2 px-3 text-grey-800 w-80 rounded-xl shadow-md"
              required
              type="text"
              id={`reject-${index}`}
              value={reject[index]?.name || ""}
              onChange={(e) => {
                const updatedReject = [...reject];
                if (updatedReject[index]) {
                  updatedReject[index] = {
                    ...updatedReject[index],
                    name: e.target.value,
                  };
                  setReject(updatedReject);
                }
              }}
            />
          </div>
        </div>
      </>
    );
  }
  return (
    <>
      <div className="flex justify-center items-center  h-full w-full bg-white pt-24">
        <div className="w-2/3 bg-white rounded-xl border-black border-4  shadow-xl p-8 m-4 ml-64 mt-24">
          <h1 className="block w-full text-center text-black text-3xl font-bold mb-6">
            Edit
          </h1>

          <form
            onSubmit={updateSub}
            method="post"
            className="grid grid-cols-2 gap-1"
          >
            <div className="flex flex-col mb-4 mr-4 pt-8">
              <label
                className="mb-2 font-bold text-lg text-black ml-5"
                for="subject"
              >
                Subject Name
              </label>
              <input
                disabled
                className="border py-2 px-3 text-grey-800 w-full rounded-xl shadow-md"
                required
                type="text"
                placeholder="Subject ID"
                name="subject"
                id="subject"
                value={subject}
                onChange={(e) => {
                  setSubject(e.target.value);
                }}
              />
            </div>

            {renderContent}

            <div className="col-span-2 flex justify-center">
              <button
                className="bg-[#E65F2B] text-white rounded-[10px] mt-5 h-10 w-[200px] m-auto font-bold py-2 px-4 shadow focus:outline-none focus:shadow-outline"
                type="submit"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default EditSub;
