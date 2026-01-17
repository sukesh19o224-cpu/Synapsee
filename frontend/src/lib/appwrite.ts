import { Client, Account, Databases, Storage, Functions } from 'appwrite';

// Initialize Appwrite client
const client = new Client();

client
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'http://localhost/v1')
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || 'synapse');

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
