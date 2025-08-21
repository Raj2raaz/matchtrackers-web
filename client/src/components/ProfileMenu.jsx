// ProfileMenu.jsx
import { FaUser, FaSignOutAlt, FaCog } from "react-icons/fa";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const ProfileMenu = ({ user, onLogout }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col">
      {/* User Info */}
      <div className="px-3 py-2 border-b border-gray-200 dark:border-gray-700">
        <p className="font-medium text-gray-800 dark:text-gray-100">
          {user?.name || "Guest"}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {user?.email || "guest@example.com"}
        </p>
      </div>

      {/* Logout */}
      <button
        className="w-full text-left px-3 py-2 rounded-md flex items-center gap-2 
                   hover:bg-gray-100 dark:hover:bg-gray-700
                   text-red-500 dark:text-red-400"
        onClick={() => {
          Cookies.remove("token");
          if (onLogout) onLogout();
          navigate("/cricket/");
        }}
      >
        <FaSignOutAlt className="text-red-500 dark:text-red-400" />
        <span>Logout</span>
      </button>
    </div>
  );
};

export default ProfileMenu;
