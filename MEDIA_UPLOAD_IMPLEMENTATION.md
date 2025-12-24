# Media Upload Implementation

## Overview
This document describes the implementation of the media upload feature for deals, which allows users to upload files organized by media type after creating a deal.

## Changes Made

### 1. Media Types Filter Integration

#### `lib/filters.ts`
- Added `getMediaTypes()` function to fetch media types from `/api/filters/media-types`

#### `lib/useFilters.ts`
- Added `mediaTypes` to the `UseFiltersReturn` interface
- Updated the hook to fetch and return media types along with other filters

### 2. Media Upload API

#### `lib/deals.ts`
- Added `uploadMedia()` function to upload files to `/api/media/deal/{dealId}`
- Uses FormData to send file and mediaTypeId
- Handles authentication via Bearer token

### 3. Media Upload Component

#### `components/DealMediaUpload.tsx`
- New component for uploading media files
- Features:
  - Tabs for each media type (dynamically generated from API)
  - Drag & drop file upload
  - File browser for selecting files
  - Individual file upload or batch upload
  - Upload status tracking (pending, uploading, success, error)
  - File size display
  - Retry failed uploads
  - Remove files before upload

### 4. Media Upload Page Route

#### `app/deals/[id]/media/page.tsx`
- New page route at `/deals/{dealId}/media`
- Renders the `DealMediaUpload` component
- Includes authentication check
- Provides navigation back to deals list

### 5. Deal Creation Flow Update

#### `lib/hooks/useDealSubmission.ts`
- Modified `onSave` callback to accept optional `createdDealId` parameter
- Returns the created deal ID from the API response
- Passes the ID to the callback for navigation

#### `components/DealForm.tsx`
- Updated `DealFormProps` interface to accept `createdDealId` in `onSave` callback

#### `app/deals/new/page.tsx`
- Updated `handleSave` to navigate to media upload page after deal creation
- Route: `/deals/{createdDealId}/media`

## User Flow

1. User creates a new deal via the deal form
2. After successful creation, user is automatically redirected to `/deals/{dealId}/media`
3. User sees tabs for each media type (e.g., "Contract", "Invoice", "Photos", etc.)
4. User can:
   - Click on a tab to select the media type
   - Drag & drop files or click "Browse Files"
   - See all selected files with their status
   - Upload files individually or all at once
   - Retry failed uploads
   - Remove files before uploading
5. After uploading all necessary files, user can click "Back to Deals" to return to the deals list

## API Endpoints Used

1. **GET** `/api/filters/media-types` - Fetch available media types
2. **POST** `/api/media/deal/{dealId}` - Upload a media file
   - Request body: `multipart/form-data`
   - Fields:
     - `file`: The file to upload
     - `mediaTypeId`: The ID of the media type (from filters)

## Technical Details

### File Upload
- Uses native `FormData` API for multipart uploads
- Supports multiple file selection
- File size is displayed in human-readable format
- Upload progress is tracked per file

### State Management
- Files are organized by media type ID
- Each file has a status: pending, uploading, success, or error
- Error messages are displayed for failed uploads

### UI/UX
- Drag & drop zone with visual feedback
- Tab-based organization by media type
- Badge showing file count per media type
- Status icons for each file (pending, uploading, success, error)
- Individual and batch upload options
- Responsive design using Tailwind CSS

## Future Enhancements

Potential improvements for future iterations:

1. **File Preview** - Show thumbnails for images and PDFs
2. **Download Files** - Allow users to download previously uploaded files
3. **Delete Files** - Allow users to delete uploaded files
4. **File List View** - Show all uploaded files for a deal
5. **Upload Progress Bar** - Show percentage progress for large files
6. **File Type Validation** - Restrict uploads to specific file types per media type
7. **File Size Limits** - Enforce maximum file size limits
8. **Bulk Delete** - Delete multiple files at once
9. **Media Gallery** - View all media in a gallery format
10. **Edit Mode** - Allow editing media from the deal edit page

## Testing Checklist

- [ ] Media types are fetched correctly from the API
- [ ] Tabs are generated dynamically based on media types
- [ ] File selection via browse button works
- [ ] Drag & drop file upload works
- [ ] Multiple files can be selected at once
- [ ] Individual file upload works
- [ ] Batch upload works
- [ ] Upload success is indicated correctly
- [ ] Upload errors are handled and displayed
- [ ] Retry failed uploads works
- [ ] Remove file before upload works
- [ ] Navigation after deal creation works
- [ ] Back button returns to deals list
- [ ] Authentication is required
- [ ] File size is displayed correctly
- [ ] Status icons update correctly

