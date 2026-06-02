import express from 'express'
import { addBanner, listBanners, removeBanner } from '../controllers/bannerController.js'
import upload from '../middleware/multer.js';
import adminAuth from '../middleware/adminAuth.js';

const bannerRouter = express.Router();

bannerRouter.post('/add', adminAuth, upload.single('image'), addBanner);
bannerRouter.post('/remove', adminAuth, removeBanner);
bannerRouter.get('/list', listBanners);

export default bannerRouter
