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
const dotenv = require('dotenv');
dotenv.config();
const busboy = require('busboy');
const path = require('path');
const fs = require('fs');
// azure container name:
const STORAGE_ACCOUNT = process.env.STORAGE_ACCOUNT;
const CONTAINER_KEY = process.env.CONTAINER_KEY;
const CONTAINER_CONNECTION_STRING = process.env.CONTAINER_CONNECTION_STRING;
const CONTAINER_NAME = process.env.CONTAINER_NAME;
const profilePicContainerName = "profile-pic-storage";
// Azure Blob Storage configuration
const { BlobServiceClient } = require('@azure/storage-blob');
const blobServiceClient = BlobServiceClient.fromConnectionString(CONTAINER_CONNECTION_STRING);
const containerClient = blobServiceClient.getContainerClient(profilePicContainerName);
const { v4: uuidv4 } = require('uuid');
// checking if setup is correct
const checkContainerSetup = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const exists = yield containerClient.exists();
        if (!exists) {
            yield containerClient.create();
            console.log(`Container ${profilePicContainerName} created successfully.`);
        }
        else {
            console.log(`Container ${profilePicContainerName} already exists.`);
        }
    }
    catch (error) {
        console.error('Error checking or creating container:', error);
    }
});
// Function to upload a file to Azure Blob Storage
// using busboy to handle multipart/form-data
