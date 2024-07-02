import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import React, { useEffect, useState } from "react";
import { FaTrash, FaUpload } from "react-icons/fa";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import { db, storage } from "../config/firebase.config";
import { adminIds, initialTags } from "../utils/helpers";
import { deleteDoc, doc, serverTimestamp, setDoc } from "firebase/firestore";
import useTemplates from "../hooks/useTemplates";
import useUser from "../hooks/useUser"
import { useNavigate } from "react-router-dom";

const CreateTemplate = () => {
  const [formData, setFormData] = useState({
    title: "",
    imageURL: null,
  });
  const [imageAsset, setImageAsset] = useState({
    isImageLoading: false,
    uri: null,
    progress: 0,
  });
  const [selectedTag, setSelectedTag] = useState([]);
  const {
    data: templates,
    isLoading: templateIsLoading,
    isError: templateIsError,
    refetch: templateIsRefetch,
  } = useTemplates();
  const {data : user , isLoading   }  = useUser();
  const naviagate = useNavigate();

  const handleInput = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const isValid = (file) => {
    const validExtensions = ["image/png", "image/jpeg", "image/jpg"];
    return validExtensions.includes(file.type);
  };

  const deleteImage = () => {
    if (!imageAsset.uri) return;
    const deleteRef = ref(storage, imageAsset.uri);
    setImageAsset((prev) => ({ ...prev, isImageLoading: true }));

    deleteObject(deleteRef)
      .then(() => {
        toast.success("Image Deleted");
        setImageAsset({
          isImageLoading: false,
          uri: null,
          progress: 0,
        });
      })
      .catch((error) => {
        toast.error(`Error: ${error.message}`);
        setImageAsset((prev) => ({ ...prev, isImageLoading: false }));
      });
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !isValid(file)) {
      toast.info("Invalid file format");
      return;
    }

    setImageAsset((prev) => ({ ...prev, isImageLoading: true }));
    const storageRef = ref(storage, `Templates/${Date.now()}-${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageAsset((prev) => ({ ...prev, progress }));
      },
      (error) => {
        if (error.message.includes("storage/unauthorized")) {
          toast.error(`Error: Authorization Revoked`);
        } else {
          toast.error(`Error: ${error.message}`);
        }
        setImageAsset((prev) => ({ ...prev, isImageLoading: false }));
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageAsset({
            isImageLoading: false,
            uri: downloadURL,
            progress: 100,
          });
          toast.success("Image uploaded");
        });
      }
    );
  };
  const handleSelectedTags = (tag) => {
    if (selectedTag.includes(tag)) {
      setSelectedTag(selectedTag.filter((item) => item !== tag));
    } else {
      setSelectedTag([...selectedTag, tag]);
    }
  };
  const handleSavePost = async () => {
    const timestamp = serverTimestamp();
    const id = `${Date.now()}`;
    const _doc = {
      _id: id,
      title: formData.title,
      imageURL: imageAsset.uri,
      tags: selectedTag,
      name:
        templates && templates?.length > 0
          ? `Template ${templates?.length + 1}`
          : "Template 1",
      timestamp: timestamp,
    };
    await setDoc(doc(db, "templates", id), _doc)
      .then(() => {
        setFormData((prev) => ({ ...prev, title: "", imageURL: "" }));
        setImageAsset((prev) => ({ ...prev, uri: null }));
        setSelectedTag([]);
        templateIsRefetch();
        toast.success("Template saved successfully");
      })
      .catch((error) => {
        toast.error("Something went wrong while saving");
      });
  };

  const removeTemplate = async(template)=>{
    const deleteRef = ref(storage , template?.imageURL)
    await deleteObject(deleteRef).then(async()=>{
      await deleteDoc(doc(db , "templates" , template?._id)).then(()=>{
        toast.success("Template deleted successfully")
        templateIsRefetch()
      }).catch(err=>{
        toast.error("Something went wrong while deleting",err.message)
      })
    })
  }

  useEffect(()=>{
    if(!isLoading && !adminIds.includes(user?.uid)){
      naviagate('/' , {replace:true})
    }
  },[user , isLoading])

  return (
    <div className="w-full px-4 lg:px-10 2xl:px-32 py-4 grid grid-cols-1 lg:grid-cols-12">
      {/* left */}
      <div className="col-span-12 lg:col-span-4 2xl:col-span-3 w-full flex-1 flex items-center justify-start flex-col gap-4 px-2">
        <div className="w-full">
          <p className="text-lg text-center">Build a new template</p>
        </div>
        <div className="w-full flex items-center justify-center text-base">
          <p className="text-gray-600 font-semibold">Template ID : </p>
          <p className="font-bold">
            {templates && templates.length > 0
              ? ` ${templates?.length + 1}`
              : " 1"}
          </p>
        </div>

        <input
          className="w-full px-4 py-3 rounded-md bg-transparent border border-gray-300 text-lg ttext-gray-700 focus:text-black focus:shadow-md outline-none"
          type="text"
          name="title"
          placeholder="Write Title for Template"
          value={formData.title}
          onChange={handleInput}
        />
        {/* Image upload */}
        <div className="w-full bg-gray-100 backdrop-blur-md h-[250px] lg:h-[450px] 2xl:h-[520px] rounded-md border-2 border-dotted border-gray-800 cursor-pointer flex items-center justify-center">
          {imageAsset.isImageLoading ? (
            <>
              <div className="flex items-center flex-col justify-center gap-4">
                <ClipLoader color="#a6a6a6" size={40} />
                <p>{imageAsset.progress.toFixed(2)}%</p>
              </div>
            </>
          ) : (
            <>
              {!imageAsset.uri ? (
                <>
                  <label className="w-full cursor-pointer h-full">
                    <div className="flex flex-col items-center justify-center h-full w-full hover:text-slate-800">
                      <div className="flex flex-col items-center justify-center cursor-pointer">
                        <p className="text-lg hover:text-slate-800">
                          Upload Template Image
                        </p>
                        <FaUpload className="text-2xl text-slate-500 hover:text-slate-800" />
                      </div>
                    </div>
                    <input
                      type="file"
                      className="w-0 h-0"
                      accept=".jpeg,.png,.jpg"
                      onChange={handleFileUpload}
                    />
                  </label>
                </>
              ) : (
                <>
                  <div className="relative w-full h-full overflow-hidden rounded-md justify-center flex items-start">
                    <img
                      src={imageAsset.uri}
                      className="w-full h-96 m-auto shadow-lg rounded-md"
                      loading="lazy"
                      alt=""
                    />
                    <div className="absolute bottom-0 w-8 h-8 cursor-pointer rounded-full flex items-center justify-center bg-red-500">
                      <FaTrash className="text-white" onClick={deleteImage} />
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </div>
        <div className="w-full flex items-center flex-wrap gap-2">
          {initialTags.map((tag, i) => {
            return (
              <div
                key={i}
                className={`border rounded-md px-2 border-slate-500 cursor-pointer ${
                  selectedTag.includes(tag) ? "bg-blue-500 text-white" : ""
                }`}
                onClick={() => handleSelectedTags(tag)}
              >
                <p>{tag}</p>
              </div>
            );
          })}
        </div>
        <div className="w-full flex items-center justify-center">
          <button
            className="w-1/2 py-2 px-4 rounded-md
            bg-blue-500 text-white hover:bg-blue-600
            transition-all duration-300 ease-in-out
            "
            onClick={handleSavePost}
          >
            Save Template
          </button>
        </div>
      </div>
      {/* right */}
      <div className="col-span-12 lg:col-span-8 2xl:col-span-9 px-2 w-full flex-1 py-4">
        {templateIsLoading ? (
          <>
            <div className="w-full h-96 flex items-center justify-center">
              <ClipLoader color="#a6a6a6" size={40} />
            </div>
          </>
        ) : (
          <>
            {templates && templates?.length > 0 ? (
              <>
                <div className="w-full h-full grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4">
                {templates?.map((template) => (
                  <div
                    key={template._id}
                    className="w-full h-[500px] rounded-md overflow-hidden relative"
                  >
                    <img
                      src={template?.imageURL}
                      alt="image"
                      className="w-full h-full"
                    />
                    <div className="absolute bottom-0 right-1/2 w-8 h-8 cursor-pointer rounded-full flex items-center justify-center bg-red-500">
                      <FaTrash className="text-white" onClick={()=>removeTemplate(template)} />
                    </div>
                    {template?.title}
                  </div>
                ))}
                </div>
              </>
            ) : (
              <>
                <div className="w-full h-96 flex items-center justify-center">
                  <p className="text-xl tracking-wider">NO TEMPLATE</p>
                </div>
              </>
            )}
          </>
        )}
      </div>
      {/* Create Template */}
    </div>
  );
};

export default CreateTemplate;
