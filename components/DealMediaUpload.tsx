"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ArrowLeft, Upload, Loader2, FileIcon, CheckCircle2, XCircle } from "lucide-react";
import { useFilters } from "@/lib/useFilters";
import { dealsApi } from "@/lib/deals";
import { toast } from "sonner";

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
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, UploadedFile[]>>({});
  const [isDragging, setIsDragging] = useState(false);

  // Set the first media type as default when loaded
  useEffect(() => {
    if (mediaTypes.length > 0 && !selectedMediaType) {
      setSelectedMediaType(mediaTypes[0].id);
    }
  }, [mediaTypes, selectedMediaType]);

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
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Upload failed";

      // Update status to error
      setUploadedFiles((prev) => {
        const files = [...(prev[mediaTypeId] || [])];
        files[index] = { ...files[index], status: "error", error: errorMessage };
        return { ...prev, [mediaTypeId]: files };
      });

      toast.error("Upload failed", {
        description: errorMessage,
      });
    }
  };

  const handleUploadAll = async (mediaTypeId: string) => {
    const files = uploadedFiles[mediaTypeId] || [];
    const pendingFiles = files.filter((f) => f.status === "pending" || f.status === "error");

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
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };

  if (filtersLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        <span className="ml-3 text-gray-600 dark:text-gray-400">Loading media types...</span>
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Deals
          </Button>
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Deal ID: <span className="font-mono">{dealId}</span>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upload Deal Media</CardTitle>
          <CardDescription>
            Upload documents and media files for this deal. Select a media type tab and drag & drop
            files or click to browse.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedMediaType} onValueChange={setSelectedMediaType}>
            <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${mediaTypes.length}, minmax(0, 1fr))` }}>
              {mediaTypes.map((type) => (
                <TabsTrigger key={type.id} value={type.id}>
                  {type.name}
                  {uploadedFiles[type.id] && uploadedFiles[type.id].length > 0 && (
                    <span className="ml-2 inline-flex items-center justify-center w-5 h-5 text-xs font-semibold text-white bg-blue-500 rounded-full">
                      {uploadedFiles[type.id].length}
                    </span>
                  )}
                </TabsTrigger>
              ))}
            </TabsList>

            {mediaTypes.map((type) => (
              <TabsContent key={type.id} value={type.id} className="space-y-4">
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    isDragging
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20"
                      : "border-gray-300 dark:border-gray-700"
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, type.id)}
                >
                  <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-lg font-medium mb-2">
                    Drop {type.name} files here, or click to browse
                  </p>
                  <p className="text-sm text-gray-500 mb-4">
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
                    onClick={() => document.getElementById(`file-input-${type.id}`)?.click()}
                  >
                    Browse Files
                  </Button>
                </div>

                {uploadedFiles[type.id] && uploadedFiles[type.id].length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">
                        Files ({uploadedFiles[type.id].length})
                      </h3>
                      <Button
                        onClick={() => handleUploadAll(type.id)}
                        disabled={uploadedFiles[type.id].every((f) => f.status === "success")}
                        className="gi-bg-dark-green"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload All
                      </Button>
                    </div>

                    <div className="space-y-2">
                      {uploadedFiles[type.id].map((uploadedFile, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 border rounded-lg dark:border-gray-700"
                        >
                          <div className="flex items-center space-x-3 flex-1">
                            {getStatusIcon(uploadedFile.status)}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">
                                {uploadedFile.file.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {formatFileSize(uploadedFile.file.size)}
                              </p>
                              {uploadedFile.error && (
                                <p className="text-xs text-red-500 mt-1">{uploadedFile.error}</p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {uploadedFile.status === "pending" && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => uploadFile(uploadedFile.file, type.id, index)}
                              >
                                Upload
                              </Button>
                            )}
                            {uploadedFile.status === "error" && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => uploadFile(uploadedFile.file, type.id, index)}
                              >
                                Retry
                              </Button>
                            )}
                            {uploadedFile.status !== "uploading" && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleRemoveFile(type.id, index)}
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
    </div>
  );
}

