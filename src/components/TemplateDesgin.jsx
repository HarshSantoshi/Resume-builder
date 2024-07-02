import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BiFolderPlus, BiHeart, BiSolidFolderMinus, BiSolidHeart } from "react-icons/bi";
import useUser from "../hooks/useUser";
import { saveToCollections, saveToFavourites } from "../api";
import useTemplates from "../hooks/useTemplates";
import { useNavigate } from "react-router-dom";
const TemplateDesgin = ({ data, index }) => {
    const {data:user ,refetch : userRefetch } = useUser();
    const {refetch:templateRefetch} = useTemplates();
    const [hoverbox , setHoverbox] = useState(false);
    const navigate = useNavigate();
  const addToCollection = async (e) => {
    e.stopPropagation();
    await saveToCollections(user , data)
    userRefetch();

  };
  const addToFav = async (e) => {
    e.stopPropagation();
    await saveToFavourites(user , data)
    templateRefetch();
  };
  const handleTemplate = ()=>{
    navigate(`/resumedetail/${data?._id}` , {replace:true})
  }
  return (
    <motion.div
      key={data._id}
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.6 }}
      transition={{ delay: index * 0.3, ease: "easeInOut" }}
      onMouseEnter={()=>setHoverbox(true)}
      onMouseLeave={()=>setHoverbox(false)}
      onClick={handleTemplate}
    >
      <div className="w-full h-[400px] 2xl:h-[640px] rounded-md bg-slate-300 overflow-hidden relative">
        <img
          src={data?.imageURL}
          alt=""
          className="w-full
            h-full cursor-pointer"
        />
        <AnimatePresence>
          {hoverbox && <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-[rgba(0,0,0,0.4)] flex flex-col items-center justify-start px-4 py-2 z-30 cursor-pointer"
           
          >
            <div className="flex flex-col items-end justify-start w-full gap-7">
              <InnerBox
                label={user?.collections?.includes(data?._id) ?"Remove from Collection" : "Add to Collection"}
                Icon={user?.collections?.includes(data?._id)? BiSolidFolderMinus : BiFolderPlus }
                onHandle={addToCollection}
                type = "collection"
              />
              <InnerBox
                label={data?.favourites?.includes(user?.uid) ?"Remove from Favourites" : "Add to Favourites"}
                Icon={data?.favourites?.includes(user?.uid)? BiSolidHeart : BiHeart }
                onHandle={addToFav}
                type = "heart"
              />
            </div>
          </motion.div>}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
const InnerBox = ({ label, Icon, onHandle ,type }) => {
    const [hover,setHover] = useState(false);
  return (
    <div
      onClick={onHandle}
      className="w-7 h-7 rounded-md bg-gray-200 flex items-center justify-center hover:shadow-md relative"
      onMouseEnter={()=>setHover(true)}
      onMouseLeave={()=>setHover(false)}
    >
      <Icon className={`w-6 h-6 ${type === "heart" ? "text-red-600 h-6 w-6": " text-slate-700 "}`} />
      <AnimatePresence>
        {hover && <motion.div
        initial={{ opacity: 0, scale: 0.6 ,x:50}}
        animate={{ opacity: 1, scale: 1 ,x:0}}
        exit={{ opacity: 0, scale: 0.6 ,x:50}}
          className="px-2 py-1 rounded-md bg-slate-200 absolute right-10 whitespace-nowrap
        after:w-2 after:h-2 after:bg-slate-200  after:absolute
        after:top-[10px] after:-right-1 after:rotate-45 
        "
        >
          <p className="text-sm text-slate-900">{label}</p>
        </motion.div>}
      </AnimatePresence>
    </div>
  );
};

export default TemplateDesgin;
