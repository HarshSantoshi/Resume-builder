import React from "react";
import { Filter, MainSpinner } from "../components";
import useTemplates from "../hooks/useTemplates";
import { AnimatePresence } from "framer-motion";
import TemplateDesgin from "../components/TemplateDesgin";
import useUser from "../hooks/useUser";
import { useNavigate } from "react-router-dom";

const HomeContainer = () => {
  const {
    data: templates,
    isError: templateError,
    isLoading: templateIsLoading,
  } = useTemplates();
  const {data:user} = useUser();
  const navigate = useNavigate();
  if(!user){
    navigate('/auth' ,{replace:true})
    return ;
  }
  if (templateIsLoading) {
    return <MainSpinner />;
  }
  return (
    <>
    <div className="w-full m-auto px-4 lg:px-12 py-6 flex flex-col items-center justify-start">
      {/* Tags */}
      {/* <Filter /> */}
      {templateError ? (
        <>
          <p className="text-lg text-black">Something went wrong</p>
        </>
      ) : (
        <>
          <div className=" grid grid-cols-1  md:grid-cols-3 lg:grid-cols-3 2xl:grid-cols-4 gap-5">
            <RenderTemplate template={templates} />
          </div>
        </>
      )}
      
    </div>
    </>
    
  );
};
const RenderTemplate = ({template}) => {
  return (
    <>
      {template && template?.length > 0 ? (
        <>
          <AnimatePresence>
            {template &&
              template.map((template, index) => (
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
      ) : (
        <>
          <p>No Template to show</p>
        </>
      )}
    </>
  );
};

export default HomeContainer;
