"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const mongoose_1 = __importDefault(require("mongoose"));
const user_model_1 = __importDefault(require("../models/user.model"));
const trip_model_1 = __importDefault(require("../models/trip.model"));
const swipe_model_1 = __importDefault(require("../models/swipe.model"));
const chat_model_1 = __importDefault(require("../models/chat.model"));
const busboy_1 = __importDefault(require("busboy"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const storage_blob_1 = require("@azure/storage-blob");
const CONTAINER_CONNECTION_STRING = process.env.CONTAINER_CONNECTION_STRING;
const CONTAINER_NAME = process.env.CONTAINER_NAME;
const DIRECTORY = process.env.DIRECTORY;
const STORAGE_ACCOUNT = process.env.STORAGE_ACCOUNT;
class UserController {
    static location(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x;
            try {
                const userId = req.user.id;
                if (!userId) {
                    res.status(400).json({ message: 'Invalid userId' });
                    return;
                }
                const user = yield user_model_1.default.findById(userId);
                if (!user) {
                    res.status(404).json({ message: 'User not found' });
                    return;
                }
                // const { longitude, latitude } = req.body;
                const longitude = parseFloat(req.body.longitude);
                const latitude = parseFloat(req.body.latitude);
                if (!longitude || !latitude || isNaN(longitude) || isNaN(latitude)) {
                    res.status(400).json({ message: 'Longitude and latitude are required' });
                    return;
                }
                if (Array.isArray((_a = user.location) === null || _a === void 0 ? void 0 : _a.coordinates) &&
                    user.location.coordinates.length >= 2 && latitude === ((_b = user.location) === null || _b === void 0 ? void 0 : _b.coordinates[1]) && longitude === ((_c = user.location) === null || _c === void 0 ? void 0 : _c.coordinates[0])) {
                    console.log("user location is already updated");
                    res.status(200).json({ message: 'Location is already updated', location: (_d = user.address) === null || _d === void 0 ? void 0 : _d.city });
                    return;
                }
                user.location = {
                    type: "Point",
                    coordinates: [longitude, latitude]
                };
                const response = yield fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
                const resp = yield response.json();
                // print city, state, country, zipCode
                console.log("response is ", resp.address);
                user.address = {
                    street: ((_e = resp.address) === null || _e === void 0 ? void 0 : _e.residential)
                        || ((_f = resp.address) === null || _f === void 0 ? void 0 : _f.road)
                        || ((_g = resp.address) === null || _g === void 0 ? void 0 : _g.neighbourhood)
                        || "",
                    city: ((_h = resp.address) === null || _h === void 0 ? void 0 : _h.city)
                        || ((_j = resp.address) === null || _j === void 0 ? void 0 : _j.town)
                        || ((_k = resp.address) === null || _k === void 0 ? void 0 : _k.village)
                        || ((_l = resp.address) === null || _l === void 0 ? void 0 : _l.suburb)
                        || ((_m = resp.address) === null || _m === void 0 ? void 0 : _m.county)
                        || ((_o = resp.address) === null || _o === void 0 ? void 0 : _o.neighbourhood)
                        || ((_p = resp.address) === null || _p === void 0 ? void 0 : _p.state_district)
                        || ((_q = resp.address) === null || _q === void 0 ? void 0 : _q.state)
                        || ((_r = resp.address) === null || _r === void 0 ? void 0 : _r.country)
                        || "",
                    state: ((_s = resp.address) === null || _s === void 0 ? void 0 : _s.state_district)
                        || ((_t = resp.address) === null || _t === void 0 ? void 0 : _t.state)
                        || "",
                    country: (_u = resp.address) === null || _u === void 0 ? void 0 : _u.country,
                    zipCode: (_v = resp.address) === null || _v === void 0 ? void 0 : _v.postcode,
                    countryCode: (_w = resp.address) === null || _w === void 0 ? void 0 : _w.country_code
                };
                yield user.save();
                res.status(200).json({ message: 'Location updated successfully', location: (_x = user.address) === null || _x === void 0 ? void 0 : _x.city });
                return;
            }
            catch (error) {
                console.error("Error in location:", error);
                res.status(500).json({ message: 'Internal Server Error', error: error.message });
                return;
            }
        });
    }
    // static async uploadProfilePicture(req: Request, res: Response) {
    //     try {
    //         const userId = (req as any).user?.id;
    //         if (!userId) {
    //             res.status(400).json({ message: "Invalid userId" });
    //             return;
    //         }
    //         const user = await User.findById(userId);
    //         if (!user) {
    //             res.status(404).json({ message: "User not found" });
    //             return;
    //         }
    //         const bb = busboy({ headers: req.headers });
    //         let imageFileName = "";
    //         let imageToUpload: { filePath?: string; mimetype?: string } = {};
    //         bb.on("file", (_fieldname: string, file: NodeJS.ReadableStream, filename: string | { filename: string }, encoding: string, fileMimeType: string) => {
    //             const safeFilename = typeof filename === "string" ? filename : filename?.filename;
    //             const extension = path.extname(safeFilename);
    //             if (extension !== ".jpg" && extension !== ".jpeg" && extension !== ".png" && extension !== ".heic") {
    //                 res.status(400).json({ message: "Invalid file type. Only .jpg, .jpeg, .png, and .heic are allowed." });
    //                 return;
    //             }
    //             const uniqueFileName = `${Date.now() / 1000}${extension}`;
    //             imageFileName = uniqueFileName;
    //             const filePath = path.join(__dirname, "..", "TempUploads", uniqueFileName);
    //             imageToUpload = { filePath, mimetype: fileMimeType };
    //             file.pipe(fs.createWriteStream(filePath));
    //         });
    //         bb.on("finish", async () => {
    //             if (!imageFileName || !imageToUpload.filePath) {
    //                 res.status(400).json({ message: "No file uploaded" });
    //                 return;
    //             }
    //             const blobServiceClient = BlobServiceClient.fromConnectionString(CONTAINER_CONNECTION_STRING);
    //             const containerClient = blobServiceClient.getContainerClient(CONTAINER_NAME);
    //             const blobName = `${DIRECTORY}/${imageFileName}`;
    //             const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    //             await blockBlobClient.uploadFile(imageToUpload.filePath, {
    //                 blobHTTPHeaders: {
    //                     blobContentType: imageToUpload.mimetype || "application/octet-stream"
    //                 }
    //             });
    //             const fileUrl = `https://${STORAGE_ACCOUNT}.blob.core.windows.net/${CONTAINER_NAME}/${blobName}`;
    //             console.log("File uploaded successfully:", fileUrl);
    //             const filesplit = fileUrl.split('/');
    //             const filename = filesplit[filesplit.length - 1];
    //             console.log("filename is ", filename);
    //             console.log(`complete name is profile-pic-storage/${filename}`);
    //             // if (user.profilePic && user.profilePic.length > 0) {
    //             //     console.log("user profilePic is ", user.profilePic);
    //             //     const resultDeletion = await deleteOldProfilePic(`profile-pic-storage/${filename}`);
    //             //     console.log("result of deletion is ", resultDeletion);
    //             // }
    //             // if (user.profilePic && user.profilePic.length > 0) {
    //             //     const oldUrl = user.profilePic[0];
    //             //     const urlPrefix = `https://${STORAGE_ACCOUNT}.blob.core.windows.net/${CONTAINER_NAME}/`;
    //             //     const oldBlobPath = oldUrl.startsWith(urlPrefix)
    //             //         ? oldUrl.slice(urlPrefix.length)
    //             //         : ""; // fallback
    //             //     if (!oldBlobPath) {
    //             //         console.error("Invalid old profilePic URL format");
    //             //     } else {
    //             //         console.log("Deleting old profile picture:", oldBlobPath);
    //             //         const oldBlobClient = containerClient.getBlockBlobClient(oldBlobPath);
    //             //         try {
    //             //             const deleteResponse = await oldBlobClient.deleteIfExists();
    //             //             if (deleteResponse.succeeded) {
    //             //                 console.log("Old profile picture deleted successfully");
    //             //             } else {
    //             //                 console.log("Old picture not found or already deleted");
    //             //             }
    //             //         } catch (err) {
    //             //             console.error("Error deleting old profile picture:", err);
    //             //         }
    //             //     }
    //             // }
    //             if (user.profilePic && user.profilePic.length > 0) {
    //                 try {
    //                     const oldUrl = user.profilePic[0];
    //                     const urlPrefix = `https://${STORAGE_ACCOUNT}.blob.core.windows.net/${CONTAINER_NAME}/`;
    //                     if (!oldUrl.startsWith(urlPrefix)) {
    //                         console.warn("Old profilePic URL does not match expected prefix, skipping delete");
    //                     } else {
    //                         const oldBlobPath = oldUrl.substring(urlPrefix.length);
    //                         const oldBlobClient = containerClient.getBlockBlobClient(oldBlobPath);
    //                         console.log("Attempting to delete old blob:", oldBlobPath);
    //                         const deleteResult = await oldBlobClient.deleteIfExists();
    //                         if (deleteResult.succeeded) {
    //                             console.log("Old profile picture deleted successfully");
    //                         } else {
    //                             console.log("Old picture not found or already deleted");
    //                         }
    //                     }
    //                 } catch (err) {
    //                     console.error("Error during old image deletion:", err);
    //                 }
    //             }
    //             // Delete the old profile picture if it exists
    //             // Delete the old profile pic if it exists
    //             // if (user.profilePic && user.profilePic.length > 0) {
    //             //     const oldUrl = user.profilePic[0];
    //             //     // Extract the path after the container name
    //             //     const urlPrefix = `https://${STORAGE_ACCOUNT}.blob.core.windows.net/${CONTAINER_NAME}/`;
    //             //     const oldBlobPath = oldUrl.startsWith(urlPrefix)
    //             //         ? oldUrl.slice(urlPrefix.length)
    //             //         : ""; // fallback if URL is somehow wrong
    //             //     if (!oldBlobPath) {
    //             //         console.error("Invalid old profilePic URL format");
    //             //     } else {
    //             //         const oldBlobClient = containerClient.getBlockBlobClient(oldBlobPath);
    //             //         try {
    //             //             const deleteResponse = await oldBlobClient.deleteIfExists();
    //             //             if (deleteResponse.succeeded) {
    //             //                 console.log("Old profile picture deleted successfully");
    //             //             } else {
    //             //                 console.log("Old picture not found or already deleted");
    //             //             }
    //             //         } catch (err) {
    //             //             console.error("Error deleting old profile picture:", err);
    //             //         }
    //             //     }
    //             // }
    //             // Update user record
    //             user.profilePic = [fileUrl];
    //             console.log("user profile pic is", user.profilePic)
    //             await user.save();
    //             // Cleanup temp file
    //             fs.unlink(imageToUpload.filePath, (err) => {
    //                 if (err) console.error("Error deleting local file:", err);
    //                 else console.log("Local temp file deleted");
    //             });
    //             res.status(200).json({
    //                 message: "File uploaded successfully",
    //                 fileName: imageFileName,
    //                 fileUrl: fileUrl,
    //                 mimetype: imageToUpload.mimetype
    //             });
    //             return;
    //         });
    //         req.pipe(bb);
    //     } catch (error) {
    //         console.error("Error in uploadProfilePicture:", error);
    //         res.status(500).json({ message: "Internal Server Error" });
    //         return;
    //     }
    // }
    // static async uploadProfilePicture(req: Request, res: Response) {
    //     try {
    //         const userId = (req as any).user.id;
    //         if (!userId) {
    //             res.status(400).json({ message: 'Invalid userId' });
    //             return;
    //         }
    //         const user = await User.findById(userId);
    //         if (!user) {
    //             res.status(400).json({ message: 'User not found' });
    //             return;
    //         }
    //         const busboyHeader = busboy({ headers: req.headers }); //it is used to parse the multipart/form-data request
    //         let imageFileName: string;
    //         let imageTobeUplaoded: { filePath?: string; mimetype?: string } = {};
    //         busboyHeader.on('file', (fieldname: string, file: NodeJS.ReadableStream, filename: string | { filename: string }, encoding: string, mimetype: string) => {
    //             // console.log("file is ", file);
    //             // console.log("filename is ", filename);
    //             // Generate a unique filename using UUID
    //             // const uniqueFileName = `${Date.now()}-${filename}`;
    //             const actualFileName = (filename && typeof filename === 'object' && filename.filename)
    //                 ? filename.filename
    //                 : String(filename); // fallback for safety
    //             const uniqueFileName = `${Date.now()}-${actualFileName}`;
    //             imageFileName = uniqueFileName;
    //             const filePath = path.join(__dirname, '..', 'TempUploads', uniqueFileName);
    //             imageTobeUplaoded = { filePath, mimetype };
    //             file.pipe(fs.createWriteStream(filePath));
    //         });
    //         // console.log("busboyHeader is ", busboyHeader);
    //         // deleteImage=(imageFileName) => {
    //         // }
    //         busboyHeader.on('finish', async () => {
    //             try {
    //                 if (!imageFileName || !imageTobeUplaoded.filePath) {
    //                     res.status(400).json({ message: 'No file uploaded' });
    //                     return;
    //                 }
    //                 // console.log("imageTobeUplaoded is ", imageTobeUplaoded);
    //                 // uploading the file to azure blob storage
    //                 const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.CONTAINER_CONNECTION_STRING || '');
    //                 const containerClient = blobServiceClient.getContainerClient(process.env.CONTAINER_NAME || 'profile-pic-storage');
    //                 const blobName = `${process.env.DIRECTORY}/${imageFileName}`;
    //                 const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    //                 const uploadBlobResponse = await blockBlobClient.uploadFile(imageTobeUplaoded.filePath, {
    //                     blobHTTPHeaders: {
    //                         blobContentType: imageTobeUplaoded.mimetype || 'application/octet-stream'
    //                     }
    //                 });
    //                 console.log(`Upload block blob ${blobName} successfully`, uploadBlobResponse.requestId);
    //                 // After successful upload, delete the local file
    //                 fs.unlink(imageTobeUplaoded.filePath, (err) => {
    //                     if (err) {
    //                         console.error("Error deleting local file:", err);
    //                     } else {
    //                         console.log("Local file deleted successfully");
    //                     }
    //                 });
    //                 // Return the URL of the uploaded file
    //                 const fileUrl = `https://${process.env.STORAGE_ACCOUNT}.blob.core.windows.net/${process.env.CONTAINER_NAME}/${blobName}`;
    //                 console.log("File uploaded to Azure Blob Storage successfully:", fileUrl);
    //                 if (user.profilePic) {
    //                     const filenamesplit = user.profilePic[0].split('/');
    //                     console.log("filename split is ", filenamesplit);
    //                     const filename = filenamesplit[filenamesplit.length - 1];
    //                     console.log("filename is ", filename);
    //                     const filenameWithDirectory = `profile-pic-storage/${filename}`
    //                     console.log("filename with directory is ", filenameWithDirectory);
    //                     const blockBlobClient = containerClient.getBlockBlobClient(filenameWithDirectory);  
    //                     try {
    //                         const deleteResponse = await blockBlobClient.deleteIfExists();
    //                         // console.log(`Deleted old profile picture: ${oldFileName}`, deleteResponse);
    //                     } catch (error) {
    //                         console.error("Error deleting old profile picture:", error);
    //                     }
    //                 }
    //                 // push the file URL to the user profile
    //                 // let profilePic = user.profilePic || [];
    //                 // profilePic.push(fileUrl);
    //                 user.profilePic = [fileUrl];
    //                 await user.save();
    //                 // Respond with the file URL and other details
    //                 res.status(200).json({
    //                     message: 'File uploaded successfully',
    //                     fileName: imageFileName,
    //                     fileUrl: fileUrl,
    //                     mimetype: imageTobeUplaoded.mimetype
    //                 });
    //             } catch (error) {
    //                 console.error("Error in file upload:", error);
    //                 res.status(500).json({ message: 'Internal Server Error' });
    //             }
    //         });
    //         req.pipe(busboyHeader); // Pipe the request to busboy to parse the multipart/form-data
    //         return;
    //     }
    //     catch (error) {
    //         console.error("Error in uploadProfilePicture:", error);
    //         res.status(500).json({ message: 'Internal Server Error' });
    //         return;
    //     }
    // }
    // static async uploadProfilePicture(req: Request, res: Response) {
    //     try {
    //         const userId = (req as any).user.id;
    //         if (!userId) {
    //             res.status(400).json({ message: 'Invalid userId' });
    //             return;
    //         }
    //         const user = await User.findById(userId);
    //         if (!user) {
    //             res.status(400).json({ message: 'User not found' });
    //             return;
    //         }
    //         const busboyHeader = busboy({ headers: req.headers });
    //         const filesToUpload: { filePath: string; mimetype: string; fileName: string }[] = [];
    //         busboyHeader.on('file', (fieldname: string, file: NodeJS.ReadableStream, filename: string | { filename: string }, encoding: string, mimetype: string) => {
    //             const actualFileName = (filename && typeof filename === 'object' && filename.filename)
    //                 ? filename.filename
    //                 : String(filename);
    //             const uniqueFileName = `${Date.now()}-${actualFileName}`;
    //             const filePath = path.join(__dirname, '..', 'TempUploads', uniqueFileName);
    //             filesToUpload.push({
    //                 filePath,
    //                 mimetype,
    //                 fileName: uniqueFileName
    //             });
    //             console.log(` size of filesto upload is `, filesToUpload.length);
    //             file.pipe(fs.createWriteStream(filePath));
    //         });
    //         busboyHeader.on('finish', async () => {
    //             try {
    //                 if (filesToUpload.length === 0 || filesToUpload.length > 3) {
    //                     res.status(400).json({ message: 'No files uploaded' });
    //                     return;
    //                 }
    //                 console.log("Files to upload:", filesToUpload.length);
    //                 const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.CONTAINER_CONNECTION_STRING || '');
    //                 const containerClient = blobServiceClient.getContainerClient(process.env.CONTAINER_NAME || 'profile-pic-storage');
    //                 const uploadedFileUrls: string[] = [];
    //                 await Promise.all(filesToUpload.map(async ({ filePath, mimetype, fileName }) => {
    //                     const blobName = `${process.env.DIRECTORY}/${fileName}`;
    //                     const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    //                     await blockBlobClient.uploadFile(filePath, {
    //                         blobHTTPHeaders: {
    //                             blobContentType: mimetype || 'application/octet-stream'
    //                         }
    //                     });
    //                     fs.unlink(filePath, err => {
    //                         if (err) console.error(`Error deleting ${filePath}`, err);
    //                     });
    //                     const fileUrl = `https://${process.env.STORAGE_ACCOUNT}.blob.core.windows.net/${process.env.CONTAINER_NAME}/${blobName}`;
    //                     uploadedFileUrls.push(fileUrl);
    //                 }));
    //                 //before replacing the profilePic, the already present url should be deleted from azure blob storage
    //                 // if (user.profilePic && user.profilePic.length > 0) {
    //                 //     const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.CONTAINER_CONNECTION_STRING || '');
    //                 //     const containerClient = blobServiceClient.getContainerClient(process.env.CONTAINER_NAME || 'profile-pic-storage');
    //                 //     await Promise.all(user.profilePic.map(async (url: string) => {
    //                 //         const blobName = url.split('/').pop(); // Extract the blob name from the URL
    //                 //         if (blobName) {
    //                 //             const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    //                 //             await blockBlobClient.deleteIfExists();
    //                 //             console.log(`Deleted old profile picture: ${blobName}`);
    //                 //         }
    //                 //     }));
    //                 // }
    //                 // Update user's profile pictures
    //                 // user.profilePic = [...(user.profilePic || []), ...uploadedFileUrls];
    //                 console.log("uploadedFileUrls are ", uploadedFileUrls);
    //                 user.profilePic = uploadedFileUrls
    //                 // user.profilePic = uploadedFileUrls; // Replace with new files
    //                 // Ensure the profilePic array does not exceed 3 items
    //                 await user.save();
    //                 res.status(200).json({
    //                     message: 'Files uploaded successfully',
    //                     files: uploadedFileUrls
    //                 });
    //                 return;
    //             } catch (error) {
    //                 console.error("Error during file uploads:", error);
    //                 res.status(500).json({ message: 'Internal Server Error' });
    //                 return;
    //             }
    //         });
    //         req.pipe(busboyHeader);
    //     } catch (error) {
    //         console.error("Error in uploadProfilePicture:", error);
    //         res.status(500).json({ message: 'Internal Server Error' });
    //         return;
    //     }
    // }
    // this api only return trips if falls withing the radius
    // static async homepage(req: Request, res: Response) {
    //     try {
    //         // nearest location from user
    //         // filters will be location, gender, age, startdate, tripvibe
    //         const userId = (req as any).user.id;
    //         if (!userId) {
    //             res.status(400).json({ error: 'Invalid userid' });
    //             return;
    //         }
    //         const user = await User.findById(userId);
    //         console.log("user id is ", user?.id);
    //         // console.log(user?.location?.coordinates);
    //         if (!user) {
    //             res.status(400).json({ error: 'user not found' });
    //             return;
    //         }
    //         const { filteredTrip = {} } = req.body;
    //         const { loc, date, age, gender, tripVibes } = filteredTrip;
    //         // applying aggregation pipeline to fetch start date, end date, tripvibe, description, destination, from trip collection
    //         // and aboutMe , profilePic, name, gender, age, from user collection
    //         if (!user || !user.location || !user.location.coordinates) {
    //             res.status(400).json({ error: 'User location not found' });
    //             return;
    //         }
    //         console.log("user location is ", user.location.coordinates);
    //         const EARTH_RADIUS_IN_METERS = 6378100;
    //         const maxDistanceInMeters = 1000000;
    //         // Debug logging
    //         console.log("Searching for trips within", maxDistanceInMeters, "meters of coordinates:", user.location.coordinates);
    //         let matchStage: any = {};
    //         if (loc) {
    //             matchStage = {
    //                 "travellingFrom": loc
    //             };
    //         }
    //         else {
    //             matchStage = {
    //                 "creator.location": {
    //                     $geoWithin: {
    //                         $centerSphere: [user.location.coordinates, maxDistanceInMeters / EARTH_RADIUS_IN_METERS]
    //                     }
    //                 }
    //             };
    //         }
    //         // loc should match the travellingFrom in trip collection
    //         if (gender) {
    //             matchStage["creator.gender"] = gender;
    //         }
    //         if (age && age.min !== undefined && age.max !== undefined) {
    //             matchStage["creator.age"] = { $gte: age.min, $lte: age.max };
    //         }
    //         if (tripVibes && Array.isArray(tripVibes) && tripVibes.length > 0) {
    //             matchStage["tripVibe.name"] = { $in: tripVibes };
    //         }
    //         if (date) {
    //             matchStage["startDate"] = { $gte: new Date(date) }
    //         }
    //         const trips = await Trip.aggregate([
    //             {
    //                 $lookup: {
    //                     from: "userData",
    //                     localField: "creator",
    //                     foreignField: "_id",
    //                     as: "creator"
    //                 }
    //             },
    //             {
    //                 $unwind: {
    //                     path: "$creator",
    //                     preserveNullAndEmptyArrays: true
    //                 }
    //             },
    //             // {
    //             //     $match: {
    //             //         "creator.location": {
    //             //             $geoWithin: {
    //             //                 $centerSphere: [user.location.coordinates, maxDistanceInMeters / EARTH_RADIUS_IN_METERS]
    //             //             }
    //             //         }
    //             //     }
    //             // },
    //             {
    //                 $match: matchStage
    //             },
    //             {
    //                 $project: {
    //                     _id: 1,
    //                     startDate: 1,
    //                     endDate: 1,
    //                     destination: 1,
    //                     travellingFrom: 1,
    //                     description: 1,
    //                     tripVibe: 1,
    //                     "creator._id": 1,
    //                     "creator.name": 1,
    //                     "creator.profilePic": 1,
    //                     "creator.gender": 1,
    //                     "creator.age": 1,
    //                     "creator.aboutMe.personality": 1
    //                 }
    //             }
    //         ]);
    //         // Debug logging
    //         console.log("Found trips:", trips.length);
    //         if (trips.length > 0) {
    //             console.log("Sample trip creator:", trips[0].creator);
    //         }
    //         res.status(200).json(trips);
    //         return;
    //     }
    //     catch (error) {
    //         console.error("Aggregation Error:", error);
    //         res.status(500).json({ error: 'Internal server error' });
    //     }
    // }
    // static async homepage(req: Request, res: Response) {
    //     try {
    //         const userId = (req as any).user.id;
    //         if (!userId) {
    //              res.status(400).json({ error: 'Invalid userid' });
    //              return;
    //         }
    //         const user = await User.findById(userId);
    //         if (!user || !user.location?.coordinates) {
    //              res.status(400).json({ error: 'User location not found' });
    //              return
    //         }
    //         const { filteredTrip = {} } = req.body;
    //         const { loc, date, age, gender, tripVibes } = filteredTrip;
    //         const maxDistanceInMeters = 1000000;
    //         const userCoords = user.location.coordinates;
    //         const earthRadiusInMeters = 6378100;
    //         const radiusInRadians = maxDistanceInMeters / earthRadiusInMeters;
    //         // const baseMatch: any = {};
    //         const orFilter: any[] = [];
    //         // if (gender) baseMatch["creator.gender"] = gender;
    //         if(gender) orFilter.push({"creator.gender": gender});
    //         if (age?.min !== undefined && age?.max !== undefined) {
    //             // baseMatch["creator.age"] = { $gte: age.min, $lte: age.max };
    //             orFilter.push({ "creator.age": { $gte: age.min, $lte: age.max } });
    //         }
    //         if (tripVibes?.length) {
    //             // baseMatch["tripVibe.name"] = { $in: tripVibes };
    //             orFilter.push({ "tripVibe.name": { $in: tripVibes } });
    //         }
    //         // if (date) baseMatch["startDate"] = { $gte: new Date(date) };
    //         // if(date) orFilter.push({ "startDate": { $gte: new Date(date) } });
    //         const baseMatch = orFilter.length ? { $or : orFilter } : {};
    //         // === FIRST: GEO FILTERED SEARCH ===
    //         const geoMatch = loc
    //             ? { ...baseMatch, travellingFrom: loc }
    //             : {
    //                 ...baseMatch,
    //                 "creator.location": {
    //                     $geoWithin: {
    //                         $centerSphere: [userCoords, radiusInRadians],
    //                     },
    //                 },
    //             };
    //         const aggregationStages = (matchStage: any) => [
    //             {
    //                 $lookup: {
    //                     from: "userData",
    //                     localField: "creator",
    //                     foreignField: "_id",
    //                     as: "creator",
    //                 },
    //             },
    //             { $unwind: "$creator" },
    //             { $match: matchStage },
    //             {
    //                 $project: {
    //                     _id: 1,
    //                     startDate: 1,
    //                     endDate: 1,
    //                     destination: 1,
    //                     travellingFrom: 1,
    //                     description: 1,
    //                     tripVibe: 1,
    //                     "creator._id": 1,
    //                     "creator.name": 1,
    //                     "creator.profilePic": 1,
    //                     "creator.gender": 1,
    //                     "creator.age": 1,
    //                     "creator.aboutMe.personality": 1,
    //                     "creator.location": 1,
    //                 },
    //             },
    //         ];
    //         // Step 1: Nearby Trips
    //         let trips = await Trip.aggregate(aggregationStages(geoMatch));
    //         console.log("Trips found in nearby search:", trips.length);
    //         // now applying date filter on the trips
    //         // only return those trips whose startDate is greater than or equal to the date provided in the request body
    //         if (date) {
    //             const dateMatch = { startDate: { $gte: new Date(date) } };
    //             trips = await Trip.aggregate(aggregationStages({ ...geoMatch, ...dateMatch }));
    //             if (trips.length > 0) {
    //                  res.status(200).json(trips);
    //                  return
    //             }
    //         }
    //         if (trips.length > 0) {
    //              res.status(200).json(trips);
    //              return
    //         }
    //         console.log("n0t found");
    //         // === FALLBACK: ALL TRIPS SORTED BY DISTANCE ===
    //         const allTrips = await Trip.aggregate(aggregationStages(baseMatch));
    //         const sortedTrips = allTrips
    //             .filter(trip => trip.creator?.location?.coordinates)
    //             .map(trip => ({
    //                 ...trip,
    //                 distance: haversine(userCoords, trip.creator.location.coordinates),
    //             }))
    //             .sort((a, b) => a.distance - b.distance);
    //          res.status(200).json(sortedTrips);
    //          return
    //     } catch (error) {
    //         console.error("Homepage error:", error);
    //          res.status(500).json({ error: 'Internal server error' });
    //          return
    //     }
    // }
    // static async homepage(req: Request, res: Response) {
    //     try {
    //         const userId = (req as any).user.id;
    //         if (!userId) {
    //             res.status(400).json({ error: 'Invalid user ID' });
    //             return;
    //         }
    //         const user = await User.findById(userId);
    //         if (!user || !user.location?.coordinates) {
    //             res.status(400).json({ error: 'User location not found' });
    //             return;
    //         }
    //         const { filteredTrip = {} } = req.body;
    //         const { loc, date, age, gender, tripVibes } = filteredTrip;
    //         const maxDistanceInMeters = 1000000;
    //         const userCoords = user.location.coordinates;
    //         const earthRadiusInMeters = 6378100;
    //         const radiusInRadians = maxDistanceInMeters / earthRadiusInMeters;
    //         // Build $or filters
    //         const orFilters: any[] = [];
    //         if(!gender && !age && !tripVibes && !date && !loc) {
    //         }
    //         if (gender) {
    //             orFilters.push({ "creator.gender": gender });
    //         }
    //         if (age?.min !== undefined && age?.max !== undefined) {
    //             orFilters.push({ "creator.age": { $gte: age.min, $lte: age.max } });
    //         }
    //         if (tripVibes?.length) {
    //             orFilters.push({ "tripVibe.name": { $in: tripVibes } });
    //         }
    //         if (date) {
    //             orFilters.push({ startDate: { $gte: new Date(date) } });
    //         }
    //         if (loc) {
    //             orFilters.push({ destination: loc }); // exact destination match
    //         }
    //         const finalMatch = orFilters.length ? { $or: orFilters } : {};
    //         const geoMatch = !loc
    //             ? {
    //                 ...finalMatch,
    //                 creatorLocation: {
    //                     $geoWithin: {
    //                         $centerSphere: [userCoords, radiusInRadians],
    //                     },
    //                 },
    //             }
    //             : finalMatch;
    //         // Aggregation pipeline
    //         const aggregationStages = (matchStage: any) => [
    //             {
    //                 $lookup: {
    //                     from: "userData",
    //                     localField: "creator",
    //                     foreignField: "_id",
    //                     as: "creator",
    //                 },
    //             },
    //             { $unwind: "$creator" },
    //             { $match: matchStage },
    //             {
    //                 $project: {
    //                     _id: 1,
    //                     startDate: 1,
    //                     endDate: 1,
    //                     destination: 1,
    //                     travellingFrom: 1,
    //                     description: 1,
    //                     tripVibe: 1,
    //                     creatorLocation: 1,
    //                     "creator._id": 1,
    //                     "creator.name": 1,
    //                     "creator.profilePic": 1,
    //                     "creator.gender": 1,
    //                     "creator.age": 1,
    //                     "creator.aboutMe.personality": 1,
    //                     "creator.location": 1,
    //                 },
    //             },
    //         ];
    //         let trips = await Trip.aggregate(aggregationStages(geoMatch));
    //         console.log("Trips found (OR logic):", trips.length);
    //         // If still empty, fallback to all public trips sorted by distance
    //         if (trips.length === 0) {
    //             const allTrips = await Trip.aggregate(aggregationStages({}));
    //             trips = allTrips
    //                 .filter(trip => trip.creator?.location?.coordinates)
    //                 .map(trip => ({
    //                     ...trip,
    //                     distance: haversine(userCoords, trip.creator.location.coordinates),
    //                 }))
    //                 .sort((a, b) => a.distance - b.distance);
    //         }
    //         res.status(200).json(trips);
    //         return;
    //     } catch (error) {
    //         console.error("Homepage error:", error);
    //         res.status(500).json({ error: 'Internal server error' });
    //         return;
    //     }
    // }.
    static uploadProfilePicture(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                if (!userId) {
                    res.status(400).json({ message: "Invalid userId" });
                    return;
                }
                const user = yield user_model_1.default.findById(userId);
                if (!user) {
                    res.status(404).json({ message: "User not found" });
                    return;
                }
                const bb = (0, busboy_1.default)({ headers: req.headers });
                let imageFileName = "";
                let imageToUpload = {};
                bb.on("file", (_fieldname, file, filename, _encoding, fileMimeType) => {
                    const safeFilename = typeof filename === "string" ? filename : filename === null || filename === void 0 ? void 0 : filename.filename;
                    const extension = path_1.default.extname(safeFilename);
                    if (![".jpg", ".jpeg", ".png", ".heic"].includes(extension)) {
                        res.status(400).json({ message: "Invalid file type. Only .jpg, .jpeg, .png, and .heic are allowed." });
                        return;
                    }
                    const uniqueFileName = `${Date.now() / 1000}${extension}`;
                    imageFileName = uniqueFileName;
                    const filePath = path_1.default.join(__dirname, "..", "TempUploads", uniqueFileName);
                    imageToUpload = { filePath, mimetype: fileMimeType };
                    file.pipe(fs_1.default.createWriteStream(filePath));
                });
                bb.on("finish", () => __awaiter(this, void 0, void 0, function* () {
                    if (!imageFileName || !imageToUpload.filePath) {
                        res.status(400).json({ message: "No file uploaded" });
                        return;
                    }
                    const blobServiceClient = storage_blob_1.BlobServiceClient.fromConnectionString(CONTAINER_CONNECTION_STRING);
                    const containerClient = blobServiceClient.getContainerClient(CONTAINER_NAME);
                    const blobName = `${DIRECTORY}/${imageFileName}`;
                    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
                    yield blockBlobClient.uploadFile(imageToUpload.filePath, {
                        blobHTTPHeaders: {
                            blobContentType: imageToUpload.mimetype || "application/octet-stream"
                        }
                    });
                    const fileUrl = `https://${STORAGE_ACCOUNT}.blob.core.windows.net/${CONTAINER_NAME}/${blobName}`;
                    console.log("File uploaded successfully:", fileUrl);
                    const filename = fileUrl.split('/').pop();
                    console.log("filename is ", filename);
                    console.log(`complete name is ${DIRECTORY}/${filename}`);
                    // ✅ Delete old profile picture from blob storage if it exists
                    if (user.profilePic && user.profilePic.length > 0) {
                        try {
                            const oldUrl = user.profilePic[0];
                            const urlPrefix = `https://${STORAGE_ACCOUNT}.blob.core.windows.net/${CONTAINER_NAME}/`;
                            if (!oldUrl.startsWith(urlPrefix)) {
                                console.warn("Old profilePic URL does not match expected prefix, skipping delete");
                            }
                            else {
                                const oldBlobPath = oldUrl.substring(urlPrefix.length);
                                const oldBlobClient = containerClient.getBlockBlobClient(oldBlobPath);
                                console.log("Attempting to delete old blob:", oldBlobPath);
                                const deleteResult = yield oldBlobClient.deleteIfExists();
                                if (deleteResult.succeeded) {
                                    console.log("Old profile picture deleted successfully");
                                }
                                else {
                                    console.log("Old picture not found or already deleted");
                                }
                            }
                        }
                        catch (err) {
                            console.error("Error during old image deletion:", err);
                        }
                    }
                    // ✅ Update user document
                    user.profilePic = [fileUrl];
                    console.log("user profile pic is", user.profilePic);
                    yield user.save();
                    // ✅ Clean up local temp file
                    fs_1.default.unlink(imageToUpload.filePath, (err) => {
                        if (err)
                            console.error("Error deleting local file:", err);
                        else
                            console.log("Local temp file deleted");
                    });
                    res.status(200).json({
                        message: "File uploaded successfully",
                        fileName: imageFileName,
                        fileUrl: fileUrl,
                        mimetype: imageToUpload.mimetype
                    });
                }));
                req.pipe(bb);
            }
            catch (error) {
                console.error("Error in uploadProfilePicture:", error);
                res.status(500).json({ message: "Internal Server Error" });
            }
        });
    }
    static homepage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userId = req.user.id;
                if (!userId) {
                    res.status(400).json({ error: 'Invalid user ID' });
                    return;
                }
                const user = yield user_model_1.default.findById(userId);
                if (!user || !((_a = user.location) === null || _a === void 0 ? void 0 : _a.coordinates)) {
                    res.status(400).json({ error: 'User location not found' });
                    return;
                }
                // get all trips IDs user has swiped
                const swipedTrips = yield swipe_model_1.default.find({ swiper: userId }).distinct("target");
                const { filteredTrip = {} } = req.body;
                const { loc, date, age, gender, tripVibes } = filteredTrip;
                const maxDistanceInMeters = 1000000;
                const userCoords = user.location.coordinates;
                const earthRadiusInMeters = 6378100;
                const radiusInRadians = maxDistanceInMeters / earthRadiusInMeters;
                const orFilters = [];
                if (gender) {
                    orFilters.push({ "creator.gender": gender });
                }
                if ((age === null || age === void 0 ? void 0 : age.min) !== undefined && (age === null || age === void 0 ? void 0 : age.max) !== undefined) {
                    orFilters.push({ "creator.age": { $gte: age.min, $lte: age.max } });
                }
                if (tripVibes === null || tripVibes === void 0 ? void 0 : tripVibes.length) {
                    orFilters.push({ "tripVibe.name": { $in: tripVibes } });
                }
                if (date) {
                    orFilters.push({ startDate: { $gte: new Date(date) } });
                }
                if (loc) {
                    orFilters.push({ destination: loc });
                }
                const isFilterApplied = orFilters.length > 0;
                const excludeSwiped = { _id: { $nin: swipedTrips } };
                const matchStage = isFilterApplied
                    ? { $and: [{ $or: orFilters }, excludeSwiped] }
                    : {
                        $and: [{
                                creatorLocation: {
                                    $geoWithin: {
                                        $centerSphere: [userCoords, radiusInRadians],
                                    },
                                },
                            },
                            excludeSwiped]
                    };
                const aggregationStages = (matchStage) => [
                    {
                        $lookup: {
                            from: "userData",
                            localField: "creator",
                            foreignField: "_id",
                            as: "creator",
                        },
                    },
                    { $unwind: "$creator" },
                    { $match: matchStage },
                    {
                        $project: {
                            _id: 1,
                            startDate: 1,
                            endDate: 1,
                            destination: 1,
                            travellingFrom: 1,
                            description: 1,
                            tripVibe: 1,
                            creatorLocation: 1,
                            "creator._id": 1,
                            "creator.name": 1,
                            "creator.profilePic": 1,
                            "creator.gender": 1,
                            "creator.age": 1,
                            "creator.aboutMe.personality": 1,
                            "creator.location": 1,
                        },
                    },
                ];
                const trips = yield trip_model_1.default.aggregate(aggregationStages(matchStage));
                console.log("Trips found:", trips.length);
                if (trips.length === 0) {
                    res.status(200).json({
                        message: isFilterApplied
                            ? "No trips match your filters"
                            : "No nearby trips found",
                        data: [],
                    });
                    return;
                }
                res.status(200).json(trips);
                return;
            }
            catch (error) {
                console.error("Homepage error:", error);
                res.status(500).json({ error: 'Internal server error' });
                return;
            }
        });
    }
    static createTrip(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // when applying authentication remove creator rather fetch from db
                const userId = req.user.id;
                if (!userId) {
                    res.status(400).json({ error: 'Invalid userid' });
                    return;
                }
                const user = yield user_model_1.default.findById(userId);
                if (!user) {
                    res.status(400).json({ error: 'User not found' });
                    return;
                }
                const { destination, travellingFrom, startDate, endDate, description, budget, tripType, visibility, tripVibe, } = req.body;
                if (!destination || !travellingFrom || !startDate || !endDate || !description || !budget || !tripType || !visibility) {
                    res.send('Please fill all the fields');
                    return;
                }
                console.log("user object id is ", user._id);
                const newTrip = new trip_model_1.default({
                    destination, travellingFrom, startDate, endDate, description, budget, tripType, visibility, tripVibe, creator: user._id, participants: [user._id], creatorLocation: user.location,
                });
                console.log("new trip is ", newTrip);
                yield newTrip.save();
                // and save the trip id in the user's tripIds array
                if (!user.tripIds) {
                    user.tripIds = [];
                }
                user.tripIds.push(newTrip._id);
                yield user.save();
                res.status(201).json({ 'message': 'Trip created successfully' });
                return;
            }
            catch (error) {
                res.status(500).json({ 'message': 'Error occurred while creating trip' });
                console.log("error is", error);
                return;
            }
        });
    }
    static updateUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, profilePic, designation, bio, age, gender, personality, travelPreference, lifestyleChoice, physicalInfo, hobbiesInterest, funIcebreakerTag, location, languageSpoken, budget, travelStyle, isProfileCompleted } = req.body;
                const userId = req.user.id;
                if (!userId) {
                    res.status(400).json({ error: 'Invalid userid' });
                    return;
                }
                const user = yield user_model_1.default.findById(userId);
                if (!user) {
                    res.status(400).json({ error: 'User not found' });
                    return;
                }
                const updateData = {};
                if (name !== undefined && name !== "")
                    updateData.name = name;
                if (profilePic !== undefined && profilePic !== "")
                    updateData.profilePic = profilePic;
                if (designation !== undefined && designation !== "")
                    updateData.designation = designation;
                if (bio !== undefined && bio !== "")
                    updateData.bio = bio;
                if (age !== undefined && age !== "")
                    updateData.age = age;
                if (gender !== undefined && gender !== "")
                    updateData.gender = gender;
                updateData.profileCompleted = isProfileCompleted !== undefined ? isProfileCompleted : user.profileCompleted;
                if ((location === null || location === void 0 ? void 0 : location.type) === "Point" && Array.isArray(location === null || location === void 0 ? void 0 : location.coordinates) && (location === null || location === void 0 ? void 0 : location.coordinates.length) === 2) {
                    updateData.location = {
                        type: "Point",
                        coordinates: location.coordinates
                    };
                    // also update address(street, city, state, country, zipCode) from longitude and latitude
                    // before that convert coordinates to address using some geocoding service
                    // For example, you can use Google Maps Geocoding API or OpenStreetMap Nominatim API
                }
                if (Array.isArray(languageSpoken) && languageSpoken.length > 0) {
                    updateData.languageSpoken = languageSpoken;
                }
                if (budget !== undefined && budget !== "")
                    updateData.budget = budget;
                if (travelStyle !== undefined && travelStyle !== "")
                    updateData.travelStyle = travelStyle;
                // aboutMe nested structure — only set if arrays are non-empty
                if (Array.isArray(personality) && personality.length > 0) {
                    updateData["aboutMe.personality"] = personality;
                }
                if (Array.isArray(travelPreference) && travelPreference.length > 0) {
                    updateData["aboutMe.travelPreference"] = travelPreference;
                }
                if (Array.isArray(lifestyleChoice) && lifestyleChoice.length > 0) {
                    updateData["aboutMe.lifestyleChoice"] = lifestyleChoice;
                }
                if (Array.isArray(physicalInfo) && physicalInfo.length > 0) {
                    updateData["aboutMe.physicalInfo"] = physicalInfo;
                }
                if (Array.isArray(hobbiesInterest) && hobbiesInterest.length > 0) {
                    updateData["aboutMe.hobbiesInterest"] = hobbiesInterest;
                }
                if (Array.isArray(funIcebreakerTag) && funIcebreakerTag.length > 0) {
                    updateData["aboutMe.funIcebreakerTag"] = funIcebreakerTag;
                }
                if (Object.keys(updateData).length === 0) {
                    res.status(400).send("No valid fields to update.");
                    return;
                }
                const updatedUser = yield user_model_1.default.findByIdAndUpdate(userId, updateData, {
                    new: true,
                });
                if (!updatedUser) {
                    res.status(404).send("User not found");
                    return;
                }
                res.status(200).json({ message: "User updated successfully", user: updatedUser });
                return;
            }
            catch (error) {
                res.send('Error');
                return;
            }
        });
    }
    static getProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.user.id;
                if (!userId) {
                    res.status(400).json({ message: 'Invalid userid' });
                    return;
                }
                console.log(userId);
                const user = yield user_model_1.default.findById(userId);
                if (!user) {
                    res.status(404).json({ message: 'user not found' });
                    return;
                }
                const sanitizedUser = user.toObject();
                delete sanitizedUser.password;
                // also fetch all the trips created by the user
                const trips = yield trip_model_1.default.find({ creator: userId }).select({
                    destination: 1,
                    travellingFrom: 1,
                    startDate: 1,
                    endDate: 1,
                    description: 1,
                    // tripVibe: 1,
                });
                res.status(200).json({ message: sanitizedUser, trips: trips });
                return;
            }
            catch (error) {
                res.status(500).json({ message: 'Internal Server Error' });
                return;
            }
        });
    }
    static createProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { name, bio, age, gender, personality, lifestyleChoice, physicalInfo, profilePic, location, languageSpoken, Designation, isProfileCompleted } = req.body;
                const userId = req.user.id;
                if (!userId) {
                    res.status(400).json({ message: 'Invalid userId' });
                    return;
                }
                const user = yield user_model_1.default.findById(userId);
                // console.log("user is ", user);
                if (!user) {
                    res.status(404).json({ message: 'user not found' });
                    return;
                }
                user.name = name || user.name;
                user.bio = bio || user.bio;
                user.age = age || user.age;
                user.gender = gender || user.gender;
                user.designation = Designation || user.designation;
                user.profileCompleted = isProfileCompleted;
                // Initialize aboutMe if it doesn't exist
                if (!user.aboutMe) {
                    user.aboutMe = {
                        personality: [],
                        travelPreference: [],
                        lifestyleChoice: [],
                        physicalInfo: [],
                        hobbiesInterest: [],
                        funIcebreakerTag: []
                    };
                }
                user.aboutMe.personality = personality || user.aboutMe.personality;
                // user.aboutMe.travelPreference = travelPreference || user.aboutMe.travelPreference;
                user.aboutMe.lifestyleChoice = lifestyleChoice || user.aboutMe.lifestyleChoice;
                user.aboutMe.physicalInfo = physicalInfo || user.aboutMe.physicalInfo;
                // user.aboutMe.hobbiesInterest = hobbiesInterest || user.aboutMe.hobbiesInterest;
                // user.aboutMe.funIcebreakerTag = funIcebreakerTag || user.aboutMe.funIcebreakerTag;
                // user.profilePic = Array.isArray(profilePic) || user.profilePic;
                if (profilePic) {
                    user.profilePic = Array.isArray(profilePic) ? [profilePic[0]] : [profilePic];
                }
                user.location = location || user.location;
                user.languageSpoken = languageSpoken || user.languageSpoken;
                // user.budget = budget || user.budget;
                // user.travelStyle = travelStyle || user.travelStyle;
                console.log("user is ", user);
                yield user.save();
                console.log("hello ");
                res.status(200).json({ messsage: "user updated successfully" });
                return;
            }
            catch (error) {
                console.error("Error in createProfile:", error);
                res.status(500).json({ message: 'Internal Server Error' });
                return;
            }
        });
    }
    static bulkswiped(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const idsArray = req.body.data;
                const userId = req.user.id;
                if (!userId) {
                    res.status(400).json({ message: 'Invalid userId' });
                    return;
                }
                const user = yield user_model_1.default.findById(userId);
                // console.log("user is ", user);
                console.log("ids array are", idsArray);
                if (!user) {
                    res.status(400).json({ message: 'Invalid userId' });
                    return;
                }
                if (!Array.isArray(idsArray) || idsArray.length === 0) {
                    res.status(400).json({ message: "Invalid input format" });
                }
                const formatted = idsArray.map((s) => ({
                    swiper: s.swiper,
                    target: s.target,
                    direction: s.direction,
                    creator: user._id,
                    createdAt: s.createdAt || new Date()
                }));
                const result = yield swipe_model_1.default.insertMany(formatted, { ordered: false });
                res.status(201).json({ message: "Batch swipe saved", saved: result.length });
                return;
            }
            catch (error) {
                res.status(500).json({ message: "Failed to save Batch swipes" });
                return;
            }
        });
    }
    // static async lastSwipe(req: Request, res: Response) {
    //     try{
    //         const userId = (req as any).user.id;
    //         if(!userId){
    //             res.status(400).json({message:'Invalid userId'});
    //             return;
    //         }
    //         // fetching last swipe from swipe collection and then deleting that last swipe when swipe back is used
    //         const lastswipe = await Swipe.findOne({swiper:userId})
    //             .sort({createdAt: -1})
    //             .populate("target");
    //         if(!lastswipe){
    //             res.status(400).json({message:'No last swipe found'});
    //             return;
    //         }
    //         if(lastswipe){
    //             await Swipe.deleteOne({_id: lastswipe._id});
    //         }
    //         // just like homepage api we need to return data
    //         // popolate target with trip collection and creator with user collection
    //         res.status(200).json({message: lastswipe});
    //         return;
    //     }
    //     catch(error){
    //         res.status(500).json({message: 'Internal Server Error'});
    //         return;
    //     }
    // }
    // fetch a user(his homepage trip) based on objectid
    static lastSwipe(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.user.id;
                if (!userId) {
                    res.status(400).json({ message: 'Invalid userId' });
                    return;
                }
                // Fetch the last swipe whose approved do not exist or approved is false and populate the target (Trip) and creator (User)
                const lastswipe = yield swipe_model_1.default.findOne({
                    swiper: userId,
                    $or: [
                        { accepted: { $exists: false } }, // No accepted field
                        { accepted: false } // accepted is false
                    ]
                })
                    .sort({ createdAt: 1 })
                    .populate({
                    path: 'target', // Populate the target (which is a Trip)
                    populate: {
                        path: 'creator', // Populate the creator of the trip (User)
                        select: 'name profilePic gender age aboutMe' // Select the fields you need from User
                    }
                });
                if (!lastswipe) {
                    res.status(400).json({ message: 'No last swipe found' });
                    return;
                }
                // Optionally, delete the swipe if you're handling swipe-back behavior
                yield swipe_model_1.default.deleteOne({ _id: lastswipe._id });
                // Create the response in the same format as homepage API
                const response = {
                    _id: lastswipe._id,
                    swiper: lastswipe.swiper,
                    target: lastswipe.target, // The populated target (Trip) with the creator's data
                    direction: lastswipe.direction,
                    createdAt: lastswipe.createdAt,
                    __v: lastswipe.__v
                };
                // Return the response with the populated trip and creator
                res.status(200).json({ message: response });
                return;
            }
            catch (error) {
                console.error("Error in lastSwipe:", error);
                res.status(500).json({ message: 'Internal Server Error' });
                return;
            }
        });
    }
    static fetchTrip(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tripId = req.body.id;
                if (!tripId) {
                    console.log("No userid found");
                    res.status(400).json({ message: 'Invalid userId' });
                    return;
                }
                const homepageUserdata = yield trip_model_1.default.aggregate([
                    {
                        $match: {
                            _id: new mongoose_1.default.Types.ObjectId(tripId) // Ensure tripId is casted properly
                        }
                    },
                    {
                        $lookup: {
                            from: 'users', // Correct collection name for users
                            localField: 'creator',
                            foreignField: '_id',
                            as: 'creator'
                        }
                    },
                    {
                        $unwind: {
                            path: '$creator',
                            preserveNullAndEmptyArrays: true
                        }
                    },
                    {
                        $project: {
                            _id: 1,
                            startDate: 1,
                            endDate: 1,
                            destination: 1,
                            travellingFrom: 1,
                            description: 1,
                            tripVibe: 1,
                            'creator._id': 1,
                            'creator.name': 1,
                            'creator.profilePic': 1,
                            'creator.gender': 1,
                            'creator.age': 1,
                            'creator.aboutMe.personality': 1
                        }
                    }
                ]);
                console.log("homepage user data is ", homepageUserdata);
                res.status(200).json(homepageUserdata);
                return;
            }
            catch (error) {
                res.status(500).json({ message: 'Internal Server Error' });
                return;
            }
        });
    }
    // now this api will fetch all those trip(homepage like) which this user has swiped and creator has approved
    static fetchApprovedTrip(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.user.id;
                if (!userId) {
                    res.status(400).json({ message: 'Invalid userId' });
                    return;
                }
                // fetching all the swipes of this user whose approved is true
                const swipes = yield swipe_model_1.default.find({ swiper: userId, accepted: true })
                    .populate({
                    path: 'target', // Populate the target (which is a Trip)
                    populate: {
                        path: 'creator', // Populate the creator of the trip (User)
                        select: 'name profilePic gender age aboutMe' // Select the fields you need from User
                    }
                })
                    .sort({ createdAt: -1 }); // Sort by createdAt in descending order
                console.log("swipes are ", swipes);
                if (!swipes || swipes.length === 0) {
                    res.status(400).json({ message: 'No swipes found' });
                    return;
                }
                const response = swipes.map((swipe) => ({
                    _id: swipe._id,
                    swiper: swipe.swiper,
                    target: swipe.target, // The populated target (Trip) with the creator's data
                }));
                res.status(200).json({ response });
                return;
            }
            catch (error) {
                res.status(500).json({ message: 'Internal Server Error' });
                return;
            }
        });
    }
    // this api --> the user's trip which others have swiped will be shown here so that user can approve or reject
    static fetchTripForApproval(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.user.id;
                if (!userId) {
                    res.status(400).json({ message: 'Invalid userId' });
                    return;
                }
                // console.log("user id is ", userId);
                // now search with user._id in swipe collection and should not include approved false and then populate target with trip collection and swiper with user collection
                const swipes = yield swipe_model_1.default.find({ creator: userId, direction: "right", accepted: { $exists: false }, })
                    .populate({
                    path: 'target', // Populate the target (which is a Trip)
                    // populate: {
                    //     path: 'creator', // Populate the swiper of the trip (User)
                    //     select: 'name profilePic gender age aboutMe' // Select the fields you need from User
                    // }
                })
                    .populate({
                    path: 'swiper', // Populate the swiper (User)
                    select: 'name profilePic gender age aboutMe' // Select the fields you need from User
                })
                    .sort({ createdAt: -1 }); // Sort by createdAt in descending order
                console.log("swipes are ", swipes);
                if (!swipes || swipes.length === 0) {
                    res.status(400).json({ message: 'No swipes found' });
                    return;
                }
                const response = swipes.map((swipe) => ({
                    _id: swipe._id,
                    swiper: swipe.swiper,
                    target: swipe.target, // The populated target (Trip) with the creator's data
                }));
                res.status(200).json({ message: response });
                return;
            }
            catch (error) {
                console.error("Error in fetchTripForApproval:", error);
                res.status(500).json({ message: 'Internal Server Error' });
                return;
            }
        });
    }
    static approveTrip(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // api to approve trip and also store that swiper from swipe to trip participants
            try {
                const tripObjectId = req.body.tripObjectId; //it is actually swipe object id
                const approval = req.body.approval;
                const userId = req.user.id;
                if (!userId) {
                    res.status(400).json({ message: 'Invalid userId' });
                    return;
                }
                if (!tripObjectId || typeof approval !== 'boolean') {
                    res.status(400).json({ message: 'Invalid tripObjectId or approval' });
                    return;
                }
                console.log("trip object id is , approval is ", tripObjectId, approval);
                // update swipe collection with accepted true and fetch swiper id and then update trip collection with participants
                const swipe = yield swipe_model_1.default.findByIdAndUpdate(tripObjectId, { accepted: approval }, { new: true });
                console.log("swipe is ", swipe);
                if (!swipe) {
                    res.status(400).json({ message: 'Swipe not found' });
                    return;
                }
                const tripId = swipe.target;
                const swiperId = swipe.swiper;
                // also if approval is true then create a chat between swiper and trip creator but only if chat does not already exist
                if (approval) {
                    console.log("it is true");
                    const existingChat = yield chat_model_1.default.findOne({
                        participants: { $all: [userId, swiperId] }
                    });
                    console.log("existing chat is ", existingChat);
                    if (!existingChat) {
                        console.log("creating new chat");
                        const newChat = new chat_model_1.default({
                            participants: [userId, swiperId],
                            trip: tripId,
                            messages: []
                        });
                        yield newChat.save();
                    }
                }
                console.log("trip is approved with chat");
                // update trip collection with participants
                const trip = yield trip_model_1.default.findByIdAndUpdate(tripId, { $addToSet: { participants: swiperId } }, { new: true });
                if (!trip) {
                    res.status(400).json({ message: 'Trip not found' });
                    return;
                }
                res.status(200).json({ message: 'Trip approved successfully' });
                return;
            }
            catch (error) {
                console.error("Error in approveTrip:", error);
                res.status(500).json({ message: 'Internal Server Error' });
                return;
            }
        });
    }
    static fetchChatPage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.user.id;
                if (!userId) {
                    res.status(400).json({ message: 'Invalid userId' });
                    return;
                }
                // Fetch all chats where the user is a participant need to give names of both participants from User collection also return the roomid
                const chats = yield chat_model_1.default.find({ participants: userId })
                    .populate({
                    path: 'participants',
                    select: 'name'
                });
                console.log("chats are ", chats);
                res.status(200).json({ message: chats, userId: userId });
                return;
            }
            catch (error) {
                console.error("Error in fetchChatPage:", error);
                res.status(500).json({ message: 'Internal Server Error' });
                return;
            }
        });
    }
}
exports.default = UserController;
