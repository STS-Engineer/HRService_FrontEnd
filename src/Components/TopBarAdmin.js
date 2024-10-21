import React, { useState, useEffect, Fragment } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Menu, Transition } from "@headlessui/react";
import {
  BellIcon,
  UserIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";

const TopBarAdmin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState({
    firstname: "Admin",
    lastname: "",
    profilePhoto: "/avatar.jpg",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("https://bhr-avocarbon.azurewebsites.net/auth/users/"); // Adjust the endpoint as needed
        const data = await response.json();
        setUser({
          firstname: data.firstname,
          lastname: data.lastname,
          profilePhoto: data.profilePhoto,
        });
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    navigate("/login");
  };

  const getTitle = () => {};

  return (
    <div className="bg-orange-400 p-4 flex justify-between items-center text-white">
      <div className="text-lg font-semibold">{getTitle()}</div>
      <div className="flex items-center space-x-4">
        <button
          type="button"
          className="relative rounded-full bg-orange-400 p-1 text-white hover:text-gray-200 focus:outline-none"
        >
          <span className="sr-only">View notifications</span>
          <BellIcon className="h-6 w-6" aria-hidden="true" />
        </button>

        <Menu as="div" className="relative">
          <div>
            <Menu.Button className="flex items-center space-x-2">
              <span>{`${user.firstname} ${user.lastname}`}</span>
              <img
                src={user.profilePhoto || "/default-avatar.jpg"}
                alt="avatar"
                className="w-8 h-8 rounded-full"
              />
            </Menu.Button>
          </div>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <Menu.Item>
                {({ active }) => (
                  <a
                    href="/profile"
                    className={`${
                      active ? "bg-gray-100" : ""
                    } flex items-center px-4 py-2 text-sm text-gray-700`}
                  >
                    <UserIcon className="mr-2 h-5 w-5 text-gray-500" />
                    Profile
                  </a>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={handleLogout}
                    className={`${
                      active ? "bg-gray-100" : ""
                    } flex items-center w-full px-4 py-2 text-sm text-gray-700`}
                  >
                    <ArrowRightOnRectangleIcon className="mr-2 h-5 w-5 text-gray-500" />
                    Logout
                  </button>
                )}
              </Menu.Item>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    </div>
  );
};

export default TopBarAdmin;
