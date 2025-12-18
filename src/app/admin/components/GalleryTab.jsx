"use client";

import { useState, useEffect } from "react";
import GalleryItemModal from "./GalleryItemModal";
import GalleryTable from "./GalleryTable";

export default function GalleryTab({
  stats,
  showGalleryModal,
  setShowGalleryModal,
}) {
  const [galleryItems, setGalleryItems] = useState([]);
  const [galleryLoading, setGalleryLoading] = useState(false);
  const [galleryMessage, setGalleryMessage] = useState("");

  // Charger les éléments de la galerie
  useEffect(() => {
    fetchGalleryItems();
  }, []);

  const fetchGalleryItems = async () => {
    setGalleryLoading(true);
    try {
      const authToken = localStorage.getItem("authToken");

      if (!authToken) {
        throw new Error("Token d'authentification manquant");
      }

      const response = await fetch("/api/media", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Erreur lors du chargement de la galerie");
      }

      const result = await response.json();

      if (result.success) {
        console.log("Gallery items loaded:", result.data?.media?.length || 0);
        setGalleryItems(result.data.media || []);
      } else {
        throw new Error(
          result.message || "Erreur lors du chargement de la galerie"
        );
      }
    } catch (error) {
      console.error("Erreur:", error);
      setGalleryMessage(`❌ ${error.message}`);
      // Fallback data with Cloudinary URLs
      setGalleryItems([
        {
          _id: "1",
          title: "Logo de l'Association",
          description: "Logo officiel de notre association",
          imgURL: "https://res.cloudinary.com/dlr034bds/image/upload/v1/logo.jpg",
          fileUrl: "https://res.cloudinary.com/dlr034bds/image/upload/v1/logo.jpg",
          thumbnailUrl: "https://res.cloudinary.com/dlr034bds/image/upload/w_300,h_300,c_fill/v1/logo.jpg",
          fileType: "image",
          isMemberOnly: false,
          uploadedBy: "68dc23a5a4dc2af908c4f95f",
          tags: ["logo", "officiel", "association"],
          views: 1245,
          createdAt: "2024-01-15T10:30:00Z",
          updatedAt: "2024-01-15T10:30:00Z",
        },
        {
          _id: "2",
          title: "Événement de Lancement",
          description: "Photos du dernier événement de lancement",
          imgURL: "https://res.cloudinary.com/dlr034bds/image/upload/v1/event-launch.jpg",
          fileUrl: "https://res.cloudinary.com/dlr034bds/image/upload/v1/event-launch.jpg",
          thumbnailUrl: "https://res.cloudinary.com/dlr034bds/image/upload/w_300,h_300,c_fill/v1/event-launch.jpg",
          fileType: "image",
          isMemberOnly: true,
          uploadedBy: "68dc23a5a4dc2af908c4f95f",
          tags: ["événement", "lancement", "réunion"],
          views: 876,
          createdAt: "2024-02-20T14:45:00Z",
          updatedAt: "2024-02-20T14:45:00Z",
        },
        {
          _id: "3",
          title: "Atelier de Formation",
          description: "Session de formation pour les membres",
          imgURL: "https://res.cloudinary.com/dlr034bds/image/upload/v1/workshop.jpg",
          fileUrl: "https://res.cloudinary.com/dlr034bds/image/upload/v1/workshop.jpg",
          thumbnailUrl: "https://res.cloudinary.com/dlr034bds/image/upload/w_300,h_300,c_fill/v1/workshop.jpg",
          fileType: "image",
          isMemberOnly: false,
          uploadedBy: "68dc23a5a4dc2af908c4f95f",
          tags: ["formation", "atelier", "membres"],
          views: 543,
          createdAt: "2024-02-28T09:15:00Z",
          updatedAt: "2024-02-28T09:15:00Z",
        },
        {
          _id: "4",
          title: "Conférence Annuelle",
          description: "Keynote speaker lors de la conférence",
          imgURL: "https://res.cloudinary.com/dlr034bds/video/upload/v1/conference.mp4",
          fileUrl: "https://res.cloudinary.com/dlr034bds/video/upload/v1/conference.mp4",
          thumbnailUrl: "https://res.cloudinary.com/dlr034bds/video/upload/w_300,h_300,c_fill/v1/conference.jpg",
          fileType: "video",
          isMemberOnly: false,
          uploadedBy: "68dc23a5a4dc2af908c4f95f",
          tags: ["conférence", "keynote", "annuelle"],
          views: 321,
          createdAt: "2024-03-05T16:20:00Z",
          updatedAt: "2024-03-05T16:20:00Z",
        },
      ]);
    } finally {
      setGalleryLoading(false);
    }
  };

  const handleUpdateGalleryItem = async (itemId, updates) => {
    try {
      setGalleryMessage("");
      const authToken = localStorage.getItem("authToken");

      if (!authToken) {
        throw new Error("Token d'authentification manquant");
      }

      console.log("Updating item:", itemId, updates);

      // Check if this is a file update (contains Cloudinary URLs)
      const isFileUpdate = updates.imgURL && updates.fileUrl && updates.thumbnailUrl;
      
      if (isFileUpdate) {
        // For file updates - the GalleryTable has already uploaded to Cloudinary
        // updates should contain: imgURL, fileUrl, thumbnailUrl, fileType
        const updateData = {
          imgURL: updates.imgURL,
          fileUrl: updates.fileUrl,
          thumbnailUrl: updates.thumbnailUrl,
          fileType: updates.fileType
        };

        console.log("Updating file URLs:", updateData);
        
        const response = await fetch(`/api/media/${itemId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify(updateData),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.message || "Erreur lors de la mise à jour du fichier"
          );
        }

        if (result.success) {
          setGalleryMessage("✅ Fichier mis à jour avec succès !");
          // Refresh the gallery items list after a short delay
          setTimeout(() => {
            fetchGalleryItems();
          }, 1000);

          // Clear success message after 3 seconds
          setTimeout(() => {
            setGalleryMessage("");
          }, 3000);
          
          return result;
        } else {
          throw new Error(
            result.message || "Erreur lors de la mise à jour du fichier"
          );
        }
      } else {
        // For metadata updates (title, description, tags)
        const updateData = {};
        
        // Only include fields that are in the updates object
        if (updates.title !== undefined) updateData.title = updates.title;
        if (updates.description !== undefined) updateData.description = updates.description;
        if (updates.tags !== undefined) updateData.tags = updates.tags;
        
        console.log("Updating metadata:", itemId, updateData);
        
        const response = await fetch(`/api/media/${itemId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify(updateData),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.message || "Erreur lors de la mise à jour de l'élément"
          );
        }

        if (result.success) {
          setGalleryMessage("✅ Élément mis à jour avec succès !");
          // Refresh the gallery items list
          fetchGalleryItems();

          // Clear success message after 3 seconds
          setTimeout(() => {
            setGalleryMessage("");
          }, 3000);
          
          return result;
        } else {
          throw new Error(
            result.message || "Erreur lors de la mise à jour de l'élément"
          );
        }
      }
    } catch (error) {
      console.error("Erreur:", error);
      setGalleryMessage(`❌ ${error.message}`);
      throw error; // Re-throw to handle in GalleryTable
    }
  };

  const handleDeleteGalleryItem = async (itemId) => {
    if (
      !confirm(
        "Êtes-vous sûr de vouloir supprimer cet élément ? Cette action est irréversible."
      )
    ) {
      return;
    }

    try {
      setGalleryMessage("");
      const authToken = localStorage.getItem("authToken");

      if (!authToken) {
        throw new Error("Token d'authentification manquant");
      }

      const response = await fetch(`/api/media/${itemId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Erreur lors de la suppression de l'élément"
        );
      }

      if (result.success) {
        setGalleryMessage("✅ Élément supprimé avec succès !");
        fetchGalleryItems(); // Refresh the gallery items list

        // Clear success message after 3 seconds
        setTimeout(() => {
          setGalleryMessage("");
        }, 3000);
      } else {
        throw new Error(
          result.message || "Erreur lors de la suppression de l'élément"
        );
      }
    } catch (error) {
      console.error("Erreur:", error);
      setGalleryMessage(`❌ ${error.message}`);
    }
  };

  const handleToggleMemberOnlyStatus = async (itemId, currentStatus) => {
    try {
      setGalleryMessage("");
      const authToken = localStorage.getItem("authToken");

      if (!authToken) {
        throw new Error("Token d'authentification manquant");
      }

      const newStatus = !currentStatus;

      const response = await fetch(`/api/media/${itemId}/member-only`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ isMemberOnly: newStatus }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Erreur lors du changement d'accès");
      }

      if (result.success) {
        setGalleryMessage(
          `✅ Élément ${
            newStatus ? "réservé aux membres" : "rendu public"
          } avec succès !`
        );
        fetchGalleryItems(); // Refresh the gallery items list

        // Clear success message after 3 seconds
        setTimeout(() => {
          setGalleryMessage("");
        }, 3000);
      } else {
        throw new Error(result.message || "Erreur lors du changement d'accès");
      }
    } catch (error) {
      console.error("Erreur:", error);
      setGalleryMessage(`❌ ${error.message}`);
    }
  };

  const handleToggleFeaturedStatus = async (itemId, currentFeatured) => {
    try {
      setGalleryMessage("");
      const authToken = localStorage.getItem("authToken");

      if (!authToken) {
        throw new Error("Token d'authentification manquant");
      }

      const response = await fetch(`/api/media/${itemId}/featured`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ isFeatured: !currentFeatured }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Erreur lors du changement de statut vedette"
        );
      }

      if (result.success) {
        setGalleryMessage(
          `✅ Élément ${
            !currentFeatured ? "mis en vedette" : "retiré des vedettes"
          } avec succès !`
        );
        fetchGalleryItems(); // Refresh the gallery items list

        // Clear success message after 3 seconds
        setTimeout(() => {
          setGalleryMessage("");
        }, 3000);
      } else {
        throw new Error(
          result.message || "Erreur lors du changement de statut vedette"
        );
      }
    } catch (error) {
      console.error("Erreur:", error);
      setGalleryMessage(`❌ ${error.message}`);
    }
  };

  // Calculate statistics based on your data structure
  const totalItems = galleryItems.length;
  const publicItems = galleryItems.filter((item) => !item.isMemberOnly).length;
  const memberOnlyItems = galleryItems.filter(
    (item) => item.isMemberOnly
  ).length;
  const totalViews = galleryItems.reduce(
    (sum, item) => sum + (item.views || 0),
    0
  );

  // Count by file type
  const imageItems = galleryItems.filter(
    (item) => item.fileType === "image"
  ).length;
  const videoItems = galleryItems.filter(
    (item) => item.fileType === "video"
  ).length;
  const documentItems = galleryItems.filter(
    (item) => item.fileType === "document"
  ).length;
  const audioItems = galleryItems.filter(
    (item) => item.fileType === "audio"
  ).length;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Gestion de la Galerie Média</h2>
          <button
            onClick={() => setShowGalleryModal(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center space-x-2"
          >
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
                d="M12 4v16m8-8H4"
              />
            </svg>
            <span>Ajouter un média</span>
          </button>
        </div>

        {galleryMessage && (
          <div
            className={`p-4 rounded-md mb-6 ${
              galleryMessage.includes("✅")
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            <div className="flex items-center">
              {galleryMessage.includes("✅") ? (
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
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : (
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
              )}
              <span>{galleryMessage}</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="font-medium text-blue-800 text-sm">
              Total des Médias
            </h3>
            <p className="text-2xl font-bold text-blue-600">{totalItems}</p>
            <div className="mt-2 text-xs text-blue-600">
              <div className="flex justify-between">
                <span>Images:</span>
                <span>{imageItems}</span>
              </div>
              <div className="flex justify-between">
                <span>Vidéos:</span>
                <span>{videoItems}</span>
              </div>
              <div className="flex justify-between">
                <span>Documents:</span>
                <span>{documentItems}</span>
              </div>
              <div className="flex justify-between">
                <span>Audio:</span>
                <span>{audioItems}</span>
              </div>
            </div>
          </div>
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <h3 className="font-medium text-green-800 text-sm">Public</h3>
            <p className="text-2xl font-bold text-green-600">{publicItems}</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
            <h3 className="font-medium text-purple-800 text-sm">
              Membres uniquement
            </h3>
            <p className="text-2xl font-bold text-purple-600">
              {memberOnlyItems}
            </p>
          </div>
          <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
            <h3 className="font-medium text-orange-800 text-sm">
              Vues Totales
            </h3>
            <p className="text-2xl font-bold text-orange-600">
              {totalViews.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      <GalleryTable
        galleryItems={galleryItems}
        loading={galleryLoading}
        onRefresh={fetchGalleryItems}
        onUpdateGalleryItem={handleUpdateGalleryItem}
        onDeleteGalleryItem={handleDeleteGalleryItem}
        onToggleMemberOnlyStatus={handleToggleMemberOnlyStatus}
        onToggleFeaturedStatus={handleToggleFeaturedStatus}
      />

      {showGalleryModal && (
        <GalleryItemModal
          onClose={() => setShowGalleryModal(false)}
          onItemCreated={() => {
            fetchGalleryItems();
            setShowGalleryModal(false);
          }}
        />
      )}
    </div>
  );
}