import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";

function EmailVerify() {
  const [validUrl, setValidUrl] = useState(false);
  const params = useParams();
  useEffect(() => {
    async function verifyEmailUrl() {
      try {
        const res = axios.get(`https://mern-estate-server-phi.vercel.app/api/user/${params.id}/verify/${params.token}`);
        console.log(res.data);
        setValidUrl(true);
      } catch (err) {
        console.log(err);
        setValidUrl(false);
      }
    }

    verifyEmailUrl();
  }, [params]);
  return (
    <div>
      {validUrl ? (
        <div className="flex flex-col items-center justify-center h-screen">
          <h1 className="text-green-400 text-3xl text-center">
            Email is verified successfully
          </h1>
          <Link to={"/sign-in"}>
            <span className="text-center text-xl mt-5">Login</span>
          </Link>
        </div>
      ) : (
        <h1 className="text-red-500 text-center">404 not found</h1>
      )}
    </div>
  );
}

export default EmailVerify;
