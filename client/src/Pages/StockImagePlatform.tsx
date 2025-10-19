import React, { useState, useRef, useEffect } from "react";
import { Upload, Image, X, Edit2, Check, Trash2 } from "lucide-react";
import Navbar from "../Components/Navbar";
import {
  changePosition,
  createPost,
  deletePost,
  getposts,
  updatePost,
} from "../API/postApi";
import { toast } from "sonner";

interface ImageItem {
  id: number;
  imageUrl: string;
  title: string;
  imagePosition?: number;
}

interface PendingImage {
  id: number;
  file: File;
  imageUrl: string;
  title: string;
  imagePosition?: number;
}

export default function StockImagePlatform() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [editPreviewUrl, setEditPreviewUrl] = useState<string | null>(null);
  const [draggedItem, setDraggedItem] = useState<number | null>(null);
  const [dragOverItem, setDragOverItem] = useState<number | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [pendingImages, setPendingImages] = useState<PendingImage[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editImageFile, setEditImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editImageInputRef = useRef<HTMLInputElement>(null);

  const fetchPosts = async () => {
    const response = await getposts();
    if (response?.status === 200) {
      setImages(response.data.posts);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    index: number
  ) => {
    setDraggedItem(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", "");
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDragOverItem(null);
  };

  const handleDragOver = (
    e: React.DragEvent<HTMLDivElement>,
    index: number
  ) => {
    e.preventDefault();

    if (draggedItem === null || draggedItem === index) return;

    const newImages = [...images];

    const temp = newImages[draggedItem];
    newImages[draggedItem] = newImages[index];
    newImages[index] = temp;

    const tempPos = newImages[draggedItem].imagePosition;
    newImages[draggedItem].imagePosition = newImages[index].imagePosition;
    newImages[index].imagePosition = tempPos;

    setImages(newImages);
    setDraggedItem(index);

    changePosition(
      newImages[draggedItem].imagePosition!,
      newImages[index].imagePosition!
    );
  };

  const handleDragLeave = () => {
    setDragOverItem(null);
  };

  const handlePageDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    if (e.dataTransfer.types.includes("Files")) {
      setIsDraggingOver(true);
    }
  };

  const handlePageDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    if (e.currentTarget === e.target) {
      setIsDraggingOver(false);
    }
  };

  const handlePageDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingOver(false);

    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));

    if (imageFiles.length > 0) {
      processFiles(imageFiles);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const imageFiles = Array.from(files).filter((file) =>
      file.type.startsWith("image/")
    );
    if (imageFiles.length > 0) {
      processFiles(imageFiles);
    }
  };

  const processFiles = (files: File[]) => {
    const newPendingImages: PendingImage[] = [];

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const pending: PendingImage = {
          id: Date.now() + Math.random(),
          file: file,
          imageUrl: event.target?.result as string,
          title: file.name.replace(/\.[^/.]+$/, ""),
          // imagePosition : file.\
        };
        newPendingImages.push(pending);

        if (newPendingImages.length === files.length) {
          setPendingImages(newPendingImages);
          setShowUploadModal(true);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handlePendingTitleChange = (id: number, newTitle: string) => {
    setPendingImages((prev) =>
      prev.map((img) => (img.id === id ? { ...img, title: newTitle } : img))
    );
  };

  const handleRemovePending = (id: number) => {
    setPendingImages((prev) => prev.filter((img) => img.id !== id));
  };

  const handleUploadAll = async () => {
    try {
      const formData = new FormData();
      const token = localStorage.getItem("accessToken");

      pendingImages.forEach((img) => {
        formData.append("posts", img.file);
        formData.append("titles", img.title || "Untitled");
      });

      if (token) {
        formData.append("token", token);
      }

      const response = await createPost(formData);

      if (response?.status === 201) {
        const newImages = pendingImages.map((pending) => ({
          id: pending.id,
          imageUrl: pending.imageUrl,
          title: pending.title || "Untitled",
          imagePosition: pending.imagePosition,
        }));

        setImages((prev) => [...prev, ...newImages]);
        setPendingImages([]);
        setShowUploadModal(false);
      }
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  const handleCancelUpload = () => {
    setPendingImages([]);
    setShowUploadModal(false);
  };

  const startEditing = (image: ImageItem) => {
    setEditingId(image.imagePosition!);
    setEditTitle(image.title);
    setEditImageFile(null);
    setEditPreviewUrl(image.imageUrl); // Add this line
  };

  const handleEditImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setEditImageFile(file);
      // Add preview for the selected file
      const reader = new FileReader();
      reader.onload = (event) => {
        setEditPreviewUrl(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const saveEdit = async () => {
    if (editingId === null) return;

    const imageToUpdate = images.find((img) => img.imagePosition === editingId);
    if (!imageToUpdate?.imagePosition) return;

    try {
      const formData = new FormData();

      formData.append("title", editTitle);

      if (editImageFile) {
        formData.append("posts", editImageFile);
      }

      const response = await updatePost(imageToUpdate.imagePosition, formData);

      if (response?.status === 200) {
        const updatedimage = response.data.post;

        setImages((prev) =>
          prev.map((img) =>
            img.imagePosition === editingId
              ? {
                  ...img,
                  title: updatedimage.title,
                  imageUrl:
                    updatedimage.imageUrl || editPreviewUrl || img.imageUrl, // Fixed: Use API URL or preview
                }
              : img
          )
        );
        await fetchPosts();
        setEditingId(null);
        setEditTitle("");
        setEditImageFile(null);
        setEditPreviewUrl(null);
        toast.success(response.data.message)
      }else{
        toast.error(response?.data.error)
      }
    } catch (error) {
      console.error("Failed to update image:", error);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle("");
    setEditImageFile(null);
    setEditPreviewUrl(null); // Add this line
  };

  const deleteImage = async (id: string) => {
    try {
      const response = await deletePost(id);
      if (response?.status === 200) {
        setImages((prev) =>
          prev.filter((img) => img.imagePosition?.toString() !== id)
        );
      }
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  return (
    <>
      <Navbar />
      <div
        className="min-h-screen bg-gray-900 text-white"
        onDragOver={handlePageDragOver}
        onDragLeave={handlePageDragLeave}
        onDrop={handlePageDrop}
      >
        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-6 py-8">
          <div className="mb-8 flex col-2 justify-between">
            <div className="">
              <h2 className="text-3xl font-bold mb-2">Featured Images</h2>
              <p className="text-gray-400">
                Drag images to reorder or drop files to upload
              </p>
            </div>
            <div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg transition-colors"
              >
                <Upload className="w-5 h-5" />
                <span>Upload</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          </div>

          {/* Image Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {images?.map((image, index) => (
              <div
                key={image.id}
                draggable={editingId !== image.imagePosition}
                onDragStart={(e) => handleDragStart(e, index)}
                onDragEnd={handleDragEnd}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragLeave={handleDragLeave}
                className={`group relative bg-gray-800 rounded-lg overflow-hidden transition-all ${
                  editingId === image.imagePosition
                    ? "ring-2 ring-gray-500"
                    : "cursor-move"
                } ${draggedItem === index ? "opacity-50 scale-95" : ""} ${
                  dragOverItem === index && draggedItem !== index
                    ? "ring-2 ring-gray-500"
                    : ""
                } ${
                  editingId !== image.imagePosition &&
                  "hover:ring-2 hover:ring-gray-400"
                }`}
              >
                <div className="aspect-video overflow-hidden">
                  <img
                    src={
                      editingId === image.imagePosition && editPreviewUrl
                        ? editPreviewUrl // NEW IMAGE PREVIEW ONLY FOR EDITING IMAGE
                        : image.imageUrl // ORIGINAL FOR ALL OTHERS
                    }
                    alt={image.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    draggable={false}
                  />
                </div>

                {editingId === image.imagePosition ? (
                  <div className="p-4 space-y-3">
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-gray-500 focus:outline-none"
                      placeholder="Image title"
                    />
                    <button
                      onClick={() => editImageInputRef.current?.click()}
                      className="w-full bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded text-sm transition-colors"
                    >
                      {editImageFile ? "Image selected ✓" : "Change Image"}
                    </button>
                    <input
                      ref={editImageInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleEditImageSelect}
                      className="hidden"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={saveEdit}
                        className="flex-1 bg-gray-600 hover:bg-gray-700 px-3 py-2 rounded flex items-center justify-center gap-2 transition-colors"
                      >
                        <Check className="w-4 h-4" />
                        Save
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="flex-1 bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded flex items-center justify-center gap-2 transition-colors"
                      >
                        <X className="w-4 h-4" />
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-4">
                    <h3 className="font-semibold text-lg">{image.title}</h3>
                    <p className="text-sm text-gray-400 mt-1">Free to use</p>
                  </div>
                )}

                {editingId !== image.imagePosition && (
                  <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => startEditing(image)}
                      className="bg-gray-600 hover:bg-gray-700 p-2 rounded-full transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() =>
                        deleteImage(image?.imagePosition?.toString() || "")
                      }
                      className="bg-red-600 hover:bg-red-700 p-2 rounded-full transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Empty State */}
          {images?.length === 0 && (
            <div className="text-center py-20">
              <Image className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">
                No images yet. Upload or drop files to get started!
              </p>
            </div>
          )}
        </main>

        {/* Upload Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
              <div className="p-6 border-b border-gray-700 flex items-center justify-between">
                <h2 className="text-2xl font-bold">Add Image Titles</h2>
                <button
                  onClick={handleCancelUpload}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto flex-1">
                <div className="space-y-4">
                  {pendingImages.map((pending, idx) => (
                    <div
                      key={pending.id}
                      className="bg-gray-700 rounded-lg p-4 flex gap-4"
                    >
                      <div className="aspect-video overflow-hidden">
                        <img
                          src={
                            editingId === pending.imagePosition
                              ? editPreviewUrl || pending.imageUrl
                              : pending.imageUrl
                          }
                          alt={pending.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          draggable={false}
                        />
                      </div>
                      <div className="flex-1 flex flex-col gap-2">
                        <label className="text-sm text-gray-400">
                          Image {idx + 1} Title
                        </label>
                        <input
                          type="text"
                          value={pending.title}
                          onChange={(e) =>
                            handlePendingTitleChange(pending.id, e.target.value)
                          }
                          className="bg-gray-600 text-white px-3 py-2 rounded border border-gray-500 focus:border-gray-500 focus:outline-none"
                          placeholder="Enter image title"
                        />
                      </div>
                      <button
                        onClick={() => handleRemovePending(pending.id)}
                        className="text-red-400 hover:text-red-300 transition-colors p-2"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 border-t border-gray-700 flex gap-4">
                <button
                  onClick={handleCancelUpload}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUploadAll}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 px-6 py-3 rounded-lg transition-colors"
                >
                  Upload {pendingImages.length}{" "}
                  {pendingImages.length === 1 ? "Image" : "Images"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Drag Overlay */}
        {isDraggingOver && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-20 border-4 border-gray-500 border-dashed flex items-center justify-center pointer-events-none z-50">
            <div className="bg-gray-800 rounded-lg p-8 text-center">
              <Upload className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <p className="text-2xl font-bold">Drop images here to upload</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
