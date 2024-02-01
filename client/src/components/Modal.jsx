import { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import axios from "axios";
import { Link } from "react-router-dom";

function Modal({ listing, close }) {
  const [landlord, setLandlord] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function fetchUser() {
      try {
        const { data } = await axios.get(`/api/user/get/${listing.userId}`);
        if (data.error) {
          setError(data.error);
          return;
        } else {
          setLandlord(data);
        }
      } catch (error) {
        setError("Something went wrong");
        console.log(error);
      }
    }
    fetchUser();
  }, [listing.userId]);

  return (
    <>
      {landlord && (
        <div className="flex fixed top-0 left-0 right-0 bottom-0 z-10 bg-black bg-opacity-70">
          <div
            className="flex top-1/2 left-1/2 items-center justify-center rounded-lg fixed bg-white w-[300px] h-[350px] md:w-[500px] p-5"
            style={{
              transform: "translate(-50%, -50%)",
            }}
          >
            <form className="flex flex-col gap-4">
              <p className="text-sm">
                Contact{" "}
                <span className="font-semibold">{landlord.username}</span> for{" "}
                <span className="font-semibold">{listing.title}</span>
              </p>
              <textarea
                className="border p-3"
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <Link
                to={`mailto:${landlord.email}?subject=Regarding ${listing.title}&body=${message}`}
                className="bg-slate-700 text-white text-center rounded-lg p-2 uppercase disabled:opacity-85 hover:opacity-95"
              >
                Send Message
              </Link>
            </form>
            <FaTimes
              className="absolute top-[5%] right-[5%] text-2xl text-slate-700 cursor-pointer"
              onClick={close}
            />
          </div>
        </div>
      )}
    </>
  );
}

export default Modal;
