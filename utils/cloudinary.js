import { v2 as cloudinary } from "cloudinary"
import fs from "fs"
import { ApiError } from './ApiError'

// Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLODINARY_APIKEY,
    api_secret: process.env.CLODINARY_SECRET // Click 'View API Keys' above to copy your API secret
});


const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!fs.existsSync(localFilePath)) {
            return null;
        }
        const response = await cloudinary.uploader
            .upload(localFilePath, {
                resource_type: 'auto',
            });
        console.log('file is uploaded to cloudinary',
            response.url)
        return response
    }
    catch (error) {
        fs.unlinkSync(localFilePath);
        throw new ApiError(error.message)
    }
}

export { uploadOnCloudinary };