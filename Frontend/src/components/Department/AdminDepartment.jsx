import React,{useState} from "react"
import { useEffect } from "react"
import axios from '../../api/axios';
import useAuth from '../../hooks/useAuth';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate,Link  } from "react-router-dom";

const Department_URL = '/dep/adddep';
const Get_Department_URL = '/dep/getdep';//get

function AdminDepartment() {
  const { auth } = useAuth();
  const [did, setID] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const [department,setDepartment] = useState([])

  useEffect(() => {
    const getDeps = async () => {
      try {
        const {  accessToken } = auth;
        
        const config = {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
        };
        const res = await axios.get(Get_Department_URL, config);
        setDepartment(res.data);
      } catch (err) {
        
        toast.error('Error occurred while fetching departments.');
      }
    };
  
    getDeps();
  }, [auth]);

  const registerDep = async (e) => {
    e.preventDefault();
  
    try {
    
      const { accessToken } = auth;
    
  
      const isDuplicateID = department.some((dept) => dept.did === did);
      const isDuplicateName = department.some((dept) => dept.name === name);
  
      if (isDuplicateID) {
        toast.error("Department ID is already used.");
        return;
      }
  
      if (isDuplicateName) {
        toast.error("Department Name is already used.");
        return;
      }
  
      await axios.post(
        Department_URL,
        JSON.stringify({ did, name }),
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
        }
      );
  
      toast.success("Department added successfully");
  
      setID("");
      setName("");
  
      setTimeout(() => {
        navigate("/offsys/admin/getDep");
      }, 1000);
    } catch (err) {
      if (!err?.response) {
        toast.error('No Server Response');
      } else {
        toast.error('Registration Failed');
      }
      
    }
  };

  return (
    <>

<div className="flex justify-center items-center  h-full w-full bg-white pt-24">
        <div className="w-2/3 bg-white rounded-xl border-black border-4  shadow-xl p-8 m-4 ml-64 mt-24">

         <h1 className="block w-full text-center text-black text-3xl font-bold mb-6">
            Add Department
          </h1>

          <form onSubmit={registerDep} method="post" className="grid grid-cols-2 gap-1">
            <div className="flex flex-col mb-4 mr-4 pt-8">
              <label className="mb-2 font-bold text-lg text-black ml-5" for="did">Department ID</label>
              <input
                className="border py-2 px-3 text-grey-800 w-full rounded-xl shadow-md"
                required
                type="text"
                placeholder="Department ID"
                name="did"
                id="did"
                onChange={(e) => {
                  setID(e.target.value.toUpperCase());
                }}
              />
            </div>


            <div className="flex flex-col mb-4 mr-5 pt-8">
              <label className="mb-2 font-bold text-lg text-black ml-5" for="name">Department Name </label>
              <input
                className="border py-2 px-3 text-grey-800 w-full rounded-xl shadow-md"
                required
                type="text"
                placeholder="Department Name"
                name="name"
                id="name"
                onChange={(e) => {
                  setName(e.target.value.toUpperCase());
                }}
              />
              
            </div>
          

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
 )
}

export default AdminDepartment