import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaSearch } from "react-icons/fa";

function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  async function handleSubmit(e) {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  }

  return (
    <header className="bg-slate-200 shadow-md">
      <div className="flex items-center w-[90%] h-[60px] mx-auto justify-between">
        <Link to={"/"}>
          <h1 className="flex flex-wrap font-bold text-sm md:text-xl">
            <span className="text-slate-500">Anas</span>
            <span className="text-slate-700">Estate</span>
          </h1>
        </Link>
        <form onSubmit={handleSubmit} className="flex bg-slate-100 rounded-lg">
          <input
            type="text"
            className="w-24 sm:w-48 md:w-64 h-10 px-3 focus:outline-none bg-transparent"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="px-3">
            <FaSearch className="text-slate-600" />
          </button>
        </form>
        <ul className="flex gap-4">
          <Link to={"/"}>
            <li className="hover:underline hidden md:block">Home</li>
          </Link>
          <Link to={"/about"}>
            <li className="hover:underline hidden md:block">About</li>
          </Link>
          {currentUser ? (
            <Link to={`/profile/${currentUser?._id}`}>
              <img
                src={currentUser.avatar}
                className="w-7 h-7 rounded-2xl"
                alt=""
              />
            </Link>
          ) : (
            <Link to={"/sign-in"}>
              <li className="hover:underline">Sign in</li>
            </Link>
          )}
        </ul>
      </div>
    </header>
  );
}

export default Header;
