import React, { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import { Link, useParams } from "react-router-dom";
import axios from "../../api/axios";
import { toast } from "react-toastify";

function ReportSubmit() {
  const { auth, setAuth } = useAuth();
  const [employee, setEmployee] = useState({});
  const [date, setDate] = useState("");
  const [due, setDue] = useState("");
  const [reportId, setReportId] = useState("");
  const [showDescriptonModal, setShowDescriptonModal] = useState(false);

  useEffect(() => {
    const getEmp = async () => {
      try {
        const { user, accessToken } = auth;

        const res = await axios.get(`/employee/getOneEmp/${user}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
        });

        setEmployee(res.data);
      } catch (err) {
        toast.error(err);
      }
    };

    getEmp();
  }, [auth]);

  async function UpdateData(e) {
    e.preventDefault();

    try {
      const updateDate = {
        date,
        due,
      };
      const { user, accessToken } = auth;
      await axios.put(
        `/employee/updatedate/date/${user}/${reportId}`,
        updateDate,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
        }
      );

      toast.success("Date Updated Successfully", {
        autoClose: 1000,
      });
      setTimeout(
        () => (window.location.href = `/offsys/employee/submitreport`),
        1000
      );
    } catch (err) {
      alert(err);
    }
  }

  const handleDescription = (id,index) => {
    setDue(employee.report[index].due)
    setDate(employee.report[index].date);
    setShowDescriptonModal(true);
    setReportId(id);
  };

  return (
    <>
      <div class="min-h-screen  py-5 ml-[17%] pt-20 ">
        <div class="overflow-x-auto w-full mt-36 max-h-[500px] ">
          <table class="mx-auto max-w-5xl shadow-2xl w-full whitespace-nowrap rounded-lg bg-white divide-y divide-gray-300 overflow-hidden table-auto">
            <thead class="bg-[#2E4960] sticky top-0">
              <tr class="text-white text-left">
                <th class="font-semibold text-sm uppercase text-center px-6 py-4">
                  {" "}
                  Report Name{" "}
                </th>
                <th class="font-semibold text-sm uppercase text-center px-6 py-4">
                  {" "}
                  Due date{" "}
                </th>
                <th class="font-semibold text-sm uppercase text-center px-6 py-4">
                  {" "}
                  Submitted Date{" "}
                </th>
                <th class="font-semibold text-sm uppercase px-6 py-4 text-center">
                  {" "}
                  Action{" "}
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-400">
              {employee.report &&
                employee.report.map((data, index) => (
                  <tr key={index} class="bg-gray-200 hover:bg-slate-100">
                    <td class="px-6 py-4 text-center"> {data.name}</td>
                    <td class="px-6 py-4 text-center  text-red-600 font-semibold">
                      {" "}
                      {data.due}
                    </td>
                    <td class="px-6 py-4 text-center font-semibold">
                      {" "}
                      {data.date}{" "}
                    </td>
                    <td class="py-3 px-6 text-center">
                      <div class="flex item-center justify-center">
                        <div class="w-4 mr-2 transform hover:text-yellow-500 hover:scale-110">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            onClick={() => handleDescription(data._id, index)}
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                            />
                          </svg>
                        </div>
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
                <div className="flex flex-col mb-4 mr-5">
                  <form method="post">
                    <label
                      className="mb-2 font-bold text-lg text-black ml-5"
                      for="submitdate"
                    >
                      {" "}
                      Submitted Date
                    </label>
                    <input
                      className="border py-2 px-3 text-grey-800 w-full rounded-xl shadow-md"
                      required
                      type="date"
                      value={date}
                      name="submitdate"
                      id="submitdate"
                      onChange={(e) => {
                        setDate(e.target.value);
                      }}
                    />
                    <label
                      className="mb-2 font-bold text-lg text-black ml-5"
                      for="duedate"
                    >
                      {" "}
                      Due Date
                    </label>
                    <input
                      className="border py-2 px-3 text-grey-800 w-full rounded-xl shadow-md "
                      required
                      type="date"
                      value={due}
                      name="duedate"
                      id="duedate"
                      onChange={(e) => {
                        setDue(e.target.value);
                      }}
                    />
                  </form>
                </div>
              </div>
              <div className="flex justify-center">
                <button
                  className="bg-red-600 text-white h-[35px] w-[73px] rounded-xl mr-10"
                  onClick={() => setShowDescriptonModal(false)}
                >
                  Close
                </button>

                <button
                  onClick={UpdateData}
                  className="bg-[#E65F2B] text-white h-[35px] w-[70px] rounded-xl ml-36"
                  type="submit"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default ReportSubmit;
