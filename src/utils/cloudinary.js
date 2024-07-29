const cloudinary  = require('cloudinary').v2
const fs = require('fs');


// Configuration
cloudinary.config({ 
    cloud_name:process.env.CLOUDINARY_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_SECRET
});
    
// Upload an image
const uploadOnCloudinary = async(localPath)=>{
   try {
    const result = await cloudinary.uploader.upload(localPath, {resource_type:"auto"});
    console.log("File is Uploaded" ,result.url);
   
    fs.unlinkSync(localPath);
    return result
   } catch (error) {
     console.log(localPath);
     fs.unlinkSync(localPath)
     console.log(error)
     return null
   }
}

const deleteFromCloudinary = async (id)=>{
    try {
        if(!id) return null;
        const result = await  cloudinary.uploader.destroy(id);
        console.log("Deleted image" ,result);
        return result
    } catch (error) {
        console.error('Error deleting image:', error);
        throw error;
    }
}

module.exports = {deleteFromCloudinary, uploadOnCloudinary}

