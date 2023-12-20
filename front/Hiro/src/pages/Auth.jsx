import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { Office } from "../assets";
import { SignUp } from "../components";

const Auth = () =>
{
  const { user } = useSelector((state) => state.user);
  const [open, setOpen] = useState(true);
  const location = useLocation();

  let from = location?.state?.from?.pathname || "/";

  // Check if the user is a seeker or a company and set the default path accordingly
  if (user.token)
  {
    if (user.accountType === "seeker")
    {
      from = "/find-jobs"; // Set the default path for seekers
    } else
    {
      from = "/applicants"; // Set the default path for companies
    }
    return window.location.replace(from);
  }
  return (
    <div className='w-full '>
      <img src={Office} alt='Office' className='object-contain ' />

      <SignUp open={open} setOpen={setOpen} />
    </div>
  );
};

export default Auth;
