import { Client, Databases, Storage, ID } from "appwrite";

const client = new Client()
    .setEndpoint(import.meta.env.VITE_APPWRITE_URL)
    .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

const databases = new Databases(client);
const storage = new Storage(client);

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;
const BUCKET_ID = import.meta.env.VITE_APPWRITE_BUCKET_ID;

const appwriteService = {
    createPost: async (postData) => {
        try {
            return await databases.createDocument(
                DATABASE_ID,
                COLLECTION_ID,
                ID.unique(),
                postData
            );
        } catch (error) {
            console.error("Create Post Error:", error);
            return null;
        }
    },

    updatePost: async (postId, postData) => {
        try {
            return await databases.updateDocument(
                DATABASE_ID,
                COLLECTION_ID,
                postId,
                postData
            );
        } catch (error) {
            console.error("Update Post Error:", error);
            return null;
        }
    },

    deletePost: async (postId) => {
        try {
            return await databases.deleteDocument(DATABASE_ID, COLLECTION_ID, postId);
        } catch (error) {
            console.error("Delete Post Error:", error);
            return null;
        }
    },

    getPosts: async () => {
        try {
            return await databases.listDocuments(DATABASE_ID, COLLECTION_ID);
        } catch (error) {
            console.error("Get Posts Error:", error);
            return null;
        }
    },

    getPostById: async (postId) => {
        try {
            return await databases.getDocument(DATABASE_ID, COLLECTION_ID, postId);
        } catch (error) {
            console.error("Get Post By ID Error:", error);
            return null;
        }
    },

    uploadFile: async (file) => {
        try {
            return await storage.createFile(BUCKET_ID, ID.unique(), file);
        } catch (error) {
            console.error("Upload File Error:", error);
            return null;
        }
    },

    deleteFile: async (fileId) => {
        try {
            return await storage.deleteFile(BUCKET_ID, fileId);
        } catch (error) {
            console.error("Delete File Error:", error);
        }
    },

    // ✅ CHANGED: Use getFileView() instead of getFilePreview()
    getFilePreview: (fileId) => {
        return storage.getFileView(BUCKET_ID, fileId); // more reliable
    }
};

export default appwriteService;





