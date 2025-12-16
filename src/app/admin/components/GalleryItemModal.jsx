"use client";

import { useState } from "react";

export default function GalleryItemModal({ onClose, onItemCreated }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tags: [],
    isMemberOnly: false,
  });
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [fileType, setFileType] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);

      // Detect file type
      const detectedType = getFileType(file);
      setFileType(detectedType);

      // Create preview for images
      if (detectedType === "image") {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFilePreview(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        setFilePreview(null);
      }
    }
  };

  const getFileType = (file) => {
    const type = file.type.split("/")[0];
    if (type === "image" || type === "video") {
      return type;
    } else if (
      file.type.includes("pdf") ||
      file.type.includes("document") ||
      file.type.includes("text")
    ) {
      return "document";
    } else if (file.type.includes("audio")) {
      return "audio";
    }
    return "document"; // Default
  };

  const getFileIcon = (type) => {
    switch (type) {
      case "image":
        return (
          <svg
            className="w-12 h-12 text-blue-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        );
      case "video":
        return (
          <svg
            className="w-12 h-12 text-purple-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
        );
      case "document":
        return (
          <svg
            className="w-12 h-12 text-green-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        );
      case "audio":
        return (
          <svg
            className="w-12 h-12 text-yellow-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
            />
          </svg>
        );
      default:
        return (
          <svg
            className="w-12 h-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        );
    }
  };

  const getFileAcceptTypes = () => {
    return "image/*,video/*,audio/*,.pdf,.doc,.docx,.txt,.ppt,.pptx";
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError("Le titre est requis");
      return false;
    }
    if (!file) {
      setError("Un fichier est requis");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const authToken = localStorage.getItem("authToken");

      if (!authToken) {
        throw new Error("Token d'authentification manquant");
      }

      const formDataToSend = new FormData();

      // Append form data
      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description || "");
      formDataToSend.append("isMemberOnly", formData.isMemberOnly.toString());

      // Append tags as JSON array
      if (formData.tags.length > 0) {
        formDataToSend.append("tags", JSON.stringify(formData.tags));
      }

      // Append file
      formDataToSend.append("file", "file");

      // Add fileType if we can determine it
      if (fileType) {
        formDataToSend.append("fileType", fileType);
      }

      console.log(formDataToSend);

      const response = await fetch("/api/media", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          title: formData.title,
          imgURL: "hey.png",
          description: "An example image uploaded by admin",
          fileUrl: "https://example.com/uploads/photo.jpg",
          fileType: "image",
          thumbnailUrl: "https://example.com/uploads/thumb.jpg",
          isMemberOnly: false,
          tags: ["skincare", "workshop"],
        }),
        /* body: formDataToSend, */
      });

      const result = await response.json();

      if (!response.ok) {
        // Handle specific errors
        if (response.status === 400) {
          throw new Error(
            result.message ||
              "Données invalides. Vérifiez les informations saisies."
          );
        }
        if (response.status === 413) {
          throw new Error(
            "Le fichier est trop volumineux. Taille maximale: 10MB"
          );
        }
        throw new Error(
          result.message || "Erreur lors de la création du média"
        );
      }

      if (result.success) {
        // Trigger refresh and close modal
        if (onItemCreated) {
          onItemCreated();
        }
        onClose();
      } else {
        throw new Error(
          result.message || "Erreur lors de la création du média"
        );
      }
    } catch (error) {
      console.error("Erreur:", error);
      setError(`❌ ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-blue-800">
              Ajouter un nouveau média
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 border border-red-200 rounded-md">
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{error}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left column - File upload */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fichier *
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-blue-500 transition-colors">
                    <div className="space-y-2 text-center w-full">
                      {file ? (
                        <div className="space-y-2">
                          {fileType === "image" && filePreview ? (
                            <img
                              src={filePreview}
                              alt="Preview"
                              className="mx-auto h-48 object-cover rounded-md"
                            />
                          ) : (
                            <div className="flex flex-col items-center justify-center py-8">
                              {getFileIcon(fileType)}
                              <p className="mt-2 text-sm font-medium text-gray-900">
                                {file.name}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {fileType
                                  ? fileType.charAt(0).toUpperCase() +
                                    fileType.slice(1)
                                  : ""}{" "}
                                - {(file.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </div>
                          )}
                          <button
                            type="button"
                            onClick={() => {
                              setFile(null);
                              setFilePreview(null);
                              setFileType("");
                            }}
                            className="text-sm text-red-600 hover:text-red-800"
                          >
                            Supprimer le fichier
                          </button>
                        </div>
                      ) : (
                        <>
                          <svg
                            className="mx-auto h-12 w-12 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                            />
                          </svg>
                          <div className="flex flex-col items-center text-sm text-gray-600">
                            <label
                              htmlFor="file-upload"
                              className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                            >
                              <span>Télécharger un fichier</span>
                              <input
                                id="file-upload"
                                name="file"
                                type="file"
                                accept={getFileAcceptTypes()}
                                className="sr-only"
                                onChange={handleFileChange}
                                required
                              />
                            </label>
                            <p className="mt-1">ou glisser-déposer</p>
                          </div>
                          <p className="text-xs text-gray-500">
                            Images, vidéos, audio, documents jusqu'à 10MB
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {fileType && (
                  <div className="p-3 bg-gray-50 rounded-md">
                    <p className="text-sm font-medium text-gray-700">
                      Type de fichier détecté:
                    </p>
                    <p className="text-sm text-gray-600 capitalize">
                      {fileType === "image"
                        ? "Image"
                        : fileType === "video"
                        ? "Vidéo"
                        : fileType === "audio"
                        ? "Audio"
                        : fileType === "document"
                        ? "Document"
                        : fileType}
                    </p>
                  </div>
                )}

                <div className="pt-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="isMemberOnly"
                      checked={formData.isMemberOnly}
                      onChange={handleInputChange}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <span className="text-sm font-medium text-gray-700">
                        Réservé aux membres uniquement
                      </span>
                      <p className="text-xs text-gray-500 mt-1">
                        Seuls les membres connectés pourront voir ce média
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Right column - Form fields */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Titre *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Titre du média"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Description du média (optionnel)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags
                  </label>
                  <div className="flex space-x-2 mb-2">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Ajouter un tag (ex: événement, logo, conférence)"
                    />
                    <button
                      type="button"
                      onClick={handleAddTag}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                    >
                      Ajouter
                    </button>
                  </div>

                  {formData.tags.length > 0 ? (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(tag)}
                            className="ml-2 text-blue-600 hover:text-blue-800 text-lg"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-500 mt-1">
                      Ajoutez des tags pour mieux organiser vos médias
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                disabled={loading}
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-800 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 min-w-[150px] justify-center"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    <span>Envoi en cours...</span>
                  </>
                ) : (
                  <>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>Ajouter le média</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
