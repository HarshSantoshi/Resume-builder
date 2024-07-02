import React, { useEffect, useState } from "react";
import useUser from "../hooks/useUser";
import { AnimatePresence } from "framer-motion";
import TemplateDesgin from "../components/TemplateDesgin";
import useTemplates from "../hooks/useTemplates";
import { useNavigate } from "react-router-dom";
import { NoData } from "../assets";
import { useQuery } from "react-query";
import { getSavedResumes } from "../api";
import { MainSpinner } from "../components";
const UserProfile = () => {
  const { data: user } = useUser();
  const { data: templates, isLoading: templateIsLoading } = useTemplates();
  const [activeTab, setActivetab] = useState("collections");
  const navigate = useNavigate();
  const { data: savedResumes } = useQuery(
    ["savedResumes", user?.uid],
    () => getSavedResumes(user?.uid),
    {
      enabled: !!user?.uid, 
    }
  );
  
  if (templateIsLoading) {
    return <MainSpinner />;
  }
  return (
    <div className="w-full flex flex-col items-center justify-center">
      <div className="w-full h-64 relative">
        <img
          className="w-full h-full object-cover"
          src="https://wallpaperaccess.com/full/5651986.jpg"
          alt=""
        />
        {user?.photoURL ? (
          <>
            <img
              className="absolute right-1/2 -bottom-10 rounded-full z-10 size-20 shadow-md"
              src={user?.photoURL}
              alt=""
              loading="lazy"
              referrerPolicy="no-referrer"
            />
          </>
        ) : (
          <>
            <img
              className="absolute right-1/2 -bottom-10 rounded-full z-10 size-20 shadow-md"
              src="https://th.bing.com/th/id/OIP.AJOuTLInoO-OPPgoTCD-PwHaHa?rs=1&pid=ImgDetMain"
              alt=""
              loading="lazy"
              referrerPolicy="no-referrer"
            />
          </>
        )}
        <p className="text-lg absolute pr-20  -bottom-16 font-bold w-full text-center">
          {user?.displayName}
        </p>
      </div>
      <div className="flex items-center justify-center mt-16">
        <div
          className={`px-4 py-2 rounded-md flex items-center justify-center gap-2 group cursor-pointer`}
          onClick={() => setActivetab("collections")}
        >
          <p
            className={`font-semibold 
            rounded-full group-hover:bg-blue-500 group-hover:text-white whitespace-nowrap px-4 py-2 border ${
              activeTab === "collections"
                ? "bg-blue-500 text-white shadow-md"
                : ""
            }`}
          >
            Collections
          </p>
        </div>
        <div
          className={`px-4 py-2 rounded-md flex items-center justify-center gap-2 group cursor-pointer`}
          onClick={() => setActivetab("resume")}
        >
          <p
            className={`font-semibold 
            rounded-full group-hover:bg-blue-500 group-hover:text-white whitespace-nowrap px-4 py-2 border ${
              activeTab === "resume" ? "bg-blue-500 text-white shadow-md" : ""
            }`}
          >
            My Resumes
          </p>
        </div>
      </div>
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-2 px-4 py-4">
        <AnimatePresence>
          {activeTab === "collections" ? (
            <>
              {user?.collections.length > 0 && user?.collections ? (
                <RenderTemplate
                  template={templates?.filter((temp) =>
                    user?.collections?.includes(temp?._id)
                  )}
                />
              ) : (
                <div className="col-span-12 w-full flex flex-col items-center justify-center gap-3">
                  <img src={NoData} alt="not found" />
                  <p>No template to show</p>
                </div>
              )}
            </>
          ) : (
            <>
              {savedResumes?.length > 0 && savedResumes? (
                <RenderTemplate
                  template={savedResumes}
                />
              ) : (
                <div className="col-span-12 w-full flex flex-col items-center justify-center gap-3">
                  <img src={NoData} alt="not found" />
                  <p>No Resume to show</p>
                </div>
              )}
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default UserProfile;
const RenderTemplate = ({ template }) => {
  return (
    <>
      {template && template?.length > 0 && (
        <>
          <AnimatePresence>
            {template.map((template, index) => (
              <>
                <TemplateDesgin
                  key={template._id}
                  data={template}
                  index={index}
                />
              </>
            ))}
          </AnimatePresence>
        </>
      )}
    </>
  );
};
