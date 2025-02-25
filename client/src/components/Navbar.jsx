import React from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";

function Navbar({ user, onLogout }) {
  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-lg font-bold">
          Image App
        </Link>
        {user && (
          <Link to="/all-images" className="text-white mr-4">
            All Images
          </Link>
        )}
        {user ? (
          <Button
            onClick={onLogout}
            variant="outline"
            className="text-gray-700 border-gray-300 hover:bg-gray-700 hover:text-white"
          >
            Logout
          </Button>
        ) : (
          <div>
            <Link to="/login" className="mr-4">
              Login
            </Link>
            <Link to="/signup">Signup</Link>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
