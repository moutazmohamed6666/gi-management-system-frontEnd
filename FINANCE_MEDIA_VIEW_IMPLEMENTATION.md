# Finance Role - Media View & Download Implementation

## Overview
This document describes the implementation of media file viewing and downloading functionality for the Finance role in the deal review process.

## Changes Made

### 1. API Updates

#### `lib/deals.ts`
- **Added `DealMediaFile` interface** - Type definition for media files returned from the API
  ```typescript
  export interface DealMediaFile {
    id: string;
    dealId: string;
    mediaTypeId: string;
    mediaType: { id: string; name: string };
    filename: string;
    originalFilename: string;
    fileSize: number;
    mimeType: string;
    fileUrl: string;
    uploadedById: string;
    uploadedBy: { id: string; name: string; email: string };
    createdAt: string;
    updatedAt: string;
  }
  ```

- **Added `getDealMedia()` function** - Fetches all media files for a specific deal
  ```typescript
  getDealMedia: async (dealId: string): Promise<DealMediaFile[]>
  ```
  - Endpoint: `GET /api/media/deal/{dealId}`
  - Returns: Array of media files with presigned URLs

### 2. New Component: DealMediaSection

#### `components/finance/DealMediaSection.tsx`
A comprehensive component for viewing and downloading deal media files.

**Features:**
- **Tabbed Interface** - Organizes files by media type (Contract, Invoice, Photos, etc.)
- **File Information Display**:
  - File icon based on MIME type (🖼️ for images, 📄 for PDFs, etc.)
  - Original filename
  - File size in human-readable format
  - Uploader name and email
  - Upload date and time
- **View Functionality**:
  - Opens images and PDFs in a new browser tab
  - For other file types, triggers download
- **Download Functionality**:
  - Downloads file with original filename
  - Handles authentication via Bearer token
  - Shows toast notifications for success/error
- **Badge Counters** - Shows number of files per media type
- **Loading States** - Displays spinner while fetching files
- **Error Handling** - Shows error messages if fetch fails
- **Empty State** - Shows friendly message when no files exist

**UI/UX Details:**
- Hover effects on file cards
- Responsive layout
- Dark mode support
- File type icons for quick identification
- Formatted dates and file sizes

### 3. Integration with Finance Review

#### `components/FinanceReview.tsx`
- **Imported** `DealMediaSection` component
- **Added** media section below the Deal Overview Section
- **Positioned** strategically in the finance review workflow:
  1. Finance Review Header
  2. Approval Status Badge
  3. Commission Summary Cards
  4. Commission Actions Card
  5. Deal Overview Section
  6. **→ Deal Media Section (NEW)**
  7. Modals (Collect Commission, Transfer Commission)

## User Flow (Finance Role)

1. Finance user opens a deal for review
2. Scrolls down past the deal overview section
3. Sees "Deal Media Files" card with:
   - Total file count in the description
   - Tabs for each media type with badge counters
4. Clicks on a media type tab to view files of that type
5. For each file, can:
   - **View** (for images and PDFs) - Opens in new tab
   - **Download** - Downloads file to their computer
6. File information is clearly displayed:
   - Visual file type icon
   - Original filename
   - File size
   - Who uploaded it
   - When it was uploaded

## API Endpoints Used

1. **GET** `/api/media/deal/{dealId}` - Fetch all media files for a deal
   - Response: Array of `DealMediaFile` objects with presigned URLs
   - Requires: Bearer token authentication

## Technical Details

### File Download Implementation
```typescript
const handleDownload = async (file: DealMediaFile) => {
  // Fetch file with authentication
  const response = await fetch(file.fileUrl, {
    headers: { Authorization: `Bearer ${token}` }
  });
  
  // Create blob and trigger download
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = file.originalFilename;
  a.click();
  window.URL.revokeObjectURL(url);
}
```

### File Viewing Implementation
```typescript
const handleView = (file: DealMediaFile) => {
  // Open images and PDFs in new tab
  if (file.mimeType.startsWith("image/") || 
      file.mimeType === "application/pdf") {
    window.open(file.fileUrl, "_blank");
  } else {
    // For other types, download instead
    handleDownload(file);
  }
}
```

### File Grouping
Files are grouped by media type ID for organized display:
```typescript
const groupedFiles = mediaFiles.reduce((acc, file) => {
  const typeId = file.mediaType.id;
  if (!acc[typeId]) {
    acc[typeId] = { type: file.mediaType, files: [] };
  }
  acc[typeId].files.push(file);
  return acc;
}, {});
```

## Security Considerations

1. **Authentication Required** - All file access requires valid Bearer token
2. **Presigned URLs** - Backend provides secure, time-limited URLs
3. **Role-Based Access** - Only finance role can access finance review page
4. **No Direct File Paths** - File URLs are controlled by backend

## File Type Support

### Viewable in Browser
- Images: JPEG, PNG, GIF, WebP, SVG
- Documents: PDF

### Download Only
- Word Documents: DOC, DOCX
- Excel Spreadsheets: XLS, XLSX
- Other: ZIP, RAR, TXT, CSV, etc.

## UI Components Used

- `Card`, `CardContent`, `CardHeader`, `CardTitle`, `CardDescription` - Container
- `Tabs`, `TabsContent`, `TabsList`, `TabsTrigger` - Tab navigation
- `Button` - Action buttons
- `Loader2`, `AlertCircle`, `FileIcon`, `Eye`, `Download` - Icons
- Toast notifications - User feedback

## Future Enhancements

Potential improvements for future iterations:

1. **File Preview Modal** - Preview files without leaving the page
2. **Bulk Download** - Download all files or all files of a type as ZIP
3. **File Deletion** - Allow finance to remove incorrect uploads
4. **File Comments** - Add notes/comments to specific files
5. **File Versions** - Track multiple versions of the same document
6. **File Approval** - Mark files as reviewed/approved
7. **Search/Filter** - Search files by name or filter by uploader
8. **Sort Options** - Sort by date, name, size, or type
9. **Thumbnail Previews** - Show image thumbnails in the list
10. **File Upload** - Allow finance to upload additional documents
11. **Print Functionality** - Print documents directly from the interface
12. **Share Links** - Generate shareable links for specific files

## Testing Checklist

- [x] Media files are fetched correctly from the API
- [x] Files are grouped by media type
- [x] Tabs are generated dynamically
- [x] Badge counters show correct file counts
- [x] File information displays correctly
- [x] File icons match MIME types
- [x] File sizes are formatted properly
- [x] Dates are formatted in readable format
- [x] View button works for images and PDFs
- [x] Download button works for all file types
- [x] Authentication token is included in requests
- [x] Error states are handled gracefully
- [x] Empty state displays when no files exist
- [x] Loading state shows while fetching
- [x] Toast notifications appear on success/error
- [x] Component integrates properly in FinanceReview
- [x] Dark mode styling works correctly
- [x] Responsive layout works on different screen sizes

## Performance Considerations

1. **Lazy Loading** - Files are only fetched when the finance review page loads
2. **Efficient Grouping** - Files are grouped client-side using reduce
3. **Blob URLs** - Properly cleaned up after download to prevent memory leaks
4. **No Unnecessary Re-renders** - Component only re-fetches when dealId changes

## Accessibility

- Semantic HTML structure
- Button labels and titles
- Keyboard navigation support (via shadcn/ui components)
- Screen reader friendly file information
- Clear visual hierarchy

