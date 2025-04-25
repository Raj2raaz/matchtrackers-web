import React from "react";
import blogs from "../blogs.json";

export default function Blogs() {
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 md:px-16">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-12 text-gray-800">
          Latest Blogs
        </h1>
        <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
          {blogs?.blogs?.cricket.map((blog, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col"
            >
              {blog.img && (
                <img
                  className="w-full h-56 sm:h-64 md:h-72 object-cover transition-all duration-300"
                  src={blog.img}
                  alt={blog.title}
                />
              )}
              <div className="p-6 flex flex-col flex-1">
                <h2 className="text-2xl font-semibold mb-4 text-gray-700">
                  {blog.title}
                </h2>
                <div className="space-y-4 mb-6 flex-1">
                  {blog.paragraphs.map((para, idx) => (
                    <div key={idx}>
                      <h3 className="text-lg font-medium text-indigo-600">
                        {para.subtitle}
                      </h3>
                      <p className="text-gray-600 mt-2 text-sm">
                        {para.content}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
