import React, { useEffect, useRef, useState } from "react";
import MainSpinner from "../MainSpinner";
import { useQuery } from "react-query";
import useUser from "../../hooks/useUser";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { db } from "../../config/firebase.config";
import { getTemplateDetailEditByUser } from "../../api";
import jsPDF from "jspdf";
import * as htmlToImage from "html-to-image";

import { TemplateTwo } from "../../assets";
import {
  FaHouse,
  FaTrash,
  FaPenToSquare,
  FaPencil,
  FaPlus,
} from "react-icons/fa6";
import { BiSolidBookmarks } from "react-icons/bi";
import {
  BsFiletypePdf,
  BsFiletypePng,
  BsFiletypeJpg,
  BsFiletypeSvg,
} from "react-icons/bs";

import { AnimatePresence, motion } from "framer-motion";
import { FadeInOutWIthOpacity, opacityINOut } from "../../animations";
import { updatePassword, updateProfile } from "firebase/auth";

const Template2 = () => {
  const { pathname } = useLocation();
  const location = useLocation();
  const navigate = useNavigate();
  const templateName = pathname?.split("/")?.slice(-1);
  const searchParams = new URLSearchParams(location.search);
  const loadedTemplateId = searchParams.get("templateID");
  // console.log(pathname, templateName, loadedTemplateId);
  const textColor = "#089da3";

  const [isEdit, setIsEdit] = useState(false);
  const { data: user } = useUser();

  const resumeRef = useRef(null);

  const [imageAsset, setImageAsset] = useState({
    isImageLoading: false,
    imageURL: null,
  });

  const {
    data: resumeData,
    isLoading: resume_isLoading,
    isError: resume_isError,
    refetch: refetch_resumeData,
  } = useQuery(["templateEditedByUser", `${templateName}-${user?.uid}`], () =>
    getTemplateDetailEditByUser(user?.uid, `${templateName}-${user?.uid}`)
  );

  const [formData, setFormData] = useState({
    fullname: "Your Name",
    professionalTitle: "Your Role",
    personalDescription: `Lorem ipsum dolor sit, amet consectetur adipisicing elit. Alia minus est culpa id corrupti nobis ullam harum, porro veniam facilis, obcaecati nulla magnam beatae quae at eos! Qui, similique laboriosam?`,
    refererName: "Sara Taylore",
    refererRole: "Director | Company Name",
    mobile: "+91 0000-0000",
    email: "urname@gmail.com",
    website: "urwebsite.com",
    address: "your street address, ss, street, city/zip code - 1234",
  });

  const [experiences, setExperiences] = useState([
    {
      year: "2012 - 2014",
      title: "Job Position Here",
      companyAndLocation: "Company Name / Location here",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Corporis voluptatibus minima tenetur nostrum quo aliquam dolorum incidunt.",
    },
    {
      year: "2012 - 2014",
      title: "Job Position Here",
      companyAndLocation: "Company Name / Location here",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Corporis voluptatibus minima tenetur nostrum quo aliquam dolorum incidunt.",
    },
    {
      year: "2012 - 2014",
      title: "Job Position Here",
      companyAndLocation: "Company Name / Location here",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Corporis voluptatibus minima tenetur nostrum quo aliquam dolorum incidunt.",
    },
  ]);

  const [skills, setSkills] = useState([
    {
      title: "Problem Solving",
    },

    {
      title: "DSA",
    },
    {
      title: "C++/C",
    },
    {
      title: "JAVA",
    },
    {
      title: "Web Development",
    },
  ]);
  const [interest, setInterest] = useState([
    { title: "Photography" },
    { title: "Architecture" },
    { title: "Design" },
    { title: "Art in Science" },
    { title: "Music" },
  ]);
  const [education, setEducation] = useState([
    {
      major: "B.Tech in Sofware Engineering",
      university: "Name of your university",
      year: "2012 - 2014",
      marks:"9.8cgpa"
    },
  ]);
  const [project , setProject] = useState([
    {
      title : "Name of Project",
      description : "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Corporis voluptatibus min Lorem50 klanflknalkfnalknf this  wike aiohoa lorem10 fodaf  wi har sh is thi code raofa j a f onf the Lorem ipsum dolor sit amet, consectetur adipisicing elit. Corporis voluptatibus minima tenetur nostrum quo aliquam dolorum incidun Lorem ipsum dolor sit amet, consectetur adipisicing elit. Corporis voluptatibus minima tenetur nostrum quo aliquam dolorum incidun o year sfalgag"
    },
    {
      title : "Name of Project",
      description : "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Corporis voluptatibus min Lorem50 klanflknalkfnalknf this  wike aiohoa lorem10 fodaf  wi har sh is thi code raofa j a f onf the Lorem ipsum dolor sit amet, consectetur adipisicing elit. Corporis voluptatibus minima tenetur nostrum quo aliquam dolorum incidun Lorem ipsum dolor sit amet, consectetur adipisicing elit. Corporis voluptatibus minima tenetur nostrum quo aliquam dolorum incidun o year sfalgag"
    }

  ])
  const [information, setInformation] = useState([
    {
      name: "email",
      value: "youremail@gmail.com",
    },
    {
      name: "phone",
      value: "+911234567890",
    },
    {
      name: "address",
      value: "4325 Street 2 , New Delhi, India",
    },
    {
      name: "website",
      value: "www.yourwebsite.com",
    },
  ]);

  useEffect(() => {
    if (resumeData?.formData) {
      setFormData({ ...resumeData?.formData });
    }
    if (resumeData?.experiences) {
      setExperiences(resumeData?.experiences);
    }
    if (resumeData?.skills) {
      setSkills(resumeData?.skills);
    }
    if (resumeData?.education) {
      setEducation(resumeData?.education);
    }
    if (resumeData?.userProfilePic) {
      setImageAsset((prevAsset) => ({
        ...prevAsset,
        imageURL: resumeData?.userProfilePic,
      }));
    }
  }, [resumeData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const toggleEditable = () => {
    setIsEdit(!isEdit);
    var inputs = document.querySelectorAll("input");
    var textarea = document.querySelectorAll("textarea");

    for (var i = 0; i < inputs.length; i++) {
      inputs[i].readOnly = !inputs[i].readOnly;
    }

    for (var i = 0; i < textarea.length; i++) {
      textarea[i].readOnly = !textarea[i].readOnly;
    }
  };

  // image upload to the cloud
  const handleFileSelect = async (event) => {
    setImageAsset((prevAsset) => ({ ...prevAsset, isImageLoading: true }));
    // console.log(event.target.files[0]);
    const file = event.target.files[0];
    if (file && isAllowed(file)) {
      const reader = new FileReader();

      reader.onload = function (event) {
        const dataURL = event.target.result;
        console.log("Data URL:", dataURL);

        // You can now use the dataURL as needed, e.g., to display an image.
        setImageAsset((prevAsset) => ({
          ...prevAsset,
          imageURL: dataURL,
        }));
      };

      // Read the file as a Data URL
      reader.readAsDataURL(file);
    } else {
      toast.error("Invalid File Format");
    }
  };

  const isAllowed = (file) => {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    return allowedTypes.includes(file.type);
  };

  // delete an image
  const deleteImageObject = () => {
    setImageAsset((prevAsset) => ({
      ...prevAsset,
      imageURL: null,
    }));
  };

  // uploader finshed

  const handleExpChange = (index, e) => {
    const { name, value } = e.target;
    // Create a copy of the workExperiences array
    const updatedExperiences = [...experiences];
    // Update the specific field for the experience at the given index
    updatedExperiences[index][name] = value;
    // Update the state with the modified array
    setExperiences(updatedExperiences);
  };
  const handleProjectChange = (index, e) => {
    const { name, value } = e.target;
    // Create a copy of the workExperiences array
    const updatedProjects = [...project];
    // Update the specific field for the experience at the given index
    updatedProjects[index][name] = value;
    // Update the state with the modified array
    setProject(updatedProjects);
  };
  const removeProject = (index) => {
    // Create a copy of the workExperiences array and remove the experience at the given index
    const updatedProject = [...project];
    updatedProject.splice(index, 1);
    // Update the state with the modified array
    setProject(updatedProject);
  };
  

  const removeExperience = (index) => {
    // Create a copy of the workExperiences array and remove the experience at the given index
    const updatedExperiences = [...experiences];
    updatedExperiences.splice(index, 1);
    // Update the state with the modified array
    setExperiences(updatedExperiences);
  };
  const addProject = () => {
   
    const updatedProject = [
      ...project,
      {
        title : "Name of Project",
        description : "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Corporis voluptatibus min "
      },
    ];
    // Update the state with the modified array
    setProject(updatedProject);
  };

  const addExperience = () => {
    // Create a copy of the workExperiences array and add a new experience
    const updatedExperiences = [
      ...experiences,
      {
        year: "2012 - 2014",
        title: "Job Position Here",
        companyAndLocation: "Company Name / Location here",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Corporis voluptatibus minima tenetur nostrum quo aliquam dolorum incidunt.",
      },
    ];
    // Update the state with the modified array
    setExperiences(updatedExperiences);
  };

  const handleSkillsChange = (index, e) => {
    const { name, value } = e.target;
    const updatedSkills = [...skills];
    updatedSkills[index][name] = value;
    setSkills(updatedSkills);
  };
  const handleInterestChange = (index, e) => {
    const { name, value } = e.target;
    const updatedInterest = [...interest];
    updatedInterest[index][name] = value;
    setInterest(updatedInterest);
  };

  const removeSkill = (index) => {
    const updatedSkills = [...skills];
    // console.log(updatedSkills);
    updatedSkills.splice(index, 1);
    setSkills(updatedSkills);
  };
  const removeInterest = (index) => {
    const updatedInterest = [...interest];
    updatedInterest.splice(index, 1);
    setInterest(updatedInterest);
  };
  const addInterest = () => {
    const updatedInterest = [
      ...interest,
      {
        title: "Interst1",
      },
    ];
    setInterest(updatedInterest);
  };

  const addSkill = () => {
    const updatedSkills = [
      ...skills,
      {
        title: "skill1",
      },
    ];
    setSkills(updatedSkills);
  };

  const handleEducationChange = (index, e) => {
    const { name, value } = e.target;
    const updatedEdu = [...education];
    updatedEdu[index][name] = value;
    setEducation(updatedEdu);
  };
  const handleInformationChange = (index, e) => {
    const { name, value } = e.target;
    const updatedInfo = [...information];
    updatedInfo[index].value = value; // Update the value property based on the index

    setInformation(updatedInfo);
  };

  const removeEducation = (index) => {
    const updatedEdu = [...education];
    updatedEdu.splice(index, 1);
    setEducation(updatedEdu);
  };
  const removeInformation = (index) => {
    const updatedInfo = information.filter((_, i) => i !== index);
    setInformation(updatedInfo);
  };

  const addEducation = () => {
    const updatedEdu = [
      ...education,
      {
        major: "B.Tech in ...",
        university: "Name of your university",
        marks: "cgpa/%",
        year: "20xx-20xx",
      },
    ];
    setEducation(updatedEdu);
  };
  const addInformation = () => {
    const newInfo = { name: "Field", value: "Value" };
    setInformation([...information, newInfo]);
  };

  const saveFormData = async () => {
    const timeStamp = serverTimestamp();
    const resume_id = `${templateName}-${user?.uid}`;
    const imageURL = await getImage();
    const _doc = {
      _id: loadedTemplateId,
      resume_id,
      formData,
      education,
      experiences,
      skills,
      timeStamp,
      userProfilePic: imageAsset.imageURL,
      imageURL,
    };
    // console.log(_doc);
    setDoc(doc(db, "users", user?.uid, "resumes", resume_id), _doc)
      .then(() => {
        toast.success(`Data Saved`);
        refetch_resumeData();
      })
      .catch((err) => {
        toast.error(`Error : ${err.message}`);
      });
  };

  const getImage = async () => {
    const element = resumeRef.current;
    element.onload = async () => {
      // Call the image capture code here
    };
    element.onerror = (error) => {
      console.error("Image loading error:", error);
    };
    if (!element) {
      console.error("Unable to capture content. The DOM element is null.");
      return;
    }
    try {
      const dataUrl = await htmlToImage.toJpeg(element);
      //   console.log(dataUrl);
      return dataUrl;
    } catch (error) {
      console.error("Oops, something went wrong!", error.message);
      return null;
    }
  };

  const generatePDF = async () => {
    const element = resumeRef.current;
    if (!element) {
      toast.info("Unable to capture content. The DOM element is null.");
    } else {
      htmlToImage
        .toPng(element)
        .then((dataURL) => {
          const A4W = 210;
          const A4H = 297;
          var pdf = new jsPDF({
            orientation: "portrait",
            unit: "mm",
            format: [A4W, A4H],
          });
          const ratio = A4W / A4H;
          const imageW = A4W;
          const imageH = A4W / ratio;
          const verticalMargin = (A4H - imageH) / 2;
          pdf.addImage(dataURL, "PNG", 0, verticalMargin, imageW, imageH);
          pdf.save(`${user?.displayName} Resume.pdf`);
        })
        .catch((error) => {
          toast.error("Unable to generate PDF. Please try again later.");
        });
    }
  };

  const generateImage = async () => {
    const element = resumeRef.current;
    if (!element) {
      toast.info("Unable to capture content. The DOM element is null.");
      return;
    }
    htmlToImage
      .toJpeg(element)
      .then((dataURL) => {
        const a = document.createElement("a");
        a.href = dataURL;
        a.download = `${user?.displayName} Resume.jpeg`;
        a.click();
      })
      .catch((error) => {
        toast.error("Unable to generate PDF. Please try again later.");
      });
  };

  const generatePng = async () => {
    const element = resumeRef.current;
    if (!element) {
      toast.info("Unable to capture content. The DOM element is null.");
      return;
    }
    htmlToImage
      .toPng(element)
      .then((dataURL) => {
        const a = document.createElement("a");
        a.href = dataURL;
        a.download = `${user?.displayName} Resume.png`;
        a.click();
      })
      .catch((error) => {
        toast.error("Unable to generate PDF. Please try again later.");
      });
  };

  const generateSvg = async () => {
    const element = resumeRef.current;
    if (!element) {
      toast.info("Unable to capture content. The DOM element is null.");
      return;
    }
    htmlToImage
      .toSvg(element)
      .then((dataURL) => {
        const a = document.createElement("a");
        a.href = dataURL;
        a.download = `${user?.displayName} Resume.svg`;
        a.click();
      })
      .catch((error) => {
        toast.error("Unable to generate PDF. Please try again later.");
      });
  };

  if (resume_isLoading) return <MainSpinner />;

  if (resume_isError) {
    return (
      <div className="w-full h-[60vh] flex flex-col items-center justify-center">
        <p className="text-lg  font-semibold">Error While fetching the data</p>
      </div>
    );
  }
  return (
    <div className="w-full flex flex-col items-center justify-start gap-4">
      {/* bread crump */}
      <div className="w-full flex items-center gap-2 px-4">
        <Link to={"/"} className="flex items-center justify-center gap-2 ">
          <FaHouse />
          Home
        </Link>
        <p className="cursor-pointer" onClick={() => navigate(-1)}>
          / Template2 /
        </p>
        <p>Edit</p>
      </div>

      <div className="w-full lg:w-[1200px] grid grid-cols-1 lg:grid-cols-12 px-6 lg:px-32 ">
        {/* template design */}
        <div className="col-span-12 px-4 py-6">
          <div className="flex items-center justify-end w-full gap-12 mb-4">
            <div
              className="flex items-center justify-center gap-1 px-3 py-1 rounded-md bg-gray-200 cursor-pointer"
              onClick={toggleEditable}
            >
              {isEdit ? (
                <FaPenToSquare className="text-sm " />
              ) : (
                <FaPencil className="text-sm " />
              )}
              <p className="text-sm ">Edit</p>
            </div>

            <div
              className="flex items-center justify-center gap-1 px-3 py-1 rounded-md bg-gray-200 cursor-pointer"
              onClick={saveFormData}
            >
              <BiSolidBookmarks className="text-sm " />
              <p className="text-sm ">Save</p>
            </div>

            <div className=" flex items-center justify-center gap-2">
              <p className="text-sm ">Download : </p>
              <BsFiletypePdf
                className="text-2xl  cursor-pointer"
                onClick={generatePDF}
              />
              <BsFiletypePng
                onClick={generatePng}
                className="text-2xl  cursor-pointer"
              />
              <BsFiletypeJpg
                className="text-2xl  cursor-pointer"
                onClick={generateImage}
              />
              <BsFiletypeSvg
                onClick={generateSvg}
                className="text-2xl  cursor-pointer"
              />
            </div>
          </div>
          <div className="w-full h-auto grid grid-cols-12" ref={resumeRef}>
            <div
              className="col-span-4 flex flex-col items-center justify-start"
              style={{ backgroundColor: "#089da3" }}
            >
              <div className="w-full h-80 bg-gray-300 flex items-center justify-center">
                {!imageAsset.imageURL ? (
                  <React.Fragment>
                    <label className=" w-full cursor-pointer h-full">
                      <div className="w-full flex flex-col items-center justify-center h-full">
                        <div className="w-full flex flex-col justify-center items-center cursor-pointer">
                          <img
                            src={TemplateTwo}
                            className="w-full h-80 object-cover"
                            alt=""
                          />
                        </div>
                      </div>

                      {isEdit && (
                        <input
                          type="file"
                          className="w-0 h-0"
                          accept=".jpeg,.jpg,.png"
                          onChange={handleFileSelect}
                        />
                      )}
                    </label>
                  </React.Fragment>
                ) : (
                  <div className="relative w-full h-full overflow-hidden rounded-md">
                    <img
                      src={imageAsset.imageURL}
                      alt=""
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />

                    {isEdit && (
                      <div
                        className="absolute top-4 right-4 w-8 h-8 rounded-md flex items-center justify-center bg-red-500 cursor-pointer"
                        onClick={deleteImageObject}
                      >
                        <FaTrash className="text-sm text-white" />
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="w-full">
              <div className="">
                  <input
                    type="text"
                    readOnly="true"
                    name="fullname"
                    value={formData.fullname}
                    onChange={handleChange}
                    className={`bg-transparent outline-none border-none text-2xl font-sans uppercase tracking-wider text-center text-white font-extrabold ${
                      isEdit && "text-white w-full"
                    }`}
                  />
                </div>

              </div>

              <div className="w-full flex flex-col items-center justify-start pl-8 mt-4">
                <div className="w-full">
                  <p className="flex items-center justify-center uppercase text-lg font-semibold rounded-md bg-white text-teal-500">
                    Information
                  </p>
                  <AnimatePresence>
                    {information &&
                      information?.map((info, i) => (
                        <motion.div
                          key={i}
                          {...opacityINOut(i)}
                          className="w-full pl-4 flex items-center justify-between relative"
                        >
                          <input
                            type="text"
                            readOnly={!isEdit}
                            name={"name"}
                            value={info.name}
                            onChange={(e) => handleInformationChange(i, e)}
                            className={`bg-transparent outline-none border-none w-2/5 text-sm font-semibold uppercase   text-gray-100 -mt-4  ${
                              isEdit && "text-green-400 w-full"
                            }`}
                          />

                          <textarea
                            readOnly={!isEdit}
                            className={`text-xs text-gray-200 mt-2  outline-none  border-none ${
                              isEdit ? "bg-[#1c1c1c]" : "bg-transparent"
                            }`}
                            name={info.name}
                            value={info.value}
                            onChange={(e) => handleInformationChange(i, e)}
                            rows="2"
                            style={{
                              maxHeight: "auto",
                              minHeight: "40px",
                              resize: "none",
                            }}
                          />
                          <AnimatePresence>
                            {isEdit && (
                              <motion.div
                                {...FadeInOutWIthOpacity}
                                onClick={() => removeInformation(i)}
                                className="cursor-pointer absolute left-0 top-1"
                              >
                                <FaTrash className="text-sm text-red-100" />
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      ))}
                  </AnimatePresence>
                </div>

                <AnimatePresence>
                  {isEdit && (
                    <motion.div
                      {...FadeInOutWIthOpacity}
                      onClick={addInformation}
                      className="cursor-pointer"
                    >
                      <FaPlus className="text-base text-gray-100" />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* skills */}
                <div className="w-full">
                  <p className="flex items-center justify-center uppercase text-lg font-semibold rounded-md bg-white text-teal-500">
                    Skills
                  </p>
                  <AnimatePresence>
                    {skills &&
                      skills?.map((skill, i) => (
                        <motion.div
                          key={i}
                          {...opacityINOut(i)}
                          className="w-full pl-4 flex items-center justify-between relative"
                        >
                          <span className="bg-slate-100 rounded-full h-2 w-2 block"></span>
                          <input
                            type="text"
                            readOnly={!isEdit}
                            name={"title"}
                            value={skill.title}
                            onChange={(e) => handleSkillsChange(i, e)}
                            className={`bg-transparent outline-none border-none  text-base font-semibold flex-1 ml-1  text-gray-100 ${
                              isEdit && "text-green-400 w-full"
                            }`}
                          />
                          <AnimatePresence>
                            {isEdit && (
                              <motion.div
                                {...FadeInOutWIthOpacity}
                                onClick={() => removeSkill(i)}
                                className="cursor-pointer absolute left-0 top-1"
                              >
                                <FaTrash className="text-sm text-red-100" />
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      ))}
                  </AnimatePresence>
                  <AnimatePresence>
                    {isEdit && (
                      <motion.div
                        {...FadeInOutWIthOpacity}
                        onClick={addSkill}
                        className="cursor-pointer flex justify-center"
                      >
                        <FaPlus className="text-base text-gray-100" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                {/* Interest */}
                <div className="w-full mt-5">
                  <p className="flex items-center justify-center uppercase text-lg font-semibold rounded-md bg-white text-teal-500">
                    Interests
                  </p>
                  <AnimatePresence>
                    {interest &&
                      interest?.map((skill, i) => (
                        <motion.div
                          key={i}
                          {...opacityINOut(i)}
                          className="w-full pl-4 flex items-center justify-between relative"
                        >
                          <span className="bg-slate-100 rounded-full h-2 w-2 block"></span>
                          <input
                            type="text"
                            readOnly={!isEdit}
                            name={"title"}
                            value={skill.title}
                            onChange={(e) => handleInterestChange(i, e)}
                            className={`bg-transparent outline-none border-none  text-base font-semibold flex-1 ml-1 py-1  text-gray-100 ${
                              isEdit && "text-green-400 w-full"
                            }`}
                          />
                          <AnimatePresence>
                            {isEdit && (
                              <motion.div
                                {...FadeInOutWIthOpacity}
                                onClick={() => removeInterest(i)}
                                className="cursor-pointer absolute left-0 top-1"
                              >
                                <FaTrash className="text-sm text-red-100" />
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      ))}
                  </AnimatePresence>
                  <AnimatePresence>
                    {isEdit && (
                      <motion.div
                        {...FadeInOutWIthOpacity}
                        onClick={addInterest}
                        className="cursor-pointer flex justify-center"
                      >
                        <FaPlus className="text-base text-gray-100" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Right */}
            <div className="col-span-8 flex flex-col items-center justify-start bg-white">
              <div className="w-full"></div>

              {/* education */}
              <div className="w-full px-8 py-6 flex flex-col items-start justify-start gap-6">
                <div className="w-full">
                  <p className="uppercase text-xl tracking-wider font-bold">Education</p>
                  <div className="w-full h-1 my-3" style={{ backgroundColor: "#089da3" }}></div>
                  <div className="w-full flex flex-col items-start justify-start">
                  <AnimatePresence>
                      {education &&
                        education?.map((exp, i) => (
                          <motion.div
                            {...opacityINOut(i)}
                            className="w-full flex flex-col relative mb-2"
                            key={i}
                          >
                            <div className="">
                              <input
                                value={exp.university}
                                onChange={(e) => handleEducationChange(i, e)}
                                name="university"
                                type="text"
                                readOnly="true"
                                className={` outline-none border-none text-base tracking-wide uppercase text-emerald-700 font-semibold w-full ${
                                  isEdit ? "bg-gray-200" : "bg-transparent"
                                }`}
                              />
                            </div>
                            <div className="">
                              <AnimatePresence>
                                {isEdit && (
                                  <motion.div
                                    {...FadeInOutWIthOpacity}
                                    onClick={() => removeEducation(i)}
                                    className="cursor-pointer absolute right-0 top-2 z-10"
                                  >
                                    <FaTrash className="text-base " />
                                  </motion.div>
                                )}
                              </AnimatePresence>
                              <input
                                value={exp.major}
                                onChange={(e) => handleEducationChange(i, e)}
                                name="major"
                                type="text"
                                readOnly="true"
                                className={` outline-none border-none text-base tracking-wide capitalize text-txtDark w-full ${
                                  isEdit ? "bg-gray-200" : "bg-transparent"
                                }`}
                              />

                              <input
                                value={exp.marks}
                                onChange={(e) => handleEducationChange(i, e)}
                                name="marks"
                                type="text"
                                readOnly="true"
                                className={` outline-none border-none text-sm tracking-wide capitalize  w-full ${
                                  isEdit ? "bg-gray-200" : "bg-transparent"
                                }`}
                              />

                              <textarea
                                readOnly="true"
                                className={`text-xs  tracking-wider w-full absolute top-0 left-3/4 outline-none border-none ${
                                  isEdit ? "bg-gray-200" : "bg-transparent"
                                }`}
                                name="year"
                                value={exp.year}
                                onChange={(e) => handleEducationChange(i, e)}
                      
                              />
                            </div>
                          </motion.div>
                        ))}
                    </AnimatePresence>
                    <AnimatePresence>
                      {isEdit && (
                        <motion.div
                          {...FadeInOutWIthOpacity}
                          onClick={addEducation}
                          className="cursor-pointer"
                        >
                          <FaPlus className="text-base " />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* experience */}
                <div className="w-full">
                  <p className="uppercase text-xl tracking-wider">
                    Work Experience
                  </p>
                  <div className="w-full h-1  my-3"style={{ backgroundColor: "#089da3" }}></div>
                  <div className="w-full flex flex-col items-center justify-start gap-4">
                    <AnimatePresence>
                      {experiences &&
                        experiences?.map((exp, i) => (
                          <motion.div
                            {...opacityINOut(i)}
                            className="w-full grid grid-cols-12"
                            key={i}
                          >
                            <div className="col-span-4">
                              <input
                                value={exp.year}
                                onChange={(e) => handleExpChange(i, e)}
                                name="year"
                                type="text"
                                readOnly="true"
                                className={` outline-none border-none text-base tracking-eide uppercase text-txtDark w-full ${
                                  isEdit ? "bg-gray-200" : "bg-transparent"
                                }`}
                              />
                            </div>
                            <div className="col-span-8 relative">
                              <AnimatePresence>
                                {isEdit && (
                                  <motion.div
                                    {...FadeInOutWIthOpacity}
                                    onClick={() => removeExperience(i)}
                                    className="cursor-pointer absolute right-0 top-2"
                                  >
                                    <FaTrash className="text-base " />
                                  </motion.div>
                                )}
                              </AnimatePresence>
                              <input
                                value={exp.title}
                                onChange={(e) => handleExpChange(i, e)}
                                name="title"
                                type="text"
                                readOnly="true"
                                className={` outline-none border-none font-sans text-lg tracking-wide capitalize text-txtDark w-full ${
                                  isEdit ? "bg-gray-200" : "bg-transparent"
                                }`}
                              />

                              <input
                                value={exp.companyAndLocation}
                                onChange={(e) => handleExpChange(i, e)}
                                name="companyAndLocation"
                                type="text"
                                readOnly="true"
                                className={` outline-none border-none text-sm tracking-wide capitalize  w-full ${
                                  isEdit ? "bg-gray-200" : "bg-transparent"
                                }`}
                              />

                              <textarea
                                readOnly="true"
                                className={`text-xs mt-4   tracking-wider w-full  outline-none border-none ${
                                  isEdit ? "bg-gray-200" : "bg-transparent"
                                }`}
                                name="description"
                                value={exp.description}
                                onChange={(e) => handleExpChange(i, e)}
                                rows="3"
                                style={{
                                  maxHeight: "auto",
                                  minHeight: "60px",
                                  resize: "none",
                                }}
                              />
                            </div>
                          </motion.div>
                        ))}
                    </AnimatePresence>
                    <AnimatePresence>
                      {isEdit && (
                        <motion.div
                          {...FadeInOutWIthOpacity}
                          onClick={addExperience}
                          className="cursor-pointer"
                        >
                          <FaPlus className="text-base " />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <div className="w-full">
                  <p className="uppercase text-xl tracking-wider">
                    Projects
                  </p>
                  <div className="w-full h-1 my-3"style={{ backgroundColor: "#089da3" }}></div>
                  <div className="w-full flex flex-col items-center justify-start gap-4">
                    <AnimatePresence>
                      {project &&
                        project?.map((exp, i) => (
                          <motion.div
                            {...opacityINOut(i)}
                            className="w-full grid grid-cols-12"
                            key={i}
                          >
                            <div className="col-span-4">
                              <input
                                value={exp.title}
                                onChange={(e) => handleProjectChange(i, e)}
                                name="title"
                                type="text"
                                readOnly="true"
                                className={` outline-none border-none text-base tracking-eide uppercase text-txtDark w-full ${
                                  isEdit ? "bg-gray-200" : "bg-transparent"
                                }`}
                              />
                            </div>
                            <div className="col-span-8 relative">
                              <AnimatePresence>
                                {isEdit && (
                                  <motion.div
                                    {...FadeInOutWIthOpacity}
                                    onClick={() => removeProject(i)}
                                    className="cursor-pointer absolute right-0 top-2"
                                  >
                                    <FaTrash className="text-base " />
                                  </motion.div>
                                )}
                              </AnimatePresence>

                              <textarea
                                readOnly="true"
                                className={`text-xs w-full h-auto outline-none border-none ${
                                  isEdit ? "bg-gray-200" : "bg-transparent"
                                }`}
                                rows={`${exp.description.length/50}`}
                                name="description"
                                value={exp.description}
                                onChange={(e) => handleProjectChange(i, e)}
                                // style={{
                                //   maxHeight: "auto",
                                //   minHeight: "60px",
                                //   resize: "none",
                                // }}
                              />
                            </div>
                          </motion.div>
                        ))}
                    </AnimatePresence>
                    <AnimatePresence>
                      {isEdit && (
                        <motion.div
                          {...FadeInOutWIthOpacity}
                          onClick={addProject}
                          className="cursor-pointer"
                        >
                          <FaPlus className="text-base " />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Template2;
