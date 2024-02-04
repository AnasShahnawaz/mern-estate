import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { useSelector } from "react-redux";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkerAlt,
  FaParking,
  FaShare,
} from "react-icons/fa";
import Modal from "../components/Modal";
import axios from "axios";

function Listing() {
  SwiperCore.use([Navigation]);
  const { currentUser } = useSelector((state) => state.user);
  const [listing, setListing] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const params = useParams();

  useEffect(() => {
    async function fetchListing() {
      try {
        setLoading(true);
        setError(false);
        const { data } = await axios.get(
          `https://mern-estate-server-phi.vercel.app/api/listing/get/${params.listingId}`
        );
        if (data.error) {
          setLoading(false);
          setError(true);
          return;
        } else {
          setLoading(false);
          setError(false);
          setListing(data);
        }
      } catch (error) {
        setError(true);
        setLoading(false);
        console.log(error);
      }
    }
    fetchListing();
  }, [params.listingId]);

  return (
    <main>
      {loading && <p className="text-center text-2xl my-7">Loading...</p>}
      {error && (
        <p className="text-center text-2xl my-7">
          Something went wrong, please try again later
        </p>
      )}
      {listing && !loading && !error && (
        <div>
          <Swiper navigation>
            {listing.imageUrls &&
              listing.imageUrls.length > 0 &&
              listing.imageUrls.map((url) => (
                <SwiperSlide key={url}>
                  <div
                    className="h-[550px]"
                    style={{
                      background: `url(${url}) center no-repeat`,
                      backgroundSize: "cover",
                    }}
                  ></div>
                </SwiperSlide>
              ))}
          </Swiper>
          <div className="fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer">
            <FaShare
              className="text-slate-500"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                }, [2000]);
              }}
            />
          </div>
          {copied && (
            <div className="fixed top-[23%] right-[5%] z-10 flex items-center justify-center bg-white w-28 h-8 text-md rounded-lg">
              <p>Link Copied!</p>
            </div>
          )}
          <div className="flex flex-wrap flex-col flex-wrap p-3 my-7 max-w-4xl mx-auto gap-4">
            <h1 className="font-semibold text-2xl">
              {listing.type === "rent"
                ? `${
                    listing.title
                  } - $${listing.regularPrice?.toLocaleString()} / month`
                : `${
                    listing.title
                  } - $${listing.regularPrice?.toLocaleString()}`}
            </h1>
            <p className="flex flex-wrap mt-5 items-center text-sm text-gray-700 font-semibold gap-2">
              <FaMapMarkerAlt className="text-green-700" />
              {listing.address}
            </p>
            <div className="flex flex-wrap gap-4">
              <p className="flex flex-wrap items-center justify-center bg-red-900 text-white w-48 h-8 rounded-md">
                {listing.type === "sell" ? "For Sell" : "For Rent"}
              </p>
              {listing.discountedPrice && (
                <p className="flex flex-wrap items-center justify-center bg-green-900 text-white w-48 h-8 rounded-md">
                  ${listing.discountedPrice?.toLocaleString()} discount
                </p>
              )}
            </div>
            <p className="text-slate-800">
              <span className="font-semibold text-black">Description - </span>
              {listing.description}
            </p>
            <div className="flex flex-wrap gap-5">
              <div className="flex items-center gap-1">
                <FaBed className="text-slate-700 text-lg" />
                <label className="text-slate-700 text-sm font-semibold">
                  {listing.bedrooms} Beds
                </label>
              </div>
              <div className="flex flex-wrap items-center gap-1">
                <FaBath className="text-slate-700 text-lg" />
                <label className="text-slate-700 text-sm font-semibold">
                  {listing.bathrooms} Baths
                </label>
              </div>
              <div className="flex flex-wrap items-center gap-1">
                <FaParking className="text-slate-700 text-lg" />
                <label className="text-slate-700 text-sm font-semibold">
                  {listing.parking ? "Parking spot" : "No parking"}
                </label>
              </div>
              <div className="flex flex-wrap items-center gap-1">
                <FaChair className="text-gray-700 text-lg" />
                <label className="text-slate-700 text-sm font-semibold">
                  {listing.furnished ? "Furnished" : "Not furnished"}
                </label>
              </div>
            </div>
            <button
              className="bg-slate-700 text-white p-3 mt-10 rounded-lg uppercase hover:opacity-95"
              onClick={() => setIsOpen(true)}
            >
              Contact landlord
            </button>
            {isOpen && (
              <Modal listing={listing} close={() => setIsOpen(false)} />
            )}
          </div>
        </div>
      )}
    </main>
  );
}

export default Listing;
