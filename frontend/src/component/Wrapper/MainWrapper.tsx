import { useState, type ReactNode } from "react";
import Sidebar from "../../component/Navbar";
import { Menu } from "lucide-react";
import Logo from "../Logo";

interface MainWrapperProps {
  children: ReactNode;
}

export const MainWrapper = ({ children }: MainWrapperProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-full ">
      {/* Sidebar for desktop */}
      <div className="hidden md:block w-64 flex-shrink-0 bg-white ">
        <Sidebar />
      </div>

      {/* Mobile Sidebar (slide-out) */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 md:hidden transition-opacity ${
          isSidebarOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setIsSidebarOpen(false)}
      >
        <div
          className={`absolute top-0 left-0 h-full w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <Sidebar />
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto p-2 md:p-6">
        {/* Mobile navbar */}
        <div className="flex items-center justify-between md:hidden mb-4">
            <h1 className="text-lg flex justify-center items-center gap-1 font-semibold text-gray-800">
                <Logo size={32}/> Svasthya
            </h1>
          <button
            className="p-2 rounded-md hover:bg-gray-100 shadow-sm"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu className="w-6 h-6 text-gray-700" />
          </button>
        </div>

        {children}
      </main>
    </div>
  );
};
