import React from "react";
import { useQuery } from "react-query";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  getTemplateDetails,
  saveToCollections,
  saveToFavourites,
} from "../api";
import { MainSpinner } from "../components";
import { FaHouse } from "react-icons/fa6";
import {
  BiFolderPlus,
  BiHeart,
  BiSolidFolderMinus,
  BiSolidHeart,
} from "react-icons/bi";
import useUser from "../hooks/useUser";
import useTemplates from "../hooks/useTemplates";
import TemplateDesgin from "../components/TemplateDesgin";
import { AnimatePresence } from "framer-motion";

const TemplateDesignDetail = () => {
  const { templateID } = useParams();
  const { data, isLoading, isError, refetch } = useQuery(
    ["template", templateID],
    () => getTemplateDetails(templateID)
  );
  const { data: user, refetch: userRefetch } = useUser();
  const { data: templates, refetch: templateRefetch } = useTemplates();
  const navigate = useNavigate();
  if (isLoading) {
    return <MainSpinner />;
  }
  if (isError) {
    <div className="w-full h-[60px] flex flex-col items-center justify-center">
      <p className="text-2xl">Error while fetching the data...</p>
    </div>;
  }
  const addToCollection = async (e) => {
    e.stopPropagation();
    await saveToCollections(user, data);
    userRefetch();
  };
  const addToFav = async (e) => {
    e.stopPropagation();
    await saveToFavourites(user, data);
    templateRefetch();
    refetch();
  };

  if(!user){
    navigate('/auth' , {replace:true})
  }

  return (
    <div className="w-full flex flex-col items-center justify-center px-4 py-10">
      <div className="w-full flex items-center pb-8 gap-2">
        <Link
          to="/"
          className="flex items-center justify-center gap-2 text-txtDark"
        >
          <FaHouse />
          Home
        </Link>
        <p>/</p>
        {data?.name}
        <p>/</p>
        {data?.title}
      </div>

      {/* Template Design */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-12">
        <div className="col-span-1 lg:col-span-8 flex flex-col items-start justify-start gap-4 ">
          <img
            className="w-auto h-auto rounded-md"
            src={data?.imageURL}
            alt=""
          />

          <div className="w-full flex flex-col items-start justify-center gap-2">
            {/* title section */}
            <div className="w-full flex items-center justify-between">
              <p className="text-lg px-4 font-semibold">{data?.title}</p>

              {data?.favourites?.length>0 && (
                <div className="flex items-center justify-center gap-1 whitespace-nowrap">
                  <BiSolidHeart className="size-5 text-red-700" />
                  <p className="text-lg">{data?.favourites?.length} Likes</p>
                </div>
              )}
            </div>
            {user && (
              <div className="flex-wrap w-full flex items-center justify-center gap-3 ">
                {user?.collections?.includes(data?._id) ? (
                  <>
                    <div
                      onClick={addToCollection}
                      className="flex items-center justify-center px-4 py-2 rounded-md border border-slate-300 gap-2 hover:bg-gray-200 cursor-pointer"
                    >
                      <BiSolidFolderMinus className="size-5" />
                      <p className="text-sm whitespace-nowrap">
                        Remove from Collections
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div
                      onClick={addToCollection}
                      className="flex items-center justify-center px-4 py-2 rounded-md border border-slate-300 gap-2 hover:bg-gray-200 cursor-pointer"
                    >
                      <BiFolderPlus className="size-5" />
                      <p className="text-sm whitespace-nowrap">
                        Add to Collections
                      </p>
                    </div>
                  </>
                )}

                {data && data?.favourites?.includes(user?.uid) ? (
                  <>
                    <div
                      onClick={addToFav}
                      className="flex items-center justify-center px-4 py-2 rounded-md border border-slate-300 gap-2 hover:bg-gray-200 cursor-pointer"
                    >
                      <BiSolidHeart className="size-5 text-red-600" />
                      <p className="text-sm whitespace-nowrap">
                        Remove from Favourites
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div
                      onClick={addToFav}
                      className="flex items-center justify-center px-4 py-2 rounded-md border border-slate-300 gap-2 hover:bg-gray-200 cursor-pointer"
                    >
                      <BiHeart className="size-5 text-red-500" />
                      <p className="text-sm whitespace-nowrap">
                        Add to Favourites
                      </p>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
          {templates?.length >0 && <div className="w-full py-8 flex flex-col items-start justify-start gap-4">
            <p className="text-lg font-bold">Similar Templates</p>
            <div className="w-full grid  grid-cols-1 
            md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-3">
              <>
          <AnimatePresence>
            {
              templates?.filter((temp)=> temp._id !== data?._id).map((template, index) => (
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
            </div>
          </div>
          }
        </div>
        <div className="w-full flex flex-col items-center justify-start px-3 gap-6 col-span-1 lg:col-span-4">
          <div className="w-full h-72 bg-blue-600 overflow-hidden rounded-md relative">
          <div className="absolute inset-0 flex items-center justify-center bg-[rgba(0,0,0,.4)]" style={{background:"url(https://i.pinimg.com/originals/4b/e6/af/4be6af81664803bd8cb09f602e72865a.jpg)", backgroundPosition:"center", backgroundSize:"cover"}}>
            <Link to={`/profile/${user?.uid}`} className="px-4 py-2 text-slate-100 border rounded-md font-semibold text-lg active:scale-95" >
            Your Collections
            </Link>
          </div>
          </div>
          {user && (
            <>
            <Link to={`/resume/${data?.name}?templateID=${templateID}`} className="w-full px-4 py-3 rounded-md flex items-center justify-center cursor-pointer bg-green-600">
            <p className="text-lg text-white font-semibold">Edit this template</p>
            </Link>
            </>
          )}
          <div className="w-full flex items-center justify-start flex-wrap gap-3">
            {data?.tags?.map((tag, index)=>{
              return (
                <>
                <p className=" text-base border-2 border-slate-300 px-3 py-1 rounded-md whitespace-nowrap" key={index}>
                  {tag}
                </p>
                </>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateDesignDetail;
