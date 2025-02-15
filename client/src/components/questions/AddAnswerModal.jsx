import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AddPhotosModal from './AddPhotosModal.jsx';
import interactions from '../shared/interactions.js';

const AddAnswerModal = ({isOpen, productName, question, setModalState, product_id}) => {
  const [answerBody, setAnswerBody] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [photos, setPhotos] = useState([]);
  const [photoOpen, setPhotoOpen] = useState(false);

  const closeModal = function() {
    interactions("closeAddAnswerModal", "questions");
    setModalState(false);
  };

  const postHandler = function() {
    let obj = {};
    obj.body = answerBody;
    obj.name = username;
    obj.email = email;
    if (photos && photos.length > 0) {
      obj.photos = photos;
    }
    var urlString = '/api/qa/questions/' + question.question_id + '/answers';
    return axios({
      method: 'post',
      url: urlString,
      responseType: 'json',
      data: JSON.stringify(obj),
      headers: {'Content-Type': 'application/json'},

    });
  };

  const inputValidator = function() {

    let valid = true;
    let validBody = true;
    let validEmail = true;
    let validUsername = true;

    if (answerBody.trim().length === 0){
      valid = false;
      validBody = false;
    }
    if (email.trim().length === 0){
      valid = false;
      validEmail = false;
    } else {
      const reg = new RegExp(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
      if (!reg.test(email)) {
        valid = false;
        validEmail = false;
      }
    }
    if (username.trim().length === 0 ){
      valid = false;
      validUsername = false;
    }

    if (!valid) {
      let mess = "You must enter the following:";
      if (!validBody) {
        mess += "\nAnswer";
      }
      if (!validEmail) {
        mess += "\nEmail";
      }
      if (!validUsername) {
        mess += "\nUsername";
      }
      alert(mess);
      return false;
    }

    return true;
  };

  //#region input field state change handlers
  const handleBodyChange = function(e) {
    e.preventDefault();
    setAnswerBody(e.target.value);
  };

  const handleEmailChange = function(e) {
    e.preventDefault();
    setEmail(e.target.value);
  };

  const handleUsernameChange = function(e) {
    e.preventDefault();
    setUsername(e.target.value);
  };
  //#endregion

  const handleSubmitButton = function(e) {
    e.preventDefault();
    interactions("submitAddAnswer", "questions");
    if (inputValidator()) {
      postHandler().then((res) => {
        alert("Submission Added");
        closeModal();
      }
      )}
  };

  const openPhotoModal = function() {
    interactions("openAddPhotoModal", "questions");
    setPhotoOpen(true);
  };

  return ( isOpen ? (
    <div className='modalBackground'>
      <div className='addModal'>
        <div className='modalTopBar'>
          <div className='modalTitle'>Submit your Answer</div>
          <div className='modalSubTitle'>{productName}: {question.question_body}</div>
        </div>
        <div className='modalInputsList'>
          <div className='modalInputListItem'>
            <div className='modalInputLabel'>Your Answer*</div>
            <textarea type="text" value={answerBody} onChange={handleBodyChange} maxLength="1000" placeholder="Have a question? Search for answers…"/>
          </div>
          <div className='modalInputListItem'>
            <div className='modalInputLabel'>What is your nickname?*</div>
            <input type="text" value={username} onChange={handleUsernameChange} maxLength="60" placeholder="Have a question? Search for answers…"/>
            <div className="modalInputNote">For privacy reasons, do not use your full name or email address</div>
          </div>
          <div className='modalInputListItem'>
            <div className='modalInputLabel'>What is your email?*</div>
            <input type="email" value={email} onChange={handleEmailChange} maxLength="60" placeholder="Have a question? Search for answers…"/>
            <div className="modalInputNote">For authentication reasons, you will not be emailed</div>
          </div>
          <div className='modalInputListItem'>
          <AddPhotosModal isOpen={photoOpen} setModalState={setPhotoOpen} setPhotoUrls={setPhotos} question={question}/>
            <input type="button" value="Upload your photos" onClick={openPhotoModal} className="newFormBtn"/>
          </div>
          <div className='modalInputListItem'>
            <input type="button" value="Submit answer" onClick={handleSubmitButton} className="newFormBtn"/>
          </div>
        </div>
        <div className='modalBottomBar'>
          <div className='modalInputListItem'>
            <input type="button" value="Close/Cancel" onClick={closeModal} className="newFormBtn"/>
          </div>
        </div>
      </div>
    </div>
    ): false
  );
};

export default AddAnswerModal;


