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
Object.defineProperty(exports, "__esModule", { value: true });
const storage_blob_1 = require("@azure/storage-blob");
require("dotenv").config();
const CONTAINER_CONNECTION_STRING = process.env.CONTAINER_CONNECTION_STRING || "";
const CONTAINER_NAME = process.env.CONTAINER_NAME || "";
console.log("contaienr name is ", CONTAINER_NAME);
const blobServiceClient = storage_blob_1.BlobServiceClient.fromConnectionString(CONTAINER_CONNECTION_STRING);
const containerClient = blobServiceClient.getContainerClient(CONTAINER_NAME);
function deleteOldProfilePic(blobName) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log("Deleting old profile picture:", blobName);
            console.log("blob name in bytes ", [...blobName]);
            const blockBlobClient = containerClient.getBlockBlobClient(blobName);
            const deleteResponse = yield blockBlobClient.deleteIfExists();
            if (deleteResponse.succeeded) {
                console.log("Old profile picture deleted successfully");
            }
            else {
                console.log("Old profile picture not found or already deleted");
            }
        }
        catch (err) {
            console.error("Error deleting old profile picture:", err);
        }
    });
}
// Usage example
// deleteOldProfilePic("profile-pic-storage/1749364949554.jpg");
exports.default = deleteOldProfilePic;
