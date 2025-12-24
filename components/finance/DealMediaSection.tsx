"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Download, FileIcon, Loader2, AlertCircle, Eye, ExternalLink } from "lucide-react";
import { dealsApi, type DealMediaFile } from "@/lib/deals";
import { toast } from "sonner";

interface DealMediaSectionProps {
  dealId: string;
}

export function DealMediaSection({ dealId }: DealMediaSectionProps) {
  const [mediaFiles, setMediaFiles] = useState<DealMediaFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMediaType, setSelectedMediaType] = useState<string>("");

  useEffect(() => {
    fetchMediaFiles();
  }, [dealId]);

  const fetchMediaFiles = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const files = await dealsApi.getDealMedia(dealId);
      setMediaFiles(files);

      // Set first media type as default if available
      if (files.length > 0 && !selectedMediaType) {
        const firstType = files[0].mediaType.id;
        setSelectedMediaType(firstType);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to load media files";
      setError(errorMessage);
      console.error("Error fetching media files:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async (file: DealMediaFile) => {
    try {
      const token = sessionStorage.getItem("authToken");
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://dev.shaheen-env.work";

      const response = await fetch(file.fileUrl, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!response.ok) {
        throw new Error("Failed to download file");
      }

      const blob = await response.blob();
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
      const errorMessage = err instanceof Error ? err.message : "Download failed";
      toast.error("Download failed", {
        description: errorMessage,
      });
    }
  };

  const handleView = (file: DealMediaFile) => {
    const token = sessionStorage.getItem("authToken");
    
    // Open in new tab with auth header (for supported file types)
    if (file.mimeType.startsWith("image/") || file.mimeType === "application/pdf") {
      window.open(file.fileUrl, "_blank");
    } else {
      // For other file types, download instead
      handleDownload(file);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
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

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith("image/")) {
      return "🖼️";
    } else if (mimeType === "application/pdf") {
      return "📄";
    } else if (
      mimeType.includes("word") ||
      mimeType.includes("document")
    ) {
      return "📝";
    } else if (
      mimeType.includes("sheet") ||
      mimeType.includes("excel")
    ) {
      return "📊";
    } else {
      return "📎";
    }
  };

  // Group files by media type
  const groupedFiles = mediaFiles.reduce((acc, file) => {
    const typeId = file.mediaType.id;
    if (!acc[typeId]) {
      acc[typeId] = {
        type: file.mediaType,
        files: [],
      };
    }
    acc[typeId].files.push(file);
    return acc;
  }, {} as Record<string, { type: { id: string; name: string }; files: DealMediaFile[] }>);

  const mediaTypes = Object.values(groupedFiles);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Deal Media Files</CardTitle>
          <CardDescription>Documents and files attached to this deal</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            <span className="ml-3 text-gray-600 dark:text-gray-400">Loading media files...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Deal Media Files</CardTitle>
          <CardDescription>Documents and files attached to this deal</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8 text-red-500">
            <AlertCircle className="h-8 w-8 mr-3" />
            <span>{error}</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (mediaFiles.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Deal Media Files</CardTitle>
          <CardDescription>Documents and files attached to this deal</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <FileIcon className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No media files uploaded for this deal yet.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Deal Media Files</CardTitle>
        <CardDescription>
          View and download documents and files attached to this deal ({mediaFiles.length} file
          {mediaFiles.length !== 1 ? "s" : ""})
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={selectedMediaType} onValueChange={setSelectedMediaType}>
          <TabsList className="grid w-full mb-4" style={{ gridTemplateColumns: `repeat(${mediaTypes.length}, minmax(0, 1fr))` }}>
            {mediaTypes.map(({ type, files }) => (
              <TabsTrigger key={type.id} value={type.id}>
                {type.name}
                <span className="ml-2 inline-flex items-center justify-center w-5 h-5 text-xs font-semibold text-white bg-blue-500 rounded-full">
                  {files.length}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>

          {mediaTypes.map(({ type, files }) => (
            <TabsContent key={type.id} value={type.id} className="space-y-3">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-4 border rounded-lg dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="flex items-center space-x-4 flex-1 min-w-0">
                    <div className="text-3xl">{getFileIcon(file.mimeType)}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{file.originalFilename}</p>
                      <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                        <span>{formatFileSize(file.fileSize)}</span>
                        <span>•</span>
                        <span>Uploaded by {file.uploadedBy.name}</span>
                        <span>•</span>
                        <span>{formatDate(file.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {(file.mimeType.startsWith("image/") || file.mimeType === "application/pdf") && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleView(file)}
                        title="View file"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDownload(file)}
                      title="Download file"
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                  </div>
                </div>
              ))}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}

