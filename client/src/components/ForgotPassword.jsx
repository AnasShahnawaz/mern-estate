import React, { useState } from "react";
import axios from "axios";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post('/api/user/reset/password', { email });
      const data = await res.data;
      if (data.error) {
        setLoading(false);
        setError(data.error);
      } else if (data.message) {
        setLoading(false);
        setMessage(data.message);
      } else {
        return;
      }
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="flex flex-col max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-10">
        Enter Your Email
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col">
        <input
          type="email"
          className="p-3 rounded-lg border"
          placeholder="Enter your email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          className="mt-5 bg-slate-700 text-white p-3 rounded-lg uppercase disabled:opacity-80"
          disabled={loading}
        >
          {loading ? "Loading..." : "Send"}
        </button>
      </form>
      {error && <p className="text-red-500 mt-5 text-center">{error}</p>}
      {message && <p className="text-green-500 mt-5 text-center">{message}</p>}
    </div>
  );
}

export default ForgotPassword;
