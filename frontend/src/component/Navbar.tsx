import { type FC } from "react";
import {
  LayoutDashboard,
  Calendar,
  FileText,
  User,
  LogOut,
  MapPinned,
  OctagonAlert,
  UsersRound,
} from "lucide-react";
import Logo from "./Logo";
import { useNavigate, useParams, useLocation } from "react-router-dom";

const Sidebar: FC = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const location = useLocation(); // ✅ Get current path

  const menuItems = [   
    { name: "Dashboard", icon: LayoutDashboard, path: "dashboard" },
    { name: "Medi Minder", icon: Calendar, path: "mediminder" },
    { name: "Care Locator", icon: MapPinned, path: "carelocator" },
    { name: "Care Alert", icon: OctagonAlert, path: "carealert" },
    { name: "Care Circle", icon: UsersRound, path: "carecircle" },
  ];

  const settingsItems = [
    { name: "Profile Account", icon: User, path: "profile" },
    { name: "Sign Out", icon: LogOut, path: "logout" },
  ];

  return (
    <div className="flex flex-col w-64 h-screen bg-white border-r border-gray-200 shadow-sm rounded-r-4xl">
      {/* Logo */}
      <div className="flex items-center px-6 py-5 border-b border-gray-100">
        <div className="flex items-center space-x-1">
          <Logo size={40} />
          <span className="text-xl font-semibold text-gray-800">Svasthya</span>
        </div>
      </div>

      {/* Primary Menu */}
      <div className="flex-1 overflow-y-auto">
        <h2 className="px-3 mt-4 text-md font-semibold tracking-wider bg-gradient-to-r">
          Primary Menu
        </h2>
        <ul className="mt-2 space-y-1">
          {menuItems.map(({ name, icon: Icon, path }) => {
            const fullPath = `/${userId}/${path}`;
            const isActive = location.pathname === fullPath; // ✅ detect active item

            return (
              <li key={name}>
                <button
                  onClick={() => navigate(fullPath)}
                  className={`w-full cursor-pointer text-left flex items-center px-6 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-lime-50 text-lime-600 border-r-4 border-lime-500"
                      : "text-gray-600 hover:bg-gray-50 hover:text-lime-600"
                  }`}
                >
                  <Icon className="mr-3 w-5 h-5" />
                  {name}
                </button>
              </li>
            );
          })}
        </ul>
                {/* Settings */}
        <div className="mt-8 border-t-1 border-slate-300">
          <h2 className="px-3 mt-4 text-md font-semibold tracking-wider bg-gradient-to-r">
            Settings
          </h2>
          <ul className="mt-2 space-y-1">
            {settingsItems.map(({ name, icon: Icon, path }) => {
              const fullPath = `/${userId}/${path}`;
              const isActive = location.pathname === fullPath;

              return (
                <li key={name}>
                  <button
                    onClick={() => navigate(fullPath)}
                    className={`w-full cursor-pointer text-left flex items-center px-6 py-2.5 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-lime-50 text-lime-600 border-r-4 border-lime-500"
                        : "text-gray-600 hover:bg-gray-50 hover:text-lime-600"
                    }`}
                  >
                    <Icon className="mr-3 w-5 h-5" />
                    {name}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
