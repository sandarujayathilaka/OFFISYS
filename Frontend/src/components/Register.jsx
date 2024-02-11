import { useState, useEffect } from "react";
import axios from '../api/axios';
import React from 'react';
import logo from '../image/1.png';
import moto from "../image/Capture.PNG";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate} from 'react-router-dom';

const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const REGISTER_URL = '/register';

function Register() {


  const navigate = useNavigate();
  const [user, setUser] = useState('');
  const [ validName,setValidName ] = useState(false);
  const [pwd, setPwd] = useState('');
  const [validPwd,setValidPwd] = useState(false);
  const [matchPwd, setMatchPwd] = useState('');
  const [validMatch,setValidMatch] = useState(false);
  const [setRole] = useState('');
  const [success] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [reshowPassword, setReShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  
  useEffect(() => {
    setValidName(USER_REGEX.test(user));
  }, [user]);



  useEffect(() => {
    setValidPwd(PWD_REGEX.test(pwd));
    setValidMatch(pwd === matchPwd);
  }, [pwd, matchPwd]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const v1 = USER_REGEX.test(user);
    const v2 = PWD_REGEX.test(pwd);
    if (!v1) {
      toast.error("Please Enter Valid Username");
      return;
    }
    if (!v2) {
      toast.error("Password conditions not matched");
      return;
    }

    setLoading(true);
    
    
    try {
      await axios.post(REGISTER_URL, JSON.stringify({ user, pwd, matchPwd }), {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      toast.success("Registered successfully");
      toast.success("Please login");
      //clear state and controlled inputs
      setUser("");
      setPwd("");
      setMatchPwd("");
      setTimeout(() => {
        navigate("/offsys");
      }, 1000);
    } catch (err) {
      if (!err?.response) {
        console.log(err);
        toast.error("No Server Response");
      } else if (err.response?.status === 409) {
        toast.error("Username Taken. Please Login");
      } else if (err.response?.status === 404) {
        toast.error("You are not authorized person");
      } else if (err.response?.status === 401) {
        toast.error("Password mismatching");
      } else {
        toast.error("Registration Failed");
      }
    } finally {
      setLoading(false); // Stop loading
    }
    
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const retogglePasswordVisibility = () => {
    setReShowPassword((prevState) => !prevState);
  };

  return (
    <>
      {loading ? ( // Render the loading page if loading state is true
        <div className="h-screen bg-teal-900 text-white flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="50"
            height="50"
            fill="currentColor"
            className="bi bi-arrow-repeat animate-spin"
            viewBox="0 0 16 16"
          >
            <path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z" />
            <path
              fillRule="evenodd"
              d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z"
            />
          </svg>
        </div>
      ) : success ? (
        <section>
          <h1>Success!</h1>
          <p>
            <a href="#">Sign In</a>
          </p>
        </section>
      ) : (
        <section>
          <div className="flex items-center justify-center h-screen  bg-teal-900">
            <img
              src={moto}
              alt="react logo"
              className="w-2/3 max-w-xl absolute top-0 right-0"
            />
            <div
              className="absolute left-0 top-0 w-[450px] h-[720px] bg-no-repeat opacity-20 "
              style={{
                backgroundImage: `url(${logo})`,
                backgroundSize: "cover",
              }}
            ></div>
            <div className="relative flex flex-col items-center justify-center h-full  ">
              <h1 className="text-white text-4xl font-bold mb-10">
                Create an Account
              </h1>
              <form
                className="flex flex-col items-center "
                onSubmit={handleSubmit}
              >
                <input
                  type="text"
                  placeholder="Employer ID"
                  className="w-72 h-12 px-4 mb-5 rounded"
                  required
                  onChange={(e) => {
                    setUser(e.target.value.toUpperCase());
                  }}
                />
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"} // Update input type based on showPassword state
                    placeholder="Password"
                    className="w-72 h-12 px-4 mb-8 rounded pr-10" // Added pr-10 to reserve space for the icon
                    onChange={(e) => {
                      setPwd(e.target.value);
                    }}
                    required
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-1/2 transform -translate-y-2/3 text-gray-500 flex items-center justify-center h-full focus:outline-none"
                    style={{ transformOrigin: "center" }} // Center icon vertically
                  >
                    {showPassword ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 4.586l-6.707-6.707-1.414 1.414L8.586 10l-6.707 6.707 1.414 1.414L10 13.414l6.707 6.707 1.414-1.414L11.414 10l6.707-6.707-1.414-1.414L10 4.586zM5.293 13L10 17.707l4.707-4.707L15.293 13 10 18.293 4.707 13 5.293 13zm0-6l4.707 4.707-1.414 1.414L4.879 8l4.707-4.707 1.414 1.414L5.293 7zm7.414-3.707L10 2.293l1.293 1.293L12.707 4.5l-2-2zM13 6.707l1.707-1.707 1.414 1.414L14.5 8l2 2-1.414 1.414L13 9.293l-2 2-1.414-1.414L11.5 8l-2-2L8.293 4.293 10 2.586 13 5.586zm3.707 7.414L17.707 13l-4.707 4.707-1.414-1.414L16.5 13l-4.707-4.707 1.414-1.414L18.707 12l-1.707 1.707z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M7.86 5.14A4 4 0 0110 6c1.418 0 2.824.567 3.868 1.645a1 1 0 101.732-.993A6 6 0 0010 4a6 6 0 00-6 6c0 1.418.567 2.824 1.645 3.868a1 1 0 00.993 1.732A6 6 0 014 10a6 6 0 016-6c.97 0 1.918.231 2.773.667a1 1 0 00.874-1.82A7.963 7.963 0 0010 2a8 8 0 00-8 8c0 2.183.88 4.15 2.31 5.59a1 1 0 101.42-1.42A6.004 6.004 0 014 18a6 6 0 01-6-6c0-1.183.34-2.32.985-3.29a1 1 0 10-1.83-.88A7.963 7.963 0 000 10a8 8 0 008 8c3.453 0 6.39-2.177 7.536-5.218a1 1 0 10-1.85-.765A6.02 6.02 0 0114 14a6 6 0 01-3.532-1.146a1 1 0 00-.768-.106l-.105.046z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </button>
                </div>

                <div className="ml-[120px] text-sm text-red-500">
                  {pwd.length > 0 && (
                    <>
                      {pwd.length < 8 && (
                        <div>
                          - Password should be at least 8 characters long.
                        </div>
                      )}
                      {!/[a-z]/.test(pwd) && (
                        <div>
                          - Password should contain at least one lowercase
                          letter.
                        </div>
                      )}
                      {!/[A-Z]/.test(pwd) && (
                        <div>
                          - Password should contain at least one uppercase
                          letter.
                        </div>
                      )}
                      {!/[0-9]/.test(pwd) && (
                        <div>- Password should contain at least one digit.</div>
                      )}
                      {!/[!@#$%]/.test(pwd) && (
                        <div>
                          - Password should contain at least one special
                          character (!@#$%).
                        </div>
                      )}
                      {pwd.length > 24 && (
                        <div>
                          - Password should be at most 24 characters long.
                        </div>
                      )}
                    </>
                  )}
                </div>

                <div className="relative">
                  <input
                    type={reshowPassword ? "text" : "password"} // Update input type based on showPassword state
                    placeholder="Re-enter Password"
                    className="w-72 h-12 px-4 mb-8 rounded pr-10" // Added pr-10 to reserve space for the icon
                    onChange={(e) => {
                      setMatchPwd(e.target.value);
                    }}
                    required
                  />
                  <button
                    type="button"
                    onClick={retogglePasswordVisibility}
                    className="absolute right-3 top-1/2 transform -translate-y-2/3 text-gray-500 flex items-center justify-center h-full focus:outline-none"
                    style={{ transformOrigin: "center" }} // Center icon vertically
                  >
                    {reshowPassword ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 4.586l-6.707-6.707-1.414 1.414L8.586 10l-6.707 6.707 1.414 1.414L10 13.414l6.707 6.707 1.414-1.414L11.414 10l6.707-6.707-1.414-1.414L10 4.586zM5.293 13L10 17.707l4.707-4.707L15.293 13 10 18.293 4.707 13 5.293 13zm0-6l4.707 4.707-1.414 1.414L4.879 8l4.707-4.707 1.414 1.414L5.293 7zm7.414-3.707L10 2.293l1.293 1.293L12.707 4.5l-2-2zM13 6.707l1.707-1.707 1.414 1.414L14.5 8l2 2-1.414 1.414L13 9.293l-2 2-1.414-1.414L11.5 8l-2-2L8.293 4.293 10 2.586 13 5.586zm3.707 7.414L17.707 13l-4.707 4.707-1.414-1.414L16.5 13l-4.707-4.707 1.414-1.414L18.707 12l-1.707 1.707z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M7.86 5.14A4 4 0 0110 6c1.418 0 2.824.567 3.868 1.645a1 1 0 101.732-.993A6 6 0 0010 4a6 6 0 00-6 6c0 1.418.567 2.824 1.645 3.868a1 1 0 00.993 1.732A6 6 0 014 10a6 6 0 016-6c.97 0 1.918.231 2.773.667a1 1 0 00.874-1.82A7.963 7.963 0 0010 2a8 8 0 00-8 8c0 2.183.88 4.15 2.31 5.59a1 1 0 101.42-1.42A6.004 6.004 0 014 18a6 6 0 01-6-6c0-1.183.34-2.32.985-3.29a1 1 0 10-1.83-.88A7.963 7.963 0 000 10a8 8 0 008 8c3.453 0 6.39-2.177 7.536-5.218a1 1 0 10-1.85-.765A6.02 6.02 0 0114 14a6 6 0 01-3.532-1.146a1 1 0 00-.768-.106l-.105.046z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </button>
                </div>

                <div className="ml-[120px] text-sm text-red-500">
                  {matchPwd.length > 0 && (
                    <>
                      {matchPwd.length < 8 && (
                        <div>
                          - Password should be at least 8 characters long.
                        </div>
                      )}
                      {!/[a-z]/.test(matchPwd) && (
                        <div>
                          - Password should contain at least one lowercase
                          letter.
                        </div>
                      )}
                      {!/[A-Z]/.test(matchPwd) && (
                        <div>
                          - Password should contain at least one uppercase
                          letter.
                        </div>
                      )}
                      {!/[0-9]/.test(matchPwd) && (
                        <div>- Password should contain at least one digit.</div>
                      )}
                      {!/[!@#$%]/.test(matchPwd) && (
                        <div>
                          - Password should contain at least one special
                          character (!@#$%).
                        </div>
                      )}
                      {pwd.length > 24 && (
                        <div>
                          - Password should be at most 24 characters long.
                        </div>
                      )}
                    </>
                  )}
                </div>

                <button className="w-32 h-10 mt-5 bg-[#E65F2B] text-white font-bold rounded">
                  Create Account
                </button>
              </form>

              <h6 className="text-white text-sm mt-4 ">
                Already have an account{" "}
                <a className="text-[#E65F2B]" href="/offsys">
                  Login
                </a>
              </h6>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default Register;
