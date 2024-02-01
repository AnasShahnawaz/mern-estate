import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ListingCard from "../components/ListingCard";
import axios from "axios";

function Search() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [listings, setListings] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const [sidebarData, setSidebarData] = useState({
    searchTerm: "",
    type: "all",
    parking: false,
    furnished: false,
    offer: false,
    sort: "created_at",
    order: "desc",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const typeFromUrl = urlParams.get("type");
    const parkingFromUrl = urlParams.get("parking");
    const furnishedFromUrl = urlParams.get("furnished");
    const offerFromUrl = urlParams.get("offer");
    const sortFromUrl = urlParams.get("sort");
    const orderFromUrl = urlParams.get("order");

    console.log(searchTermFromUrl);

    if (
      searchTermFromUrl ||
      typeFromUrl ||
      parkingFromUrl ||
      furnishedFromUrl ||
      offerFromUrl ||
      sortFromUrl ||
      orderFromUrl
    ) {
      setSidebarData({
        searchTerm: searchTermFromUrl || "",
        type: typeFromUrl || "all",
        parking: parkingFromUrl === "true" ? true : false,
        furnished: furnishedFromUrl === "true" ? true : false,
        offer: offerFromUrl === "true" ? true : false,
        sort: sortFromUrl || "created_at",
        order: orderFromUrl || "desc",
      });
    }

    async function fetchListings() {
      try {
        setLoading(true);
        setShowMore(false);
        const searchQuery = urlParams.toString();
        const { data } = await axios.get(`/api/listing/get?${searchQuery}`);
        if (data.length > 8) {
          setShowMore(true);
        } else {
          setShowMore(false);
        }
        if (data.error) {
          setError(data.error);
          setLoading(false);
        }
        setListings(data);
        setLoading(false);
      } catch (error) {
        setError("Something went wrong!");
        console.log(error);
        setLoading(false);
      }
    }

    fetchListings();
  }, [location.search]);

  function handleChange(e) {
    if (
      e.target.name === "all" ||
      e.target.name === "rent" ||
      e.target.name === "sell"
    ) {
      setSidebarData({
        ...sidebarData,
        type: e.target.name,
      });
    }

    if (e.target.name === "searchTerm") {
      setSidebarData({
        ...sidebarData,
        searchTerm: e.target.value,
      });
    }

    if (
      e.target.name === "parking" ||
      e.target.name === "furnished" ||
      e.target.name === "offer"
    ) {
      setSidebarData({
        ...sidebarData,
        [e.target.name]:
          e.target.checked || e.target.checked === "true" ? true : false,
      });
    }

    if (e.target.name === "sort_order") {
      const sort = e.target.value.split("_")[0] || "created_at";

      const order = e.target.value.split("_")[1] || "desc";

      setSidebarData({ ...sidebarData, sort, order });
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set("searchTerm", sidebarData.searchTerm);
    urlParams.set("type", sidebarData.type);
    urlParams.set("parking", sidebarData.parking);
    urlParams.set("furnished", sidebarData.furnished);
    urlParams.set("offer", sidebarData.offer);
    urlParams.set("sort", sidebarData.sort);
    urlParams.set("order", sidebarData.order);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  }

  async function onShowMoreClick() {
    const numberOfListings = listings.length;
    const startIndex = numberOfListings;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("startIndex", startIndex);
    const searchQuery = urlParams.toString();
    const { data } = await axios.get(`/api/listing/get?${searchQuery}`);
    if (data.length < 9) {
      setShowMore(false);
    }
    setListings([...listings, ...data]);
  }

  return (
    <div className="flex flex-wrap flex-col md:flex-row">
      <div className="p-7 border-b-2 md:border-r-2 border-gray-300 md:min-h-screen">
        <form onSubmit={handleSubmit} className="flex flex-col gap-7">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center whitespace-nowrap gap-2">
              <label>Search Term: </label>
              <input
                type="text"
                className="p-3 w-full rounded-lg border"
                placeholder="Search..."
                name="searchTerm"
                value={sidebarData.searchTerm}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <label>Type:</label>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="all"
                className="w-5 h-5"
                onChange={handleChange}
                checked={sidebarData.type === "all"}
              />
              <span>Rent & Sell</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="rent"
                className="w-5 h-5"
                onChange={handleChange}
                checked={sidebarData.type === "rent"}
              />
              <span>Rent</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="sell"
                className="w-5 h-5"
                onChange={handleChange}
                checked={sidebarData.type === "sell"}
              />
              <span>Sell</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="offer"
                className="w-5 h-5"
                onChange={handleChange}
                checked={sidebarData.offer}
              />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <label>Amenities:</label>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="parking"
                className="w-5 h-5"
                onChange={handleChange}
                checked={sidebarData.parking}
              />
              <span>Parking</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="furnished"
                className="w-5 h-5"
                onChange={handleChange}
                checked={sidebarData.furnished}
              />
              <span>Furnished</span>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <label>Sort:</label>
            <select
              name="sort_order"
              className="p-3 rounded-lg w-1/2 border"
              defaultValue={"created_at_desc"}
              onChange={handleChange}
            >
              <option value={"regularPrice_desc"}>Price high to low</option>
              <option value={"regularPrice_asc"}>Price low to high</option>
              <option value={"createdAt_desc"}>Latest</option>
              <option value={"createdAt_asc"}>Oldest</option>
            </select>
          </div>
          <button className="bg-slate-700 text-white p-3 rounded-lg uppercase">
            Search
          </button>
        </form>
      </div>
      <div className="flex-1">
        <h1 className="text-2xl font-semibold p-5 mt-5 border-b text-slate-700 w-full">
          Listing results:
        </h1>

        {!loading && !error && listings.length < 1 && (
          <p className="text-center text-xl mt-5">Listing not found!</p>
        )}

        {loading && <p className="text-center text-xl mt-5">Loading...</p>}

        {!loading && error && (
          <p className="text-center text-xl text-red-500 mt-5">{error}</p>
        )}

        <div className="flex flex-wrap w-full p-5 gap-5">
          {!loading &&
            !error &&
            listings.length > 0 &&
            listings.map((listing) => (
              <ListingCard key={listing._id} listing={listing} />
            ))}
        </div>

        {showMore && (
          <button
            onClick={onShowMoreClick}
            className="text-green-700 hover:underline p-5"
          >
            Show more
          </button>
        )}
      </div>
    </div>
  );
}

export default Search;
