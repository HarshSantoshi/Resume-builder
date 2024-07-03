import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";
import { MdLayersClear } from "react-icons/md";
import { FiltersData, initialTags } from "../utils/helpers";
import useFilter from "../hooks/useFilter";
import { useQueryClient } from "react-query";

const Filter = () => {
  const [isHover, setIsHover] = useState(false);
  const {data:filterData , isLoading , isError} = useFilter();
  const queryClient = useQueryClient();
  const handleFilter= (itemVal)=>{
    // const prev =  queryClient.getQueryData("globalFilter");
    // const latest = {...prev , searchTerm : itemVal}
    // queryClient.setQueryData("globalFilter",latest)
    queryClient.setQueryData("globalFilter",{...queryClient.getQueryData("globalFilter") ,searchTerm:itemVal})

  }
  const clearFilter = ()=>{
    queryClient.setQueryData("globalFilter", {
      ...queryClient.getQueryData("globalFilter"),
      searchTerm: "",
    });
  }
  return (
    <div className="w-11/12 m-auto flex items-center justify-start py-1">
      <div
        className="border border-gray-400 rounded-md px-2 py-1 mr-2 cursor-pointer group hover:shadow-md bg-gray-300 relative 
      "
        onClick={clearFilter}
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
      >
        <MdLayersClear className="text-lg" />
        <AnimatePresence>
          {isHover && (
            <motion.div
              initial={{ opacity: 0, scale: 0.6, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.6, y: 20 }}
              className="absolute -top-5 -left-2 bg-white shadow-md rounded-md px-1"
            >
              <p className="whitespace-nowrap text-xs">Clear</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="w-full flex items-center justify-start overflow-x-scroll gap-5 scrollbar-none ">
        {FiltersData &&
          FiltersData.map((item) => (
            <div
            onClick={()=>handleFilter(item.value)}
              key={item.id}
              className={`border border-gray-300 rounded-md px-5 py-1 cursor-pointer group hover:shadow-md whitespace-nowrap text-slate-600 ${filterData?.searchTerm === item.value && "text-slate-100 bg-blue-600 shadow-md"}`}
            >
              <p className="text-sm">
              {item.label}
                </p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Filter;
