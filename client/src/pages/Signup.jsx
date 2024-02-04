import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import OAuth from "../components/OAuth";

function Signup() {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  async function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await axios.post("https://mern-estate-server-phi.vercel.app/api/auth/signup", formData, {
        withCredentials: true,
      });
      if (data.error) {
        setLoading(false);
        setError(data.error);
        return;
      } else {
        setLoading(false);
        setMessage(data.message);
      }
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="flex flex-col max-w-lg mx-auto p-5">
      <h1 className="my-7 font-semibold text-3xl text-center">Sign Up</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          className="p-3 rounded-lg border"
          placeholder="Username"
          required
          name="username"
          onChange={handleChange}
        />
        <input
          type="email"
          className="p-3 rounded-lg border"
          placeholder="Email"
          required
          name="email"
          onChange={handleChange}
        />
        <input
          type="password"
          className="p-3 rounded-lg border"
          placeholder="Password"
          required
          name="password"
          onChange={handleChange}
        />
        <button
          className="uppercase p-3 text-white bg-slate-700 rounded-lg disabled:opacity-80"
          disabled={loading}
        >
          {loading ? "Loading..." : "Sign up"}
        </button>
        <OAuth />
      </form>
      <div className="flex mt-5 gap-2">
        <p>Dont have an account?</p>
        <Link to={"/sign-in"}>
          <span className="text-blue-700 hover:underline">Sign in</span>
        </Link>
      </div>
      {error && <p className="text-red-500 mt-5 text-center">{error}</p>}
      {message && <p className="text-green-500 mt-5 text-center">{message}</p>}
    </div>
  );
}

export default Signup;
