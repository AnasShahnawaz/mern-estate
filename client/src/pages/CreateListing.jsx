import React, { useState } from "react";
import { app } from "../firebase";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function CreateListing() {
  const { currentUser } = useSelector((state) => state.user);
  const [files, setFiles] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [imageUploadError, setImageUploadError] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    userId: currentUser?._id,
    imageUrls: [],
    title: "",
    description: "",
    address: "",
    type: "rent",
    regularPrice: 50,
    discountedPrice: 50,
    bathrooms: 1,
    bedrooms: 1,
    furnished: false,
    parking: false,
    offer: false,
  });
  const navigate = useNavigate();

  function handleChange(e) {
    if (e.target.name === "sell" || e.target.name === "rent") {
      setFormData({
        ...formData,
        type: e.target.name,
      });
    }

    if (
      e.target.type === "number" ||
      e.target.type === "text" ||
      e.target.type === "textarea"
    ) {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    }

    if (
      e.target.name === "parking" ||
      e.target.name === "furnished" ||
      e.target.name === "offer"
    ) {
      setFormData({
        ...formData,
        [e.target.name]: e.target.checked,
      });
    }

    if (
      e.target.name === "regularPrice" ||
      e.target.name === "discountedPrice"
    ) {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    }

    if (e.target.name === "bedrooms" || e.target.name === "bathrooms") {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    }
  }

  async function handleImageUpload() {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUploadError(false);
          setUploading(false);
        })
        .catch((err) => {
          setImageUploadError("Image upload failed (2 mb max per image)");
          setUploading(false);
        });
    } else {
      setImageUploadError("You can only upload 6 images per listing");
      setUploading(false);
    }
  }

  async function storeImage(file) {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  }

  function handleRemoveImage(index) {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (formData.imageUrls.length < 1) {
        return setError("You must upload at least one image");
      }
      if (formData.regularPrice < formData.discountedPrice) {
        return setError("Discounted price must be lower than regular price");
      }
      setLoading(true);
      setError(null);
      const res = await axios.post("/api/listing/create", formData);
      const data = res.data;
      if (data.error) {
        setLoading(false);
        setError(data.error);
      } else {
        setLoading(false);
        navigate(`/listing/${data._id}`);
      }
    } catch (error) {
      setLoading(false);
      setError("Internal server error");
      console.log(error);
    }
  }

  console.log(formData);

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="font-semibold text-2xl md:text-3xl text-center my-7">
        Create a listing
      </h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row flex-wrap gap-4"
      >
        <div className="flex flex-col gap-4 flex-1">
          <div className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Title"
              name="title"
              className="p-3 rounded-lg border"
              required
              onChange={handleChange}
              value={formData.title}
            />
            <textarea
              type="text"
              name="description"
              placeholder="Description"
              className="p-3 rounded-lg border"
              required
              onChange={handleChange}
              value={formData.description}
            ></textarea>
            <input
              type="text"
              placeholder="Address"
              name="address"
              className="p-3 rounded-lg border"
              required
              onChange={handleChange}
              value={formData.address}
            />
          </div>
          <div className="flex items-center gap-5 flex-wrap">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="sell"
                className="w-5 h-5"
                onChange={handleChange}
                checked={formData.type === "sell"}
              />
              <label>Sell</label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="rent"
                className="w-5 h-5"
                onChange={handleChange}
                checked={formData.type === "rent"}
              />
              <label>Rent</label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="parking"
                className="w-5 h-5"
                onChange={handleChange}
                checked={formData.parking}
              />
              <label>Parking spot</label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="furnished"
                className="w-5 h-5"
                onChange={handleChange}
                checked={formData.furnished}
              />
              <label>Furnished</label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="offer"
                className="w-5 h-5"
                onChange={handleChange}
                checked={formData.offer}
              />
              <label>Offer</label>
            </div>
          </div>
          <div className="flex gap-5 flex-wrap">
            <div className="flex items-center gap-2">
              <input
                type="number"
                name="bedrooms"
                className="w-24 h-12 px-2 border border-gray-300 rounded-lg"
                required
                min="1"
                max="10"
                onChange={handleChange}
                value={formData.bedrooms}
              />
              <label>Beds</label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                name="bathrooms"
                className="w-24 h-12 px-2 border border-gray-300 rounded-lg"
                required
                min="1"
                max="10"
                onChange={handleChange}
                value={formData.bathrooms}
              />
              <label>Baths</label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                name="regularPrice"
                className="w-32 h-12 px-2 border border-gray-300 rounded-lg"
                required
                min="50"
                max="1000000"
                onChange={handleChange}
                value={formData.regularPrice}
              />
              <label className="flex flex-col items-center">
                <span>Regular price</span>
                <span className="text-xs">($ / Month)</span>
              </label>
            </div>
            {formData.offer && (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  name="discountedPrice"
                  className="w-32 h-12 px-2 border border-gray-300 rounded-lg"
                  required
                  min="50"
                  max="1000000"
                  onChange={handleChange}
                  value={formData.discountedPrice}
                />
                <label className="flex flex-col items-center">
                  <span>Discounted price</span>
                </label>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-4 flex-wrap">
          <p>
            <span className="font-semibold">Images</span>: The first image will
            be the cover (max 6)
          </p>
          {imageUploadError && (
            <p className="text-red-700 text-sm">{imageUploadError}</p>
          )}
          <div className="flex gap-4">
            <div className="border border-gray-300 p-3 rounded">
              <input
                onChange={(e) => setFiles(e.target.files)}
                type="file"
                name="images"
                accept="image/*"
                multiple
              />
            </div>
            <button
              type="button"
              className="border border-green-700 text-green-700 rounded p-3 uppercase"
              onClick={handleImageUpload}
              disabled={uploading}
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>
          <div className="flex flex-col border">
            {formData.imageUrls.length > 0 &&
              formData.imageUrls.map((url, index) => (
                <div className="flex justify-between p-5" key={url}>
                  <img
                    src={url}
                    alt="listing image"
                    className="w-20 rounded-lg"
                  />
                  <button
                    type="button"
                    className="text-red-700 uppercase p-3"
                    onClick={() => handleRemoveImage(index)}
                  >
                    Delete
                  </button>
                </div>
              ))}
          </div>
          <button
            className="bg-gray-700 text-white rounded-lg p-3 uppercase disabled:opacity-85 hover:opacity-95"
            disabled={loading || uploading}
          >
            {loading ? "Creating..." : "Create Listing"}
          </button>
          {error && (
            <p className="text-red-700 text-sm text-center mt-3">{error}</p>
          )}
        </div>
      </form>
    </main>
  );
}

export default CreateListing;
