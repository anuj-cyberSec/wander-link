import { BlobServiceClient } from "@azure/storage-blob";
require("dotenv").config();

const CONTAINER_CONNECTION_STRING = process.env.CONTAINER_CONNECTION_STRING || "";
const CONTAINER_NAME = process.env.CONTAINER_NAME || "";
console.log("contaienr name is ", CONTAINER_NAME);

const blobServiceClient = BlobServiceClient.fromConnectionString(CONTAINER_CONNECTION_STRING);
const containerClient = blobServiceClient.getContainerClient(CONTAINER_NAME);

async function deleteOldProfilePic(blobName: string) {
  try {
    console.log("Deleting old profile picture:", blobName);
    console.log("blob name in bytes ", [...blobName])
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    const deleteResponse = await blockBlobClient.deleteIfExists();
    if (deleteResponse.succeeded) {
      console.log("Old profile picture deleted successfully");
    } else {
      console.log("Old profile picture not found or already deleted");
    }
  } catch (err) {
    console.error("Error deleting old profile picture:", err);
  }
}

// Usage example
// deleteOldProfilePic("profile-pic-storage/1749364949554.jpg");
export default deleteOldProfilePic;