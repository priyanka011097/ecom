import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema({
    image: { type: String, required: true },
    heading: { type: String, default: "" },
    subText: { type: String, default: "" },
    date: { type: Number, required: true }
})

const bannerModel = mongoose.models.banner || mongoose.model("banner", bannerSchema);

export default bannerModel
