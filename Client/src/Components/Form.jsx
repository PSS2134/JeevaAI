import React, { useState,useEffect } from "react";
import "./Form.css";
import img from "../Images/docimg.jpg";
import AudioCard from "./AudioCard";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Form = () => {
const [audios, setAudios]=useState([]);
  
  useEffect(() => {
    fetch('http://localhost:5000/tracks/details').then(res=>res.json()).
    then(data=>{
      console.log(data);
       setAudios(data);
    })
  });

  const [payload, setPayload] = useState({
    doctor: "",
    patient: "",
    age: "",
    date: "",
  });
  const handleFormChange = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    if(name!="file")
    {
      setPayload({ ...payload, [name]: value });
    }
    
  };
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    const file=document.getElementById('audio')
    // console.log(payload);
    if(!payload.doctor || !payload.patient || !payload.age||!payload.date||!file.files[0])
    {
      toast.error("☹️ Please Fill up the Empty Fields")
      return;
    }
    if(payload.age>110)
    {
      toast.error("Please enter a valid age");
      return;
    }
    formData.append('doctor', payload.doctor);
    formData.append('patient', payload.patient);
    formData.append('age', payload.age);
    formData.append('date', payload.date);
    
    formData.append('audio', file.files[0]);
    
    console.log(...formData);
  
    try {
      const res = await fetch('http://localhost:5000/tracks', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      console.log(data); // log response from server
      window.location.reload();
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  return (
    <div>
      <div class="modal-box">
        <img class="banner-img-suggest" src={img}></img>

        <div class="modal-div">
          <p class="suggest-subheader">Sound Data Form</p>

          <div style={{ margin: "6vh 4vh" }}>
            <p class="input-header" id="doctorName">
              Doctor' s Name
            </p>
            <input
              class="input-box"
              style={{ width: "100%", borderRadius: "none" }}
              type="text"
              placeholder="Dr. John"
              name="doctor"
              onChange={handleFormChange}
            ></input>
          </div>
          <div style={{ margin: "6vh 4vh" }}>
            <p class="input-header" id="patientName">
              Patient' s Name
            </p>
            <input
              class="input-box"
              style={{ width: "100%" }}
              type="text"
              placeholder="Priyansh Shrivastav"
              name="patient"
              onChange={handleFormChange}
            ></input>
          </div>
          <div class="input-suggest-flexbox">
            <div style={{ margin: "0vh 4vh" }}>
              <p class="input-header" id="age">
                Patient' s Age
              </p>
              <input
                class="input-box"
                style={{ width: "100%" }}
                type="number"
                placeholder="21"
                name="age"
                min='0'
                max='100'
                onChange={handleFormChange}
              ></input>
            </div>

            <div style={{ margin: "0vh 4vh" }}>
              <p class="input-header" id="date">
                Date
              </p>
              <input
                class="input-box"
                style={{ width: "100%" }}
                type="date"
                placeholder="19-04-2024"
                name="date"
                onChange={handleFormChange}
              ></input>
            </div>
          </div>
          <div style={{ margin: "8vh 4vh" }}>
            <label for="audio" className="input-header">
              Audio File
            </label>
            <input
              type="file"
              id="audio"
              accept=".mp3,audio/*"
              name="file"
              onChange={(e)=>{
                setPayload({...payload,file:e.target.files[0]});
              }}
            />
          </div>

          <button
          type="submit"
            class="suggest-btn"
            id="send_button"
            onClick={handleFormSubmit}
           
          >
            Submit
          </button>
        </div>

        
      </div>
      <div >
          <p className="audio-header">Audios</p>
          {audios.length && audios.toReversed().map((single)=>{
          return (
            <AudioCard doc={single.doctor} pat={single.patient} age={single.age} date={single.date} id={single.fileId}/>
          )
         })}
        </div>
    </div>
  );
};

export default Form;
