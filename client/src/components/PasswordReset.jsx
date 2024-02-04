import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function PasswordReset() {
  const [validUrl, setValidUrl] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function verifyUrl() {
      try {
        const res = axios.get(`https://mern-estate-server-phi.vercel.app/api/user/${params.id}/${params.token}`);
        console.log(res.data);
        setValidUrl(true);
      } catch (err) {
        setValidUrl(false);
        console.log(err);
      }
    }

    verifyUrl();
  }, [params]);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post(
        `https://mern-estate-server-phi.vercel.app/api/user/reset/password/${params.id}/${params.token}`,
        { password },
        {
          withCredentials: true,
        }
      );
      const data = res.data;
      if (data.error) {
        setLoading(false);
        setError(data.error);
      } else if (data.message) {
        setLoading(false);
        setMessage(data.message);
      } else {
        setLoading(false);
        navigate("/sign-in");
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  }

  return (
    <div>
      {validUrl ? (
        <div className="flex flex-col max-w-lg mx-auto">
          <h1 className="text-3xl text-center font-semibold my-10">
            Enter your new password
          </h1>
          <form onSubmit={handleSubmit} className="flex flex-col">
            <input
              type="password"
              className="p-3 rounded-lg border"
              placeholder="Enter your new password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              className="mt-5 bg-slate-700 text-white p-3 rounded-lg uppercase disabled:opacity-80"
              disabled={loading}
            >
              {loading ? "Loading..." : "Send"}
            </button>
          </form>
          {error && <p className="text-red-500 mt-5 text-center">{error}</p>}
          {message && (
            <p className="text-green-500 mt-5 text-center">{message}</p>
          )}
        </div>
      ) : (
        <h1 className="flex justify-center h-screen text-center text-red-500">
          404 not found
        </h1>
      )}
    </div>
  );
}

export default PasswordReset;
