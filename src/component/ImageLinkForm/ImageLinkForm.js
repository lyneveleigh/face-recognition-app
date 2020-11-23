import React from "react";

const ImageLinkForm = ({onInputChange, onButtonSubmit}) => {    //phai co {} de nhan dien la function neu ko se hieu la object
  return (
    <div>
      <p className="f3">Put the picture here</p>
      <div>
          <input 
            className= 'f4 h3 ba bw1 br4 w-70 center' 
            type='text' 
            onChange={onInputChange}/>
          <br/>
          <button 
            className='w-30 grow  ma4 f3 link ph3 pv2 dib white bg-dark-blue' 
            onClick={onButtonSubmit}> Dectect</button>
      </div>
    </div>
  );
};

export default ImageLinkForm;
