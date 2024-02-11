import axios from "../../api/axios";
import React, { useState, useEffect } from "react";
import useAuth from "../../hooks/useAuth";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, Link, useParams } from "react-router-dom";

const Subject_URL = "/sub/getsubject";

function EditEmployee() {
  const param = useParams();
  const id = param.id;

  const { auth } = useAuth();
  const [eid, setID] = useState("");
  const [loading, setLoading] = useState(true);
  const [subject, setSubject] = useState([]);
  const [oid, setOID] = useState("");
  const [allsubject, setAllSubject] = useState([]);
  const navigate = useNavigate();
  const [department, setDepartment] = useState("");
  const [report, setReport] = useState([]);
  const index = param.index;
  const status = param.status;

  useEffect(() => {
    const getEmp = async () => {
      try {
        const { accessToken } = auth;

        const res = await axios.get(`/employee/getoneemp/${id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
        });
        setOID(res.data._id);
        setID(res.data.eid);
        setSubject(res.data.subject);
        setDepartment(res.data.department);
        setReport(res.data.report);
        setLoading(false);
      } catch (err) {
        toast.error(err);
      }
    };

    getEmp();
  }, [auth, id]);

  const updateSub = async (e) => {
    e.preventDefault();

    if (status === "subject") {
      if (subject == "") {
        toast.warn("Please select the subject", {
          autoClose: 5000, // Display for 3 seconds
        });
        return;
      }
    } else {
      if (report == "") {
        toast.warn("Please fill the report", {
          autoClose: 5000, // Display for 3 seconds
        });
        return;
      }
    }
    try {
      const { accessToken } = auth;
      await axios.put(
        `/employee/updatesub/${index}/${oid}`,
        JSON.stringify({ eid, index, subject, report, status }),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
        }
      );

      toast.success("Subject updated successfully");

      setID("");
      setReport("");
      setSubject([]);
      setTimeout(() => {
        navigate(`/offsys/admin/show/${id}`);
      }, 3000);
    } catch (err) {
      if (!err?.response) {
        toast.error("No Server Response");
      } else if (err.response?.status === 405) {
        toast.error("  Report is already saved in the database.");
      } else if (err.response?.status === 403) {
        toast.error("  Subject is already saved in the database.");
      } else {
        toast.error("Registration Failed");
      }
    }
  };

  useEffect(() => {
    getSubs(department);
  }, [department]);

  const getSubs = async (department) => {
    try {
      const { accessToken } = auth;
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true,
      };
      const res = await axios.get(Subject_URL, config);
      const filteredSubjects = res.data.filter(
        (subject) => subject.department === department
      );
      setAllSubject(filteredSubjects);
    } catch (err) {
      toast.error("Error occurred while fetching subjects.");
    }
  };

  let renderContent;

  if (status === "subject") {
    renderContent = loading ? (
      <button>Loading...</button>
    ) : (
      <>
        <div className="flex flex-row items-center space-x-16">
          <div className="flex flex-col">
            <label htmlFor={`subject-${index}`} className="mb-2 font-bold">
              Subject name:
            </label>
            <select
              id={`subject-${index}`} // Use a unique ID for each select element
              value={subject[index]?.name || ""} // Set the value to the 'name' property of the subject object
              onChange={(e) => {
                const updatedSubject = [...subject];
                if (updatedSubject[index]) {
                  updatedSubject[index].name = e.target.value;
                  setSubject(updatedSubject);
                }
              }}
              className="border py-2 px-3 text-grey-800 w-80 rounded-xl shadow-md"
            >
              {allsubject.map((dept) => (
                <option key={dept.id} value={dept.subject}>
                  {dept.subject}
                </option>
              ))}
            </select>
          </div>
        </div>
      </>
    );
  } else if (status === "report") {
    renderContent = loading ? (
      <button>Loading...</button>
    ) : (
      <>
        <div className="flex flex-row items-center space-x-16">
          <div className="flex flex-col">
            <label htmlFor={`report-${index}`} className="mb-2 font-bold">
              Report Name :
            </label>
            <input
              className="border py-2 px-3 text-grey-800 w-80 rounded-xl shadow-md"
              required
              type="text"
              id={`report-${index}`}
              value={report[index]?.name || ""}
              onChange={(e) => {
                const updatedPend = [...report];
                if (updatedPend[index]) {
                  updatedPend[index] = {
                    ...updatedPend[index],
                    name: e.target.value,
                  };
                  setReport(updatedPend);
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
            Edit Subject
          </h1>

          <form
            onSubmit={updateSub}
            method="post"
            className="grid grid-cols-2 gap-1"
          >
            <div className="flex flex-col mb-4 mr-4 pt-8">
              <label
                className="mb-2 font-bold text-lg text-black ml-5"
                for="eid"
              >
                Employer ID
              </label>
              <input
                disabled
                className="border py-2 px-3 text-grey-800 w-full rounded-xl shadow-md"
                required
                type="text"
                placeholder="Employer ID"
                name="eid"
                id="eid"
                value={eid}
                onChange={(e) => {
                  setID(e.target.value);
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

export default EditEmployee;
