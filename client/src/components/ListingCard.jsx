import { Link } from "react-router-dom";
import { FaMapMarkerAlt } from "react-icons/fa";

function ListingCard({ key, listing }) {
  return (
    <Link
      to={`/listing/${listing._id}`}
      className="w-[350px] h-[350px] bg-white rounded-lg shadow-md hover:shadow-lg"
      key={key}
    >
      <img
        src={
          listing.imageUrls[0] ||
          "https://53.fs1.hubspotusercontent-na1.net/hub/53/hubfs/Sales_Blog/real-estate-business-compressor.jpg?width=595&height=400&name=real-estate-business-compressor.jpg"
        }
        alt="listing image"
        className="w-full h-1/2 rounded-t-lg object-cover"
      />
      <div className="flex flex-wrap flex-col w-full gap-2 p-3">
        <h1 className="font-semibold text-slate-700">{listing.title}</h1>
        <div className="flex items-center gap-2">
          <FaMapMarkerAlt className="text-sm text-green-700" />
          <p className="text-xs text-slate-500">{listing.address}</p>
        </div>
        <p className="text-xs text-slate-500 overflow-hidden line-clamp-2">
          {listing.description}
        </p>
        <p className="text-slate-500 font-semibold">
          ${listing.regularPrice.toLocaleString()}{" "}
          {listing.type === "rent" && "/ month"}
        </p>
        <div className="flex gap-3">
          <p className="text-xs font-semibold">
            {listing.bathrooms} {listing.bathrooms > 1 ? "baths" : "bath"}
          </p>
          <p className="text-xs font-semibold">
            {listing.bedrooms} {listing.bedrooms > 1 ? "beds" : "bed"}
          </p>
        </div>
      </div>
    </Link>
  );
}

export default ListingCard;
