"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  ArrowLeft,
  Upload,
  Loader2,
  FileIcon,
  CheckCircle2,
  XCircle,
  Trash2,
  Eye,
  Download,
} from "lucide-react";
import { useFilters } from "@/lib/useFilters";
import { dealsApi, type DealMediaFile } from "@/lib/deals";
import { getErrorMessage } from "@/lib/api";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";

interface DealMediaUploadProps {
  dealId: string;
  onBack: () => void;
}

interface UploadedFile {
  file: File;
  status: "pending" | "uploading" | "success" | "error";
  error?: string;
}

export function DealMediaUpload({ dealId, onBack }: DealMediaUploadProps) {
  const { mediaTypes, isLoading: filtersLoading } = useFilters();
  const [selectedMediaType, setSelectedMediaType] = useState<string>("");
  const [uploadedFiles, setUploadedFiles] = useState<
    Record<string, UploadedFile[]>
  >({});
  const [isDragging, setIsDragging] = useState(false);
  const [existingFiles, setExistingFiles] = useState<DealMediaFile[]>([]);
  const [isLoadingExisting, setIsLoadingExisting] = useState(true);
  const [fileToDelete, setFileToDelete] = useState<DealMediaFile | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Set the first media type as default when loaded
  useEffect(() => {
    if (mediaTypes.length > 0 && !selectedMediaType) {
      setSelectedMediaType(mediaTypes[0].id);
    }
  }, [mediaTypes, selectedMediaType]);

  // Fetch existing files
  useEffect(() => {
    fetchExistingFiles();
  }, [dealId]);

  const fetchExistingFiles = async () => {
    setIsLoadingExisting(true);
    try {
      const files = await dealsApi.getDealMedia(dealId);
      setExistingFiles(files);
    } catch (err) {
      console.error("Error fetching existing files:", err);
    } finally {
      setIsLoadingExisting(false);
    }
  };

  const handleFileSelect = useCallback(
    (files: FileList | null, mediaTypeId: string) => {
      if (!files || files.length === 0) return;

      const newFiles: UploadedFile[] = Array.from(files).map((file) => ({
        file,
        status: "pending",
      }));

      setUploadedFiles((prev) => ({
        ...prev,
        [mediaTypeId]: [...(prev[mediaTypeId] || []), ...newFiles],
      }));
    },
    []
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = useCallback(
    (e: React.DragEvent, mediaTypeId: string) => {
      e.preventDefault();
      setIsDragging(false);
      handleFileSelect(e.dataTransfer.files, mediaTypeId);
    },
    [handleFileSelect]
  );

  const uploadFile = async (file: File, mediaTypeId: string, index: number) => {
    // Update status to uploading
    setUploadedFiles((prev) => {
      const files = [...(prev[mediaTypeId] || [])];
      files[index] = { ...files[index], status: "uploading" };
      return { ...prev, [mediaTypeId]: files };
    });

    try {
      await dealsApi.uploadMedia(dealId, file, mediaTypeId);

      // Update status to success
      setUploadedFiles((prev) => {
        const files = [...(prev[mediaTypeId] || [])];
        files[index] = { ...files[index], status: "success" };
        return { ...prev, [mediaTypeId]: files };
      });

      toast.success("File uploaded", {
        description: `${file.name} uploaded successfully`,
      });

      // Refresh existing files list
      fetchExistingFiles();
    } catch (error) {
      const errorMessage = getErrorMessage(error, "Upload failed");

      // Update status to error
      setUploadedFiles((prev) => {
        const files = [...(prev[mediaTypeId] || [])];
        files[index] = {
          ...files[index],
          status: "error",
          error: errorMessage,
        };
        return { ...prev, [mediaTypeId]: files };
      });

      toast.error("Upload failed", {
        description: errorMessage,
      });
    }
  };

  const handleUploadAll = async (mediaTypeId: string) => {
    const files = uploadedFiles[mediaTypeId] || [];
    const pendingFiles = files.filter(
      (f) => f.status === "pending" || f.status === "error"
    );

    for (let i = 0; i < files.length; i++) {
      if (files[i].status === "pending" || files[i].status === "error") {
        await uploadFile(files[i].file, mediaTypeId, i);
      }
    }

    if (pendingFiles.length === 0) {
      toast.info("No files to upload", {
        description: "All files have already been uploaded",
      });
    }
  };

  const handleRemoveFile = (mediaTypeId: string, index: number) => {
    setUploadedFiles((prev) => {
      const files = [...(prev[mediaTypeId] || [])];
      files.splice(index, 1);
      return { ...prev, [mediaTypeId]: files };
    });
  };

  const getStatusIcon = (status: UploadedFile["status"]) => {
    switch (status) {
      case "uploading":
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
      case "success":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "error":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <FileIcon className="h-4 w-4 text-gray-400" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const handleDeleteClick = (file: DealMediaFile) => {
    setFileToDelete(file);
  };

  const handleDeleteConfirm = async () => {
    if (!fileToDelete) return;

    setIsDeleting(true);
    try {
      await dealsApi.deleteMedia(fileToDelete.id);

      toast.success("File deleted", {
        description: `${fileToDelete.originalFilename} has been deleted successfully`,
      });

      // Remove from local state
      setExistingFiles((prev) => prev.filter((f) => f.id !== fileToDelete.id));
      setFileToDelete(null);
    } catch (err) {
      const errorMessage = getErrorMessage(err, "Failed to delete file");
      toast.error("Delete failed", {
        description: errorMessage,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setFileToDelete(null);
  };

  const handleDownload = async (file: DealMediaFile) => {
    try {
      // Use the API endpoint to download the file
      const blob = await dealsApi.downloadMedia(file.id);

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.originalFilename || file.filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success("Download started", {
        description: `Downloading ${file.originalFilename}`,
      });
    } catch (err) {
      const errorMessage = getErrorMessage(err, "Download failed");
      toast.error("Download failed", {
        description: errorMessage,
      });
    }
  };

  const handleView = (file: DealMediaFile) => {
    const viewUrl = file.url || file.fileUrl;
    if (!viewUrl) return;

    if (
      file.mimeType.startsWith("image/") ||
      file.mimeType === "application/pdf"
    ) {
      window.open(viewUrl, "_blank");
    } else {
      handleDownload(file);
    }
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith("image/")) {
      return "🖼️";
    } else if (mimeType === "application/pdf") {
      return "📄";
    } else if (mimeType.includes("word") || mimeType.includes("document")) {
      return "📝";
    } else if (mimeType.includes("sheet") || mimeType.includes("excel")) {
      return "📊";
    } else {
      return "📎";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (filtersLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        <span className="ml-3 text-gray-600 dark:text-gray-400">
          Loading media types...
        </span>
      </div>
    );
  }

  if (mediaTypes.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Deals
          </Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>No Media Types Available</CardTitle>
            <CardDescription>
              No media types are configured. Please contact your administrator.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <Button
            variant="ghost"
            onClick={onBack}
            size="sm"
            className="px-2 sm:px-4"
          >
            <ArrowLeft className="h-4 w-4 mr-1 sm:mr-2" />
            Back to Deals
          </Button>
        </div>
        <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 px-2 sm:px-0">
          Deal ID: <span className="font-mono break-all">{dealId}</span>
        </div>
      </div>

      <Card>
        <CardHeader className="px-4 sm:px-6 md:px-8 py-4 sm:py-6">
          <CardTitle className="text-lg sm:text-xl md:text-2xl">
            Upload Deal Media
          </CardTitle>
          <CardDescription className="text-sm md:text-base">
            Upload documents and media files for this deal. Select a media type
            tab and drag & drop files or click to browse.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-4 sm:px-6 md:px-8">
          <Tabs value={selectedMediaType} onValueChange={setSelectedMediaType}>
            <div className="overflow-x-auto -mx-1 px-1 pb-2 md:overflow-x-visible md:mx-0 md:px-0">
              <TabsList
                className="inline-flex h-auto min-w-full md:grid md:w-full gap-1 p-1"
                style={{
                  gridTemplateColumns:
                    mediaTypes.length > 0
                      ? `repeat(${Math.min(
                          mediaTypes.length,
                          4
                        )}, minmax(0, 1fr))`
                      : undefined,
                }}
              >
                {mediaTypes.map((type) => (
                  <TabsTrigger
                    key={type.id}
                    value={type.id}
                    className="whitespace-nowrap px-3 py-2 text-xs sm:text-sm md:px-4 md:py-2.5"
                  >
                    {type.name}
                    {uploadedFiles[type.id] &&
                      uploadedFiles[type.id].length > 0 && (
                        <span className="ml-1.5 inline-flex items-center justify-center w-4 h-4 sm:w-5 sm:h-5 text-[10px] sm:text-xs font-semibold text-white bg-blue-500 rounded-full">
                          {uploadedFiles[type.id].length}
                        </span>
                      )}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {mediaTypes.map((type) => (
              <TabsContent
                key={type.id}
                value={type.id}
                className="space-y-4 md:space-y-6"
              >
                <div
                  className={`border-2 border-dashed rounded-lg p-4 sm:p-6 md:p-10 text-center transition-colors ${
                    isDragging
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20"
                      : "border-gray-300 dark:border-gray-700"
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, type.id)}
                >
                  <Upload className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 mx-auto mb-3 sm:mb-4 text-gray-400" />
                  <p className="text-base sm:text-lg md:text-xl font-medium mb-2">
                    Drop {type.name} files here, or click to browse
                  </p>
                  <p className="text-xs sm:text-sm md:text-base text-gray-500 mb-3 sm:mb-4">
                    Supported formats: PDF, JPG, PNG, DOCX, XLSX
                  </p>
                  <input
                    type="file"
                    multiple
                    className="hidden"
                    id={`file-input-${type.id}`}
                    onChange={(e) => handleFileSelect(e.target.files, type.id)}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      document.getElementById(`file-input-${type.id}`)?.click()
                    }
                    className="w-full sm:w-auto md:px-6"
                  >
                    Browse Files
                  </Button>
                </div>

                {/* Existing Files Section */}
                {existingFiles.filter((f) => f.mediaType.id === type.id)
                  .length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-base sm:text-lg md:text-xl font-semibold">
                      Uploaded Files (
                      {
                        existingFiles.filter((f) => f.mediaType.id === type.id)
                          .length
                      }
                      )
                    </h3>
                    <div className="space-y-3 md:grid md:grid-cols-2 md:gap-4 md:space-y-0 lg:grid-cols-1 lg:gap-3">
                      {existingFiles
                        .filter((f) => f.mediaType.id === type.id)
                        .map((file) => (
                          <div
                            key={file.id}
                            className="p-3 sm:p-4 md:p-5 border rounded-lg dark:border-gray-700 bg-gray-50 dark:bg-gray-800 lg:flex lg:items-center lg:justify-between"
                          >
                            {/* File info row */}
                            <div className="flex items-start gap-3 lg:flex-1 lg:min-w-0">
                              <div className="text-xl sm:text-2xl md:text-3xl flex-shrink-0">
                                {getFileIcon(file.mimeType)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm md:text-base font-medium break-words line-clamp-2 lg:line-clamp-1">
                                  {file.originalFilename}
                                </p>
                                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs md:text-sm text-gray-500 mt-1">
                                  <span>{formatFileSize(file.fileSize)}</span>
                                  <span className="hidden md:inline">•</span>
                                  <span className="hidden md:inline">
                                    Uploaded by {file.uploadedBy.name}
                                  </span>
                                  <span className="hidden lg:inline">•</span>
                                  <span className="hidden lg:inline">
                                    {formatDate(file.createdAt)}
                                  </span>
                                </div>
                                {/* Mobile/tablet-only metadata */}
                                <div className="md:hidden text-xs text-gray-500 mt-1">
                                  <span>By {file.uploadedBy.name}</span>
                                </div>
                              </div>
                            </div>

                            {/* Action buttons - separate row on mobile, inline on tablet+ */}
                            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 md:mt-4 md:pt-4 lg:mt-0 lg:pt-0 lg:border-t-0 lg:ml-4 lg:flex-shrink-0">
                              {(file.mimeType.startsWith("image/") ||
                                file.mimeType === "application/pdf") && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleView(file)}
                                  title="View file"
                                  className="flex-1 md:flex-none"
                                >
                                  <Eye className="h-4 w-4 md:mr-1" />
                                  <span className="hidden md:inline">View</span>
                                </Button>
                              )}
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDownload(file)}
                                title="Download file"
                                className="flex-1 md:flex-none"
                              >
                                <Download className="h-4 w-4 md:mr-1" />
                                <span className="hidden md:inline">
                                  Download
                                </span>
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDeleteClick(file)}
                                title="Delete file"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* New Files to Upload Section */}
                {uploadedFiles[type.id] &&
                  uploadedFiles[type.id].length > 0 && (
                    <div className="space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <h3 className="text-base sm:text-lg md:text-xl font-semibold">
                          New Files to Upload ({uploadedFiles[type.id].length})
                        </h3>
                        <Button
                          onClick={() => handleUploadAll(type.id)}
                          disabled={uploadedFiles[type.id].every(
                            (f) => f.status === "success"
                          )}
                          className="gi-bg-dark-green w-full sm:w-auto md:px-6"
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Upload All
                        </Button>
                      </div>

                      <div className="space-y-3 md:grid md:grid-cols-2 md:gap-4 md:space-y-0 lg:grid-cols-1 lg:gap-3">
                        {uploadedFiles[type.id].map((uploadedFile, index) => (
                          <div
                            key={index}
                            className="p-3 sm:p-4 md:p-5 border rounded-lg dark:border-gray-700 lg:flex lg:items-center lg:justify-between"
                          >
                            <div className="flex items-start gap-3 lg:flex-1 lg:min-w-0">
                              <div className="flex-shrink-0 mt-0.5">
                                {getStatusIcon(uploadedFile.status)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm md:text-base font-medium break-words line-clamp-2 lg:line-clamp-1">
                                  {uploadedFile.file.name}
                                </p>
                                <p className="text-xs md:text-sm text-gray-500">
                                  {formatFileSize(uploadedFile.file.size)}
                                </p>
                                {uploadedFile.error && (
                                  <p className="text-xs md:text-sm text-red-500 mt-1">
                                    {uploadedFile.error}
                                  </p>
                                )}
                              </div>
                            </div>

                            {/* Action buttons */}
                            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 md:mt-4 md:pt-4 lg:mt-0 lg:pt-0 lg:border-t-0 lg:ml-4 lg:flex-shrink-0">
                              {uploadedFile.status === "pending" && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() =>
                                    uploadFile(
                                      uploadedFile.file,
                                      type.id,
                                      index
                                    )
                                  }
                                  className="flex-1 md:flex-none"
                                >
                                  <Upload className="h-4 w-4 md:mr-1" />
                                  <span className="md:inline">Upload</span>
                                </Button>
                              )}
                              {uploadedFile.status === "error" && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() =>
                                    uploadFile(
                                      uploadedFile.file,
                                      type.id,
                                      index
                                    )
                                  }
                                  className="flex-1 md:flex-none"
                                >
                                  Retry
                                </Button>
                              )}
                              {uploadedFile.status !== "uploading" && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() =>
                                    handleRemoveFile(type.id, index)
                                  }
                                  title="Remove file"
                                >
                                  <XCircle className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!fileToDelete}
        onOpenChange={(open) => !open && handleDeleteCancel()}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Media File</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <strong>{fileToDelete?.originalFilename}</strong>? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
