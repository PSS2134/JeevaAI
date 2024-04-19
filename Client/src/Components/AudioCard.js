import React,{useEffect} from 'react'
import './AudioCard.css'
const AudioCard = ({doc,pat,age,date,id}) => {
//   console.log(id);
  return (
    <div>
      <div className='audiocard'>
        <div className='audiocard-flexbox'>
            <div className='audiocard-left'>
            <p className='audiocard-content'>Doctor's Name : {doc}</p>
            <p  className='audiocard-content'>Patient's Name : {pat}</p>
            </div>
            <div  className='audiocard-right'>
            <p  className='audiocard-content'>Age : {age}</p>
            <p  className='audiocard-content'>Date : {String(date).slice(0,10)} </p>
            </div>
        </div>
        <audio className='audiocard-audio-element' controls src={`http://localhost:5000/tracks/details/${id}`}></audio>
      </div>
    </div>
  )
}

export default AudioCard
