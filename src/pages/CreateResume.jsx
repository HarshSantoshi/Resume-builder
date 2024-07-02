import React from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { TemplatesData } from "../utils/helpers";
import useUser from "../hooks/useUser";

const CreateResume = () => {
  const {data:user} = useUser();
  const navigate = useNavigate();
  if(!user){
    navigate('/auth' ,{replace:true})
    return ;
  }
  return (
    <div className="w-full flex items-center justify-center flex-col py-4 ">
      <Routes>
        {TemplatesData.map((template) => (
          <Route
            key={template?.id }
            path={`/${template.name}`}
            Component={template.component}
          />
        ))}
      </Routes>
    </div>
  );
};

export default CreateResume;
