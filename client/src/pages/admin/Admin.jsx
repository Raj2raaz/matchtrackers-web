import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  LogOut,
  Loader,
  Check,
  X,
  Plus,
  Edit,
  Trash,
  Image,
  FileText,
} from "lucide-react";

import { IoIosFootball as FootballIcon } from "react-icons/io";

function Admin() {
  // Authentication states
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");

  // UI states
  const [activeView, setActiveView] = useState("dashboard"); // 'dashboard', 'add', 'edit'
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    type: "",
    message: "",
  });

  // Blog data states
  const [blogs, setBlogs] = useState([]);
  const [currentBlog, setCurrentBlog] = useState(null);

  // Form states
  const [blogType, setBlogType] = useState("football");
  const [title, setTitle] = useState("");
  const [paragraphs, setParagraphs] = useState([{ subtitle: "", content: "" }]);
  const [image, setImage] = useState("");

  // Hardcoded credentials (in a real app, this would be in the backend)
  const validUsername = "admin";
  const validPassword = "password123";

  useEffect(() => {
    // Check if user is already authenticated from session storage
    const isAuth = sessionStorage.getItem("isAuthenticated");
    if (isAuth === "true") {
      setIsAuthenticated(true);
      // Fetch blogs on initial load if authenticated
      fetchBlogs();
    }
  }, []);

  // Show notification with auto-hide
  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => {
      setNotification({ show: false, type: "", message: "" });
    }, 5000);
  };

  // Authentication handlers
  const handleLogin = (e) => {
    e.preventDefault();
    if (username === validUsername && password === validPassword) {
      sessionStorage.setItem("isAuthenticated", "true");
      setIsAuthenticated(true);
      setAuthError("");
      fetchBlogs();
    } else {
      setAuthError("Invalid username or password");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("isAuthenticated");
    setIsAuthenticated(false);
  };

  // Blog API operations with axios
  const fetchBlogs = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("/api/blogs", {
        headers: {
          "Admin-Auth": import.meta.env.VITE_ADMIN_STRING,
        },
      });

      setBlogs(response.data.blogs);
    } catch (error) {
      showNotification(
        "error",
        error.response?.data?.error || "Error connecting to server"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddBlog = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const blogData = {
      type: blogType,
      title,
      img: blogType === "cricket" ? image : null,
      paragraphs,
    };

    try {
      const response = await axios.post("/api/blogs", blogData, {
        headers: {
          "Admin-Auth": import.meta.env.VITE_ADMIN_STRING,
        },
      });

      showNotification("success", "Blog created successfully!");
      resetForm();
      fetchBlogs();
      setActiveView("dashboard");
    } catch (error) {
      showNotification(
        "error",
        error.response?.data?.error || "Failed to create blog"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateBlog = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const blogData = {
      type: blogType,
      title,
      img: blogType === "cricket" ? image : null,
      paragraphs,
    };

    try {
      const response = await axios.put(
        `/api/blogs/${currentBlog.id}`,
        blogData,
        {
          headers: {
            "Admin-Auth": import.meta.env.VITE_ADMIN_STRING,
          },
        }
      );

      showNotification("success", "Blog updated successfully!");
      resetForm();
      fetchBlogs();
      setActiveView("dashboard");
    } catch (error) {
      showNotification(
        "error",
        error.response?.data?.error || "Failed to update blog"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteBlog = async (blogId) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) {
      return;
    }

    setIsLoading(true);
    try {
      await axios.delete(`/api/blogs/${blogId}`, {
        headers: {
          "Admin-Auth": import.meta.env.VITE_ADMIN_STRING,
        },
      });

      showNotification("success", "Blog deleted successfully!");
      fetchBlogs();
    } catch (error) {
      showNotification(
        "error",
        error.response?.data?.error || "Failed to delete blog"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Form handlers
  const handleEditBlog = (blog) => {
    setCurrentBlog(blog);
    setBlogType(blog.type);
    setTitle(blog.title);
    setImage(blog.img || "");
    setParagraphs(blog.paragraphs);
    setActiveView("edit");
  };

  const resetForm = () => {
    setBlogType("football");
    setTitle("");
    setImage("");
    setParagraphs([{ subtitle: "", content: "" }]);
    setCurrentBlog(null);
  };

  const handleAddParagraph = () => {
    setParagraphs([...paragraphs, { subtitle: "", content: "" }]);
  };

  const handleParagraphChange = (index, field, value) => {
    const newParagraphs = [...paragraphs];
    newParagraphs[index][field] = value;
    setParagraphs(newParagraphs);
  };

  const handleRemoveParagraph = (index) => {
    if (paragraphs.length > 1) {
      const newParagraphs = [...paragraphs];
      newParagraphs.splice(index, 1);
      setParagraphs(newParagraphs);
    }
  };

  const handleNewBlog = () => {
    resetForm();
    setActiveView("add");
  };

  const handleCancelEdit = () => {
    resetForm();
    setActiveView("dashboard");
  };

  // Login Form
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Blog Admin</h2>
            <p className="text-gray-500 mt-2">
              Log in to manage your blog content
            </p>
          </div>

          {authError && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
              <p className="font-medium">Authentication Error</p>
              <p>{authError}</p>
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="mb-6">
              <label
                className="block text-gray-700 text-sm font-semibold mb-2"
                htmlFor="username"
              >
                Username
              </label>
              <input
                className="appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="mb-8">
              <label
                className="block text-gray-700 text-sm font-semibold mb-2"
                htmlFor="password"
              >
                Password
              </label>
              <input
                className="appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
                type="submit"
              >
                Sign In
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-800">
                Blog Admin Dashboard
              </h1>
            </div>
            <div className="flex items-center">
              <button
                onClick={handleLogout}
                className="ml-4 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none flex items-center"
              >
                <LogOut size={16} className="mr-2" /> Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Notification */}
      {notification.show && (
        <div
          className={`fixed top-20 right-4 px-4 py-3 rounded-lg shadow-lg ${
            notification.type === "success"
              ? "bg-green-100 border-l-4 border-green-500 text-green-700"
              : "bg-red-100 border-l-4 border-red-500 text-red-700"
          }`}
        >
          <div className="flex">
            <div className="py-1">
              {notification.type === "success" ? (
                <Check className="h-6 w-6 text-green-500" />
              ) : (
                <X className="h-6 w-6 text-red-500" />
              )}
            </div>
            <div className="ml-3">
              <p className="font-medium">{notification.message}</p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Dashboard View - List of Blogs */}
        {activeView === "dashboard" && (
          <div className="px-4 py-6 sm:px-0">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">All Blogs</h2>
              <button
                onClick={handleNewBlog}
                className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none flex items-center"
              >
                <Plus size={16} className="mr-2" /> Add New Blog
              </button>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader className="animate-spin h-8 w-8 text-blue-500" />
              </div>
            ) : blogs.length === 0 ? (
              <div className="bg-white shadow overflow-hidden sm:rounded-lg p-8 text-center">
                <p className="text-gray-500">
                  No blogs found. Add your first blog!
                </p>
              </div>
            ) : (
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <ul className="divide-y divide-gray-200">
                  {blogs.map((blog) => (
                    <li key={blog.id} className="px-6 py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div
                            className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${
                              blog.type === "football"
                                ? "bg-blue-100 text-blue-600"
                                : "bg-green-100 text-green-600"
                            }`}
                          >
                            {blog.type === "football" ? (
                              <FootballIcon size={20} />
                            ) : (
                              <Image size={20} />
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {blog.title}
                            </div>
                            <div className="text-sm text-gray-500">
                              {blog.type.charAt(0).toUpperCase() +
                                blog.type.slice(1)}{" "}
                              • {blog.paragraphs.length} paragraphs
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditBlog(blog)}
                            className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 focus:outline-none flex items-center"
                          >
                            <Edit size={14} className="mr-1" /> Edit
                          </button>
                          <button
                            onClick={() => handleDeleteBlog(blog.id)}
                            className="px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 focus:outline-none flex items-center"
                          >
                            <Trash size={14} className="mr-1" /> Delete
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Add/Edit Blog Form */}
        {(activeView === "add" || activeView === "edit") && (
          <div className="px-4 py-6 sm:px-0">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                {activeView === "add" ? "Add New Blog" : "Edit Blog"}
              </h2>
              <button
                onClick={handleCancelEdit}
                className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
              >
                Cancel
              </button>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
              <form
                onSubmit={
                  activeView === "add" ? handleAddBlog : handleUpdateBlog
                }
              >
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Blog Type
                    </label>
                    <select
                      className="appearance-none border mt-2 border-gray-300 rounded-lg  py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-[20rem]"
                      value={blogType}
                      onChange={(e) => setBlogType(e.target.value)}
                      required
                    >
                      <option value="football">Football</option>
                      <option value="cricket">Cricket</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Blog Title
                    </label>
                    <input
                      type="text"
                      className="appearance-none border mt-2 border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Image URL
                    </label>
                    <input
                      type="url"
                      className="appearance-none border mt-2 border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter image URL"
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Paragraphs
                      </label>
                      <button
                        type="button"
                        onClick={handleAddParagraph}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                      >
                        <Plus size={14} className="mr-1" />
                        Add Paragraph
                      </button>
                    </div>

                    {paragraphs.map((paragraph, index) => (
                      <div
                        key={index}
                        className="mb-6 p-4 border border-gray-200 rounded-md bg-gray-50"
                      >
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="font-medium text-gray-700 flex items-center">
                            <FileText size={16} className="mr-2" />
                            Paragraph {index + 1}
                          </h4>
                          {paragraphs.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveParagraph(index)}
                              className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none"
                            >
                              <X size={12} className="mr-1" />
                              Remove
                            </button>
                          )}
                        </div>

                        <div className="mb-3">
                          <label className="block text-sm font-medium text-gray-700">
                            Subtitle
                          </label>
                          <input
                            type="text"
                            className="appearance-none border mt-2 border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter subtitle"
                            value={paragraph.subtitle}
                            onChange={(e) =>
                              handleParagraphChange(
                                index,
                                "subtitle",
                                e.target.value
                              )
                            }
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Content
                          </label>
                          <textarea
                            className="appearance-none border mt-2 border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            rows="4"
                            placeholder="Enter paragraph content"
                            value={paragraph.content}
                            onChange={(e) =>
                              handleParagraphChange(
                                index,
                                "content",
                                e.target.value
                              )
                            }
                            required
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                        isLoading ? "opacity-75 cursor-not-allowed" : ""
                      }`}
                    >
                      {isLoading ? (
                        <div className="flex items-center">
                          <Loader size={16} className="animate-spin mr-2" />
                          Processing...
                        </div>
                      ) : activeView === "add" ? (
                        "Create Blog"
                      ) : (
                        "Update Blog"
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Admin;
