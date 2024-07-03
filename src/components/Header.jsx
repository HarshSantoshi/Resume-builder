import React, { useState } from "react";
import useUser from "../hooks/useUser";
import { Link } from "react-router-dom";
import { Logo } from "../assets";
import { AnimatePresence, motion } from "framer-motion";
import { ClipLoader } from "react-spinners";
import { HiLogout } from "react-icons/hi";
import { auth } from "../config/firebase.config";
import { useQueryClient } from "react-query";
import { adminIds } from "../utils/helpers";
import useFilter from "../hooks/useFilter";

const Header = () => {
  const { data, isLoading, isError } = useUser();
  const [show, setShow] = useState(false);
  const handleShow = () => {
    setShow(!show);
  };
  const queryClient = useQueryClient();
  const { data: filterData } = useFilter();
  const logoutUser = async () => {
    await auth.signOut().then(() => {
      queryClient.setQueryData("user", null);
    });
  };
  const handleSearch = (e) => {
    const { value } = e.target;
    queryClient.setQueryData("globalFilter", {
      ...queryClient.getQueryData("globalFilter"),
      searchTerm: value,
    });
  };
  const clearFilter = ()=>{
    queryClient.setQueryData("globalFilter", {
      ...queryClient.getQueryData("globalFilter"),
      searchTerm: "",
    });
  }
  return (
    <header className="w-full m-auto flex bg-white z-50 gap-10 sticky top-0 items-center justify-between px-4 py-3 lg:px-8">
      {/* LOGO */}
      <Link to="/">
        <img src={Logo} className="w-10 h-10  object-contain" alt="logo" />
      </Link>

      {/* Search field */}
      <div className="flex-1 border rounded-md flex items-center justify-between ">
        <input
          onChange={handleSearch}
          className="flex-1 h-10 bg-transparent text-base border-none px-4 py-2 outline-none font-semibold"
          type="text"
          value={filterData?.searchTerm ? filterData?.searchTerm : ""}
          placeholder="Search..."
        />
        <AnimatePresence>
          {filterData?.searchTerm?.length>0 && 
          <motion.div
          onClick={clearFilter}
            initial={{ opacity: 0, scale: 0.6, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.6, x: 20 }}
            className="w-10 h-10 flex items-center justify-center bg-gray-300 rounded-r-md cursor-pointer active:scale-95 duration-150"
          >
            <p className="text-2xl text-black">x</p>
          </motion.div>
          }
        </AnimatePresence>
      </div>

      {/* Profile Image */}
      <AnimatePresence>
        {isLoading ? (
          <ClipLoader color="#a6a6a6" size={40} />
        ) : (
          <>
            {data ? (
              <motion.div onClick={handleShow} className="relative">
                {data?.photoURL ? (
                  <div className="w-10 h-10 rounded relative flex items-center justify-center">
                    <img
                      src={data?.photoURL}
                      className="w-10 h-10 rounded-full object-cover cursor-pointer"
                      alt="profile"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-full relative flex items-center justify-center font-semibold text-lg bg-slate-500 text-white cursor-pointer">
                    <p>{data?.displayName[0]}</p>
                  </div>
                )}
                {show && (
                  <AnimatePresence>
                    <motion.div
                      className="absolute px-5 py-3 rounded-md right-1 top-10 flex flex-col items-center justify-start w-60 bg-white gap-3 pt-12"
                      onMouseLeave={() => setShow(!show)}
                    >
                      {data?.photoURL ? (
                        <div className="w-12 h-12 rounded relative flex items-center justify-center">
                          <img
                            src={data?.photoURL}
                            className="w-12 h-12 rounded-full object-cover cursor-pointer"
                            alt="profile"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-full relative flex items-center justify-center font-semibold text-lg bg-slate-500 text-white cursor-pointer">
                          <p>{data?.displayName[0]}</p>
                        </div>
                      )}
                      {data?.displayName && (
                        <p className="text-lg font-semibold">
                          {data?.displayName}
                        </p>
                      )}

                      {/* LISTS */}
                      <div className="w-full flex-col items-center flex gap-2 pt-6">
                        <Link
                          className="text-slate-500 hover:text-black whitespace-nowrap"
                          to={`/profile/${data?.uid}`}
                        >
                          My Profile
                        </Link>
                        {adminIds.includes(data?.uid) && (
                          <Link
                            className="text-slate-500 hover:text-black  whitespace-nowrap"
                            to="/template/create"
                          >
                            Add new Template
                          </Link>
                        )}
                      </div>
                      <div
                        className="w-full px-2 py-2 border-t border-gray-300 flex items-center justify-center gap-2 group cursor-pointer"
                        onClick={logoutUser}
                      >
                        <p className="group-hover:text-black text-slate-500">
                          Logout
                        </p>
                        <HiLogout className="group-hover:text-black text-slate-500" />
                      </div>
                    </motion.div>
                  </AnimatePresence>
                )}
              </motion.div>
            ) : (
              <Link to={"/auth"}>
                <motion.button className="bg-blue-500 px-4 py-1 text-white rounded-md text-lg hover:bg-blue-800 shadow-md active:scale-95">
                  Login
                </motion.button>
              </Link>
            )}
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
