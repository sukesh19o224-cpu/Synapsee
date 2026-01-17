import { Client, Account, Databases, Storage, Functions } from 'appwrite';

// Initialize Appwrite client
const client = new Client();

// Use environment variables or fallback to hardcoded values
const APPWRITE_ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://fra.cloud.appwrite.io/v1';
const APPWRITE_PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '696ae54700106da1b1c3';

client
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(APPWRITE_PROJECT_ID);

// Export services
export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const functions = new Functions(client);

// Database and collection IDs
export const DATABASE_ID = 'synapse-db';
export const COLLECTIONS = {
  PROJECTS: 'projects',
  EXPERIMENTS: 'experiments',
  DATA_FILES: 'data_files',
  ANALYSES: 'analyses',
  DOCUMENTS: 'documents',
};

// Storage bucket IDs
export const BUCKETS = {
  DATA_FILES: 'data-files',
  PLOTS: 'plots',
  DOCUMENTS: 'documents',
};

export default client;
