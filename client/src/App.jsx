import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link,
} from "react-router-dom"; // Import Link
import LoginForm from "./components/LoginForm";
import SignupForm from "./components/SignupForm";
import Navbar from "./components/Navbar";
import Folder from "./components/Folder";
import ImageUpload from "./components/ImageUpload";
import ImageList from "./components/ImageList";
import AllImages from "./components/AllImages";
import { jwtDecode } from "jwt-decode";
import { getFolders } from "./api";

function App() {
  const [user, setUser] = useState(null);
  const [folders, setFolders] = useState([]);
  const [currentFolder, setCurrentFolder] = useState(null);
  const [breadcrumbs, setBreadcrumbs] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
      } catch (error) {
        console.error("Invalid token:", error);
        localStorage.removeItem("token");
      }
    }
  }, []);

  useEffect(() => {
    const fetchUserFolders = async () => {
      if (user) {
        try {
          const fetchedFolders = await getFolders();
          setFolders(fetchedFolders.data);
        } catch (error) {
          console.error("Error fetching folders:", error);
        }
      }
    };

    fetchUserFolders();
  }, [user]);

  const handleLogin = (token) => {
    localStorage.setItem("token", token);
    const decoded = jwtDecode(token);
    setUser(decoded);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setFolders([]);
    setCurrentFolder(null);
    setBreadcrumbs([]);
  };
  const handleFolderCreated = (newFolder) => {
    setFolders((prevFolders) => [...prevFolders, newFolder]);
  };

  const handleImageUploaded = () => {};
  useEffect(() => {
    const buildBreadcrumbs = () => {
      if (!currentFolder) {
        setBreadcrumbs([{ id: null, name: "Home" }]);
        return;
      }

      const crumbs = [];
      let current = folders.find((f) => f._id === currentFolder);

      while (current) {
        crumbs.unshift({ id: current._id, name: current.name });
        if (current.parentFolder) {
          current = folders.find((f) => f._id === current.parentFolder);
        } else {
          current = null;
        }
      }

      crumbs.unshift({ id: null, name: "Home" });
      setBreadcrumbs(crumbs);
    };

    buildBreadcrumbs();
  }, [currentFolder, folders]);

  return (
    <Router>
      <Navbar user={user} onLogout={handleLogout} />
      <div className="container mx-auto p-4">
        <div className="mb-4">
          {breadcrumbs.map((crumb, index) => (
            <React.Fragment key={crumb.id ?? "root"}>
              <button
                className="text-blue-500 hover:underline"
                onClick={() => setCurrentFolder(crumb.id)}
                disabled={index === breadcrumbs.length - 1}
              >
                {crumb.name}
              </button>
              {index < breadcrumbs.length - 1 && <span> / </span>}
            </React.Fragment>
          ))}
        </div>
        <Routes>
          <Route
            path="/login"
            element={
              user ? <Navigate to="/" /> : <LoginForm onLogin={handleLogin} />
            }
          />
          <Route
            path="/signup"
            element={user ? <Navigate to="/" /> : <SignupForm />}
          />
          <Route
            path="/all-images"
            element={user ? <AllImages /> : <Navigate to="/login" />}
          />

          <Route
            path="/"
            element={
              user ? (
                <>
                  <h1 className="text-2xl font-bold mb-4">Your Folders</h1>
                  <Folder
                    folders={folders}
                    currentFolder={currentFolder}
                    onFolderCreated={handleFolderCreated}
                    setCurrentFolder={setCurrentFolder}
                  />
                  <ImageUpload
                    currentFolder={currentFolder}
                    onImageUploaded={handleImageUploaded}
                  />
                  <ImageList currentFolder={currentFolder} />
                </>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
