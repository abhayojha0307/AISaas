const express = require('express');
const userRouter = express.Router();
const { getUserCreation,getPublishCreations,toggleLikeCreations } = require('../controllers/userController.js');


userRouter.get('/get-user-creations',getUserCreation);
userRouter.get('/get-publish-creations',getPublishCreations);
userRouter.post('/toggle-like-creation',toggleLikeCreations);

module.exports = userRouter;
