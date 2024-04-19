const express = require('express');
const router=express.Router();
const {postAudio,getAudios,getAudioDetails} =require('../controllers/audioController');
router.route('/').post(postAudio);
router.route('/details/:id').get(getAudios);
router.route('/details').get(getAudioDetails);


module.exports=router;