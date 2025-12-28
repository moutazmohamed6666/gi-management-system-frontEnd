# Media File Delete Implementation

## Overview
This document describes the implementation of the delete functionality for media files, available in both the Finance Review page and the Media Upload page.

## Changes Made

### 1. API Function

#### `lib/deals.ts`
- **Added `deleteMedia()` function** - Deletes a media file by ID
  ```typescript
  deleteMedia: async (mediaId: string): Promise<{ message: string }>
  ```
  - Endpoint: `DELETE /api/media/{id}`
  - Requires: Bearer token authentication
  - Returns: Success message

### 2. Finance Review Page - Delete Functionality

#### `components/finance/DealMediaSection.tsx`
**Added Features:**
- **Delete Button** - Red trash icon button for each file
- **Confirmation Dialog** - AlertDialog to confirm deletion
- **State Management**:
  - `fileToDelete` - Tracks which file is being deleted
  - `isDeleting` - Loading state during deletion
- **Delete Handler** - Removes file from API and local state
- **Toast Notifications** - Success/error feedback

**UI/UX:**
- Delete button styled in red with hover effects
- Confirmation dialog prevents accidental deletions
- Shows filename in confirmation message
- Loading state with spinner during deletion
- Automatic list refresh after deletion

### 3. Media Upload Page - Enhanced with Delete & View

#### `components/DealMediaUpload.tsx`
**Major Enhancements:**

1. **Existing Files Display**
   - Fetches and displays already uploaded files
   - Organized by media type in tabs
   - Shows file metadata (name, size, uploader, date)
   - Separate section from "New Files to Upload"

2. **Delete Functionality**
   - Delete button for each existing file
   - Confirmation dialog before deletion
   - Removes file from server and updates UI

3. **View & Download**
   - View button for images and PDFs (opens in new tab)
   - Download button for all file types
   - Same functionality as Finance Review page

4. **Auto-Refresh**
   - Refreshes existing files list after successful upload
   - Ensures uploaded files immediately appear in the "Uploaded Files" section

**New State Variables:**
```typescript
const [existingFiles, setExistingFiles] = useState<DealMediaFile[]>([]);
const [isLoadingExisting, setIsLoadingExisting] = useState(true);
const [fileToDelete, setFileToDelete] = useState<DealMediaFile | null>(null);
const [isDeleting, setIsDeleting] = useState(false);
```

**New Functions:**
- `fetchExistingFiles()` - Fetches uploaded files from API
- `handleDeleteClick()` - Opens confirmation dialog
- `handleDeleteConfirm()` - Performs deletion
- `handleDeleteCancel()` - Closes dialog
- `handleDownload()` - Downloads file
- `handleView()` - Views file in new tab
- `getFileIcon()` - Returns emoji icon for file type
- `formatDate()` - Formats date/time

## User Flows

### Finance Role - Delete File

1. Opens deal in Finance Review
2. Scrolls to "Deal Media Files" section
3. Sees list of uploaded files organized by type
4. Clicks red trash icon on unwanted file
5. Confirmation dialog appears with filename
6. Clicks "Delete" to confirm
7. File is deleted and removed from list
8. Success toast notification appears

### Any Role - Upload Page with Delete

1. Creates a deal (redirected to media upload page)
2. Sees tabs for each media type
3. **Uploaded Files Section** shows existing files:
   - File icon, name, size
   - Uploader name and date
   - View, Download, and Delete buttons
4. **New Files to Upload Section** shows pending uploads:
   - File selection and upload status
   - Upload buttons
5. Can delete existing files with confirmation
6. Can view/download existing files
7. After uploading new files, they appear in "Uploaded Files" section

## API Endpoints Used

1. **GET** `/api/media/deal/{dealId}` - Fetch all media files for a deal
2. **DELETE** `/api/media/{id}` - Delete a specific media file
3. **POST** `/api/media/deal/{dealId}` - Upload a new media file

## Security & Permissions

- **Authentication Required** - All operations require valid Bearer token
- **Role-Based Access** - Finance role can access Finance Review page
- **Confirmation Required** - Delete action requires explicit confirmation
- **No Undo** - Deletion is permanent (as warned in dialog)

## UI Components Used

### New Components
- `AlertDialog` - Confirmation dialog for deletion
- `AlertDialogContent` - Dialog content container
- `AlertDialogHeader` - Dialog header with title
- `AlertDialogTitle` - Dialog title
- `AlertDialogDescription` - Dialog description text
- `AlertDialogFooter` - Dialog footer with buttons
- `AlertDialogAction` - Confirm button
- `AlertDialogCancel` - Cancel button

### Icons
- `Trash2` - Delete button icon
- `Eye` - View button icon
- `Download` - Download button icon
- `Loader2` - Loading spinner during deletion

## Technical Implementation

### Delete Flow
```typescript
const handleDeleteConfirm = async () => {
  if (!fileToDelete) return;
  
  setIsDeleting(true);
  try {
    // Delete from server
    await dealsApi.deleteMedia(fileToDelete.id);
    
    // Remove from local state
    setMediaFiles((prev) => prev.filter((f) => f.id !== fileToDelete.id));
    
    // Show success message
    toast.success("File deleted", {
      description: `${fileToDelete.originalFilename} has been deleted successfully`,
    });
    
    setFileToDelete(null);
  } catch (err) {
    // Show error message
    toast.error("Delete failed", { description: errorMessage });
  } finally {
    setIsDeleting(false);
  }
};
```

### State Management
- **Optimistic UI Update** - File removed from list immediately after API success
- **No Refetch Needed** - Local state update is sufficient
- **Error Handling** - Shows error toast if deletion fails
- **Loading State** - Disables buttons during deletion

## Styling & Accessibility

### Delete Button Styling
```typescript
className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
```
- Red color indicates destructive action
- Hover effects provide visual feedback
- Dark mode compatible

### Confirmation Dialog
- Clear title: "Delete Media File"
- Shows filename in bold
- Warning: "This action cannot be undone"
- Red "Delete" button for destructive action
- Gray "Cancel" button for safe action
- Disabled state during deletion

### Accessibility Features
- Semantic HTML structure
- Button labels and titles
- Keyboard navigation support
- Screen reader friendly messages
- Focus management in dialog
- Disabled state for buttons during operations

## Error Handling

### Delete Errors
- Network errors caught and displayed
- API errors shown in toast
- File remains in list if deletion fails
- User can retry deletion

### Edge Cases
- Empty file list handled gracefully
- Loading states for async operations
- Concurrent deletion prevented (disabled buttons)
- Dialog closes on successful deletion

## Testing Checklist

- [x] Delete API function added to lib/deals.ts
- [x] Delete button appears on each file
- [x] Delete button styled in red
- [x] Confirmation dialog appears on click
- [x] Dialog shows correct filename
- [x] Cancel button closes dialog without deleting
- [x] Delete button calls API correctly
- [x] File removed from list after successful deletion
- [x] Success toast appears after deletion
- [x] Error toast appears if deletion fails
- [x] Loading state shows during deletion
- [x] Buttons disabled during deletion
- [x] Works in Finance Review page
- [x] Works in Media Upload page
- [x] Existing files section added to upload page
- [x] View and download buttons work on upload page
- [x] Auto-refresh after upload works
- [x] Dark mode styling correct
- [x] No linter errors

## Future Enhancements

1. **Bulk Delete** - Select and delete multiple files at once
2. **Soft Delete** - Move to trash instead of permanent deletion
3. **Restore Functionality** - Undo deletion within time window
4. **Delete Permissions** - Restrict deletion to specific roles
5. **Audit Log** - Track who deleted which files and when
6. **File Versions** - Keep previous versions when "deleting"
7. **Confirmation Checkbox** - Require checkbox for critical files
8. **Delete Reason** - Optional reason for deletion
9. **Batch Operations** - Delete all files of a type
10. **Recycle Bin** - Temporary storage for deleted files

## Performance Considerations

1. **Optimistic Updates** - UI updates immediately without refetch
2. **Local State Management** - No unnecessary API calls
3. **Efficient Filtering** - Uses array filter for removal
4. **Minimal Re-renders** - Only affected components update
5. **Debounced Operations** - Prevents accidental double-clicks

## Security Considerations

1. **Server-Side Validation** - Backend verifies permissions
2. **Token Authentication** - All requests include Bearer token
3. **Confirmation Required** - Prevents accidental deletions
4. **No Direct File Access** - All operations through API
5. **Audit Trail** - Backend logs deletion events


