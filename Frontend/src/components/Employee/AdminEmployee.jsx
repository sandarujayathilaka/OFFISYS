import axios from '../../api/axios';
import React,{useState , useEffect} from "react"
import useAuth from '../../hooks/useAuth';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate,Link  } from "react-router-dom";

const Employee_URL = '/employee/addemp';
const Department_URL = '/dep/getdep';
const Subject_URL = '/sub/getsubject';
const GET_Employee_URL = '/employee/getemp';

function AdminEmployee() {
  const { auth } = useAuth();
  const [eid, setID] = useState("");
  const [name, setName] = useState("");
  const [roles, setRole] = useState("");
  const [nic, setNic] = useState("");
  const [phoneNumber, setPnum] = useState("");
  const [department, setDepartment] = useState("");
  const [email, setEmail] = useState("");
  const [rdepartment,setRDepartment] = useState([])
   const [subject, setSubject] = useState([]);
   const [allsubject, setAllSubject] = useState([]);
   const [employee,setEmployee] = useState([])
   const [report, setReport] = useState([]);
   const navigate = useNavigate();

   useEffect(() => {
    const getEmps = async () => {
      try {
        
        const { accessToken } = auth;
        const config = {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
        };

       
        const res = await axios.get(GET_Employee_URL, config);
        setEmployee(res.data);
      } catch (err) {
       
        toast.error('Error occurred while fetching employees.');
      }
    };
  
    getEmps();
  }, [auth]);

  const registerEmp = async (e) => {
    e.preventDefault();

    if (eid == "") {
      toast.warn("Please fill the Employer ID Field", {
        autoClose: 5000, // Display for 3 seconds
      });
      return;
    }
    if (eid.length < 4) {
      toast.warn("Employer ID must be at least 4 letters", {
        autoClose: 5000, // Display for 5 seconds
      });
      return;
    }
    if (name == "") {
      toast.warn("Please fill the Employer Name Field", {
        autoClose: 5000, // Display for 3 seconds
      });
      return;
    }
    if (roles == "") {
      toast.warn("Please select the Role", {
        autoClose: 5000, // Display for 3 seconds
      });
      return;
    }
    if (phoneNumber == "") {
      toast.warn("Please fill the Phone Number", {
        autoClose: 5000, // Display for 3 seconds
      });
      return;
    }
    if (nic == "") {
      toast.warn("Please fill the NIC Field", {
        autoClose: 5000, // Display for 3 seconds
      });
      return;
    }
    if (department == "") {
      toast.warn("Please select the department", {
        autoClose: 5000, // Display for 3 seconds
      });
      return;
    }
    if (email == "") {
      toast.warn("Please fill the Employer Email Field", {
        autoClose: 5000, // Display for 3 seconds
      });
      return;
    }

    try {
      const { accessToken } = auth;

      const isDuplicateID = employee.some((emp) => emp.eid === eid);

      if (isDuplicateID) {
        toast.error("Employee ID is already registered.");
        return;
      }

      await axios.post(
        Employee_URL,
        JSON.stringify({
          eid,
          name,
          roles,
          nic,
          phoneNumber,
          department,
          email,
          subject,
          report,
        }),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
        }
      );

      toast.success("Employee added successfully");

      setID("");
      setName("");
      setDepartment("");
      setNic("");
      setPnum("");
      setRole("");
      setEmail("");
      setReport([]);

      setTimeout(() => {
        navigate("/offsys/admin/getEmp");
      }, 1000);
      
    } catch (err) {
      if (!err?.response) {
        toast.error("No Server Response");
      } else if (err.response?.status === 409) {
        toast.error("Employee is already registered.");
      } else if (err.response?.status === 405) {
        toast.error(" Only one person is allowed for this role.");
      } else if (err.response?.status === 402) {
        toast.error(" Same subject value is passed multiple times.");
      } else if (err.response?.status === 403) {
        toast.error(" Same report value is passed multiple times.");
      } else {
        toast.error("Registration Failed");
      }
    }
  };

const getDeps = async () => {
    try {
      const { accessToken } = auth;
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true,
      };
      const res = await axios.get(Department_URL, config);
      setRDepartment(res.data);
    } catch (err) {
      
      toast.error('Error occurred while fetching departments.');
    }
  };
  
  useEffect(() => {
    getDeps();
  }, []);

  const getSubs = async (selectedDepartment) => {
    try {
      const { accessToken } = auth;
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true,
      };
      const res = await axios.get(Subject_URL, config);
      const filteredSubjects = res.data.filter((subject) => subject.department === selectedDepartment);
      setAllSubject(filteredSubjects);
    } catch (err) {
      
      toast.error('Error occurred while fetching subjects.');
    }
  };
  

  const handleSubjectChange = (index, event) => {
    const newSubjects = [...subject];
    newSubjects[index] = { name: event.target.value };
    setSubject(newSubjects);
  };
  

  const handleAddSubject = () => {
    setSubject([
      ...subject,
      { name: ""},
    ]);
  };

  const handleRemoveSubject = (index) => {
    const newSubjects = [...subject];
    newSubjects.splice(index, 1);
    setSubject(newSubjects);
  };



const handleReportChange = (index, event) => {
  const newReport = [...report];
  newReport[index][event.target.name] = event.target.value;
  setReport(newReport);
};

const handleAddReport = () => {
  setReport([
    ...report,
    { name: "", date: "" },
  ]);
};


const handleRemoveReport = (index) => {
  const newReport = [...report];
  newReport.splice(index, 1);
  setReport(newReport);
};
  return (
    <>

<div className="flex justify-center items-center  h-full w-full bg-white pt-5">
        <div className="w-2/3 bg-white rounded-xl border-black border-4  shadow-xl p-8 m-4 ml-64 mt-24 ">
       
          <h1 className="block w-full text-center text-black text-3xl font-bold mb-6">
            Add Employee
          </h1>

          <form method="post" className="grid grid-cols-2 gap-1">
            <div className="flex flex-col mb-4 mr-4 pt-8">
              <label className="mb-2 font-bold text-lg text-black ml-5" for="eid">Employer ID</label>
              <input
                className="border py-2 px-3 text-grey-800 w-full rounded-xl shadow-md"
                required
                type="text"
                placeholder="Employer ID"
                name="eid"
                id="eid"
                minLength="4"
                onChange={(e) => {
                  setID(e.target.value.toUpperCase());
                }}
              />
            </div>


            <div className="flex flex-col mb-4 mr-5 pt-8">
              <label className="mb-2 font-bold text-lg text-black ml-5" for="name">Employer Name </label>
              <input
                className="border py-2 px-3 text-grey-800 w-full rounded-xl shadow-md"
                required
                type="text"
                placeholder="Employer Name"
                name="name"
                id="name"
                onChange={(e) => {
                  setName(e.target.value.toUpperCase());
                }}
              />
              
              
            
            </div>
          

            <div className="flex flex-col mb-4 mr-5">
              <label className="mb-2 font-bold text-lg text-black ml-5" for="role"> Role </label>
              <select
                name="role"
                required
                id="role"
                onChange={(e) => {
                  setRole(e.target.value);
                }}
                className="border py-2 px-3 text-grey-800 w-full rounded-xl shadow-md"
              >
                <option selected disabled hidden>
                  Select Role
                </option>
                <option value="Employee">Employee</option>
                <option value="Divisional_Secretariat">Divisional_Secretariat</option>
                <option value="Admin">Admin</option>
                <option value="Assistant_Director">Assistant_Director</option>
                <option value="Assistant_District_Registar">Assistant_District_Registar</option>
                <option value="Cheif_Clerk">Cheif_Clerk</option>
                <option value="Accountant">Accountant</option>
                <option value="Administrative_Officer">Administrative_Officer</option>
              </select>
              
            </div>

            <div className="flex flex-col mb-4 mr-5">
              <label className="mb-2 font-bold text-lg text-black ml-5" for="phone"> Phone Number</label>
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
              <label className="mb-2 font-bold text-lg text-black ml-5" for="nic">
                NIC
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
              <label className="mb-2 font-bold text-lg text-black ml-5" for="department">
              Department
              </label>
              <select
  id="department"
  value={department}
  onChange={(e) => {
    setDepartment(e.target.value);
    getSubs(e.target.value);
  }}
  className="border py-2 px-3 text-grey-800 w-full rounded-xl shadow-md"
>
<option value="">Select a department</option>
  {rdepartment.map((dept) => (
    <option key={dept.id} value={dept.name}>
      {dept.name}
    </option>
  ))}
</select>
            </div>

           
            <div className="flex flex-col mb-4 mr-5">
              <label className="mb-2 font-bold text-lg text-black ml-5" for="email">Employer Email </label>
              <input
                className="border py-2 px-3 text-grey-800 w-full rounded-xl shadow-md"
                required
                type="text"
                placeholder="Employer Email"
                name="email"
                id="email"
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
              
              
            
            </div>
          

        

            {subject.map((subject, index) => (
   <div key={index} className="flex flex-col">
   <div className="flex flex-col mb-4 mr-5">
     <div className="flex flex-col">
       <label
         htmlFor="name"
         className="mb-2 font-bold text-lg text-black ml-5"
       >
        Subject:
      </label>
      <select
        id={`subject-${index}`} 
        value={subject.name} 
        onChange={(event) => handleSubjectChange(index, event)}
        className="border py-2 px-3 text-grey-800 w-full rounded-xl shadow-md"
      >
        <option value="">Select a subject</option>
        {allsubject.map((dept) => (
          <option key={dept.id} value={dept.subject}>
            {dept.subject}
          </option>
        ))}
      </select>
      </div>
                  </div>
                  <div className="flex flex-row items-center justify-center mt-4 ">
                    <button

      onClick={() => handleRemoveSubject(index)}
      className="bg-red-600 rounded-[8px] mt-[-20px] w-[80px] mr-[370px] hover:bg-red-800 text-white font-bold shadow focus:outline-none focus:shadow-outline"
      >
        Remove
      </button>
    </div>
  </div>
))}

{report.map((reportItem, index) => (
  <div key={index} className="flex flex-col">
    <div className="flex flex-col mb-4 mr-5">
      <div className="flex flex-col">
        <label
          htmlFor="name"
          className="mb-2 font-bold text-lg text-black ml-5"
        >
          Report Name:
        </label>
        <input
          type="text"
          name="name"
          value={reportItem.name}
          onChange={(event) => handleReportChange(index, event)}
          className="border py-2 px-3 text-grey-800 w-full rounded-xl shadow-md"
          placeholder="Enter Report details"
        />
      </div>
    </div>
    <div className="flex flex-row items-center justify-center mt-4 ">
      <button
        onClick={() => handleRemoveReport(index)}
        className="bg-red-600 rounded-[8px] mt-[-20px] w-[80px] mr-[370px] hover:bg-red-800 text-white font-bold shadow focus:outline-none focus:shadow-outline"
      >
        Remove
      </button>
    </div>
  </div>
))}

   </form>

   <div className="col-span-2 flex justify-center">
              <button
                type="button"
              onClick={handleAddSubject}
              className="bg-green-600 rounded-[10px] mt-5 h-10 w-[200px] m-auto hover:bg-green-700 text-white font-bold py-2 px-4 shadow focus:outline-none focus:shadow-outline"
              >
                New Subject
              </button>

              <button
                type="button"
                onClick={handleAddReport}
                className="bg-green-600 rounded-[10px] mt-5 h-10 w-[200px] m-auto hover:bg-green-700 text-white font-bold py-2 px-4 shadow focus:outline-none focus:shadow-outline"
                >
                New Report
              </button>
            </div>

      

            <div className="  ml-[350px]">
            <button
              className="bg-[#E65F2B] text-white rounded-[10px] mt-5 h-10 w-[200px] m-auto font-bold py-2 px-4 shadow focus:outline-none focus:shadow-outline"
              type="submit"
              onClick={registerEmp}
           >
              Submit
            </button>
            </div>
       
        </div>
      </div>
    
    </>
 );
}

export default AdminEmployee