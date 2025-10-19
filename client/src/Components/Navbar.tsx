import { User } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  return (
    <>
      <nav className="bg-gray-900 border-b border-gray-700 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div
            className="flex items-center gap-3"
            onClick={() => navigate("/")}
          >
            <h1 className="text-4xl text-white font-bold">StockVault</h1>
          </div>

          <div className="flex items-center gap-4">
            <button
              className="w-10 h-10 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center transition-colors"
              onClick={() => setDropdownOpen(true)}
            >
              <User className="w-5 h-5" />
            </button>

            {dropdownOpen && (
              <div className="absolute right-6 mt-12 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50">
                <div className="py-2">
                  <a
                    href="/profile"
                    className="block px-4 py-2 text-white hover:bg-gray-700 transition-colors"
                  >
                    Profile
                  </a>
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-white hover:bg-gray-700 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
