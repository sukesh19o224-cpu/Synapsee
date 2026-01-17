# Appwrite Setup for Synapse

You need to create these in your Appwrite Cloud console:

## 1. Database

Go to **Databases** → **Create Database**

- Database ID: `synapse-db`
- Name: `Synapse Database`

## 2. Collections (inside synapse-db)

### Collection: projects

- ID: `projects`
- Attributes:
  - `name` (string, required, 255)
  - `description` (string, 5000)
  - `ownerId` (string, required, 36)
  - `createdAt` (datetime, required)

### Collection: experiments

- ID: `experiments`
- Attributes:
  - `title` (string, required, 255)
  - `description` (string, 5000)
  - `projectId` (string, required, 36)
  - `type` (string, required, 50) - cv, eis, chronoamperometry, gitt
  - `status` (string, 50) - draft, in-progress, completed
  - `sample` (string, 255)
  - `electrolyte` (string, 255)
  - `electrode` (string, 255)
  - `temperature` (float)
  - `notes` (string, 10000)
  - `createdAt` (datetime, required)
  - `ownerId` (string, required, 36)

### Collection: analyses

- ID: `analyses`
- Attributes:
  - `experimentId` (string, required, 36)
  - `type` (string, required, 50)
  - `results` (string, 50000) - JSON string
  - `createdAt` (datetime, required)

## 3. Storage Buckets

Go to **Storage** → **Create Bucket**

### Bucket: data-files

- ID: `data-files`
- Name: `Data Files`
- Max file size: 50MB
- Allowed extensions: csv, txt, mpt, dta, xlsx, xls

### Bucket: plots

- ID: `plots`
- Name: `Analysis Plots`
- Max file size: 10MB
- Allowed extensions: png, jpg, svg, pdf

## 4. Permissions

For each collection and bucket, set:

- Users: Create, Read, Update, Delete (for their own documents)
