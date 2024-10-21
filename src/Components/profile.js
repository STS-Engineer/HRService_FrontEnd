import React, { useState, useEffect } from "react";
import ConfirmDialog from "./Confirmdialog";
import { ArrowLeftIcon, UserIcon } from "@heroicons/react/24/outline";
const Profile = () => {
  const [user, setUser] = useState({
    id: "",
    firstname: "",
    lastname: "",
    function: "",
    department: "",
    email: "",
    profilePhoto: "",
  });
  const [file, setFile] = useState(null);
  const [isInfoChanged, setIsInfoChanged] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState(() => () => {});

  useEffect(() => {
    const fetchProfilePhoto = async () => {
      try {
        const token = localStorage.getItem("token");
        const userId = JSON.parse(localStorage.getItem("user")).id;
        const response = await fetch(
          `https://bhr-avocarbon.azurewebsites.net/auth/user/${userId}/photo`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.ok) {
          const blob = await response.blob();
          const photoUrl = URL.createObjectURL(blob);
          setProfilePhoto(photoUrl);
        }
      } catch (error) {
        console.error("Error fetching profile photo:", error);
      }
    };

    fetchProfilePhoto();
  }, []);

  useEffect(() => {
    const fetchUserDetails = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const userId = JSON.parse(localStorage.getItem("user")).id;
        const response = await fetch(
          `https://bhr-avocarbon.azurewebsites.net/auth/user/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch user details");
        }
        const data = await response.json();
        setUser(data);
        setError(null);
      } catch (error) {
        console.error("Error fetching user details:", error);
        setError(error.message || "Failed to fetch user details");
      } finally {
        setLoading(false);
      }
    };
    fetchUserDetails();
  }, []);
  useEffect(() => {
    if (message.includes("successfully")) {
      const timer = setTimeout(() => setMessage(""), 2000); // Clear message after 5 seconds
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("profile_photo", file);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `https://bhr-avocarbon.azurewebsites.net/auth/user/${user.id}/photo`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (response.ok) {
        setMessage("Profile photo updated successfully!");
        // Refresh the profile photo
        const updatedPhotoUrl = URL.createObjectURL(file);
        setProfilePhoto(updatedPhotoUrl);
      } else {
        const data = await response.json();
        setMessage(data.error || "Update failed");
      }
    } catch (error) {
      console.error("Profile update failed:", error);
      setMessage("Profile update failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInfoChange = async (e) => {
    e.preventDefault();
    setModalAction(async () => {
      setLoading(true);
      setMessage("");

      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `https://bhr-avocarbon.azurewebsites.net/auth/user/${user.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(user),
          }
        );
        if (response.ok) {
          setMessage("Profile updated successfully!");
          setIsInfoChanged(false);
        } else {
          const data = await response.json();
          setMessage(data.error || "Update failed");
        }
      } catch (error) {
        console.error("Profile update failed:", error);
        setMessage("Profile update failed: " + error.message);
      } finally {
        setLoading(false);
      }
    });
    setIsInfoModalOpen(true);
  };
  const handleBackClick = () => {
    window.history.back(); // Navigate to the previous page
  };

  if (loading) return <p className="text-blue-500">Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-lg shadow-lg">
      <button
        onClick={handleBackClick}
        className="mb-4 text-gray-500 hover:text-gray-700"
        aria-label="Back"
      >
        <ArrowLeftIcon className="w-6 h-6" />
      </button>
      <h2 className="text-2xl font-semibold mb-4 text-center">
        Update Profile
      </h2>
      {message && (
        <div
          className={`mb-4 p-4 text-sm rounded-lg ${
            message.includes("successfully")
              ? "text-green-800 bg-green-100"
              : "text-red-800 bg-red-100"
          }`}
        >
          {message}
        </div>
      )}
      <div className="mb-6 flex flex-col items-center">
        {profilePhoto ? (
          <img
            src={profilePhoto}
            alt="Profile"
            className="w-32 h-32 rounded-full mb-4 object-cover"
          />
        ) : (
          <UserIcon className="h-16 w-16 text-gray-700" />
        )}
        <form onSubmit={handleProfileUpdate} className="mb-4">
          <input
            type="file"
            onChange={handleFileChange}
            className="mb-4 block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:border file:border-gray-300
              file:rounded-lg file:text-sm file:font-medium
              hover:file:bg-gray-100"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
            disabled={loading}
          >
            {loading ? "Uploading..." : "Upload Photo"}
          </button>
        </form>
      </div>
      <div className="mb-6">
        <p className="text-gray-700 font-medium">User ID: {user.id}</p>
      </div>
      <form onSubmit={handleInfoChange}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="firstname">
            First Name
          </label>
          <input
            type="text"
            id="firstname"
            placeholder="Enter your first name"
            value={user.firstname}
            onChange={(e) => {
              setUser({ ...user, firstname: e.target.value });
              setIsInfoChanged(true);
            }}
            className="border border-gray-300 rounded-lg px-4 py-2 w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="lastname">
            Last Name
          </label>
          <input
            type="text"
            id="lastname"
            placeholder="Enter your last name"
            value={user.lastname}
            onChange={(e) => {
              setUser({ ...user, lastname: e.target.value });
              setIsInfoChanged(true);
            }}
            className="border border-gray-300 rounded-lg px-4 py-2 w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="function">
            Function
          </label>
          <input
            type="text"
            id="function"
            placeholder="Enter your function"
            value={user.function}
            onChange={(e) => {
              setUser({ ...user, function: e.target.value });
              setIsInfoChanged(true);
            }}
            className="border border-gray-300 rounded-lg px-4 py-2 w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="department">
            Department
          </label>
          <input
            type="text"
            id="department"
            placeholder="Enter your department"
            value={user.department}
            onChange={(e) => {
              setUser({ ...user, department: e.target.value });
              setIsInfoChanged(true);
            }}
            className="border border-gray-300 rounded-lg px-4 py-2 w-full"
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 mb-2" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            id="email"
            placeholder="Enter your email"
            value={user.email}
            onChange={(e) => {
              setUser({ ...user, email: e.target.value });
              setIsInfoChanged(true);
            }}
            className="border border-gray-300 rounded-lg px-4 py-2 w-full"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
          disabled={!isInfoChanged || loading}
        >
          {loading ? "Updating..." : "Update Profile"}
        </button>
      </form>

      <ConfirmDialog
        isOpen={isPhotoModalOpen}
        onClose={() => setIsPhotoModalOpen(false)}
        onConfirm={modalAction}
        title="Confirm Photo Upload"
        message="Are you sure you want to upload this photo?"
      />

      <ConfirmDialog
        isOpen={isInfoModalOpen}
        onClose={() => setIsInfoModalOpen(false)}
        onConfirm={modalAction}
        title="Confirm Profile Update"
        message="Are you sure you want to update your profile information?"
      />
    </div>
  );
};

export default Profile;
