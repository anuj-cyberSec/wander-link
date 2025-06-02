const dotenv = require('dotenv');
dotenv.config();

const busboy = require('busboy');
const path = require('path');
const fs = require('fs');

// azure container name:
const STORAGE_ACCOUNT = process.env.STORAGE_ACCOUNT
const CONTAINER_KEY = process.env.CONTAINER_KEY
const CONTAINER_CONNECTION_STRING = process.env.CONTAINER_CONNECTION_STRING
const CONTAINER_NAME = process.env.CONTAINER_NAME
const profilePicContainerName = "profile-pic-storage"


// Azure Blob Storage configuration
const { BlobServiceClient } = require('@azure/storage-blob');
const blobServiceClient = BlobServiceClient.fromConnectionString(CONTAINER_CONNECTION_STRING);
const containerClient = blobServiceClient.getContainerClient(profilePicContainerName);
const { v4: uuidv4 } = require('uuid');

// checking if setup is correct
const checkContainerSetup = async () => {
    try {
        const exists = await containerClient.exists();
        if (!exists) {
            await containerClient.create();
            console.log(`Container ${profilePicContainerName} created successfully.`);
        } else {
            console.log(`Container ${profilePicContainerName} already exists.`);
        }
    } catch (error) {
        console.error('Error checking or creating container:', error);
    }
};

// Function to upload a file to Azure Blob Storage
// using busboy to handle multipart/form-data

