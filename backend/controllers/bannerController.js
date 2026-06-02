import { v2 as cloudinary } from "cloudinary"
import bannerModel from "../models/bannerModel.js"

// function for adding a banner slide
const addBanner = async (req, res) => {
    try {

        const { heading, subText } = req.body

        if (!req.file) {
            return res.json({ success: false, message: "Banner image is required" })
        }

        const result = await cloudinary.uploader.upload(req.file.path, { resource_type: 'image' })

        const banner = new bannerModel({
            image: result.secure_url,
            heading: heading || "",
            subText: subText || "",
            date: Date.now()
        })
        await banner.save()

        res.json({ success: true, message: "Banner Added" })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// function for listing banners
const listBanners = async (req, res) => {
    try {

        const banners = await bannerModel.find({})
        res.json({ success: true, banners })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// function for removing a banner
const removeBanner = async (req, res) => {
    try {

        await bannerModel.findByIdAndDelete(req.body.id)
        res.json({ success: true, message: "Banner Removed" })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export { addBanner, listBanners, removeBanner }
