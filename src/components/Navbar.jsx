import React from "react";
import navLogo from "../assets/navLogo.svg";
import { Link, useNavigate } from "react-router-dom";
import { FaAngleDown } from "react-icons/fa";

const links = ["stats", "teams", "news", "matches"];

export default function Navbar() {
  const navigate = useNavigate();
  return (
    <div className="sticky z-60 top-0 w-full left-0">
      <div className="bg-secondary px-24 py-2 text-white items-center bg- flex w-full justify-between gap-10">
        <img
          onClick={() => navigate("/")}
          className="h-16 cursor-pointer"
          src={navLogo}
          alt=""
        />
        <div className="flex gap-10 font-bold items-center">
          {links.map((e, i) => (
            <Link
              to={"/stats"}
              className="capitalize  flex gap-2 items-center"
              key={i}
            >
              {e}
              <FaAngleDown />
            </Link>
          ))}
          <button className="px-3 py-1 cursor-pointer rounded bg-primary ">
            Login or Signup
          </button>
        </div>
      </div>
    </div>
  );
}
