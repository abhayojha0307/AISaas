const express = require('express');
const aiRouter = express.Router();
const { generateArticle, generateBlogTitle, generateImage, removeBackground, removeObject, reviewResume } = require('../controllers/aiController.js');
const { auth } = require('../middlewares/auth.js');
const { upload } = require('../configs/multer.js');


aiRouter.post('/generate-article',generateArticle);
aiRouter.post('/generate-blog-title',generateBlogTitle);
aiRouter.post('/generate-image',generateImage);
aiRouter.post('/remove-background',upload.single("image"),removeBackground);
aiRouter.post('/remove-object',upload.single("image"),removeObject);
aiRouter.post('/review-resume',upload.single("resume"),reviewResume);

module.exports = aiRouter;
