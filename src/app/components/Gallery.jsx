"use client";

import { useEffect, useState } from "react";

const VIDEO_EXTENSIONS = ["mp4", "webm", "ogg", "mov"];
const IMAGE_EXTENSIONS = ["jpg", "jpeg", "png", "gif", "webp"];

const getFileExtension = (url = "") => {
  return url.split(".").pop()?.toLowerCase().split("?")[0];
};

const isVideoFile = (url) => {
  const ext = getFileExtension(url);
  return VIDEO_EXTENSIONS.includes(ext);
};

const Gallery = () => {
  const [galleryItems, setGalleryItems] = useState([]);
  const [galleryMessage, setGalleryMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [authToken, setAuthToken] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setAuthToken(token);

    const fetchGallery = async () => {
      try {
        const response = await fetch("/api/media", {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        });

        if (!response.ok) {
          throw new Error("Erreur lors du chargement de la galerie");
        }

        const result = await response.json();
        if (!result.success) {
          throw new Error(result.message || "Erreur serveur");
        }

        let media = result.data?.media || [];

        if (!token) {
          media = media.filter((item) => !item.isMemberOnly);
        }

        setGalleryItems(media);
      } catch (err) {
        console.error(err);
        setGalleryMessage("❌ Impossible de charger la galerie");
      } finally {
        setIsLoading(false);
      }
    };

    fetchGallery();
  }, []);

  if (isLoading) {
    return (
      <section className="py-16 px-6 bg-blue-50 text-center">
        Chargement…
      </section>
    );
  }

  return (
    <section id="gallery" className="py-16 px-6 bg-blue-50">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12 text-blue-800">
          Galerie
        </h2>

        {galleryMessage && (
          <div className="text-center mb-6 text-red-600">
            {galleryMessage}
          </div>
        )}

        {galleryItems.length === 0 ? (
          <div className="text-center text-gray-600">
            {authToken
              ? "Aucun média disponible."
              : "Connectez-vous pour voir plus de contenu."}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {galleryItems.map((item) => {
              const mediaUrl =
                item.url || item.image || item.thumbnailUrl || "";

              const isVideo = isVideoFile(mediaUrl);

              // Cloudinary desktop fix (safe even if not Cloudinary)
              const finalVideoUrl = isVideo
                ? mediaUrl.replace(
                    "/image/upload/",
                    "/video/upload/f_mp4,vc_h264,ac_aac/"
                  )
                : null;

              return (
                <div
                  key={item._id || item.id}
                  className="relative w-full pt-[100%] bg-gray-200 rounded-lg overflow-hidden"
                >
                  {item.isMemberOnly && (
                    <div className="absolute top-2 right-2 z-10 bg-blue-800 text-white text-xs px-2 py-1 rounded">
                      Membres
                    </div>
                  )}

                  {/* VIDEO */}
                  {isVideo ? (
                    <video
                      controls
                      muted
                      playsInline
                      preload="metadata"
                      crossOrigin="anonymous"
                      className="absolute inset-0 w-full h-full object-cover"
                    >
                      <source
                        src={
                          finalVideoUrl ||
                          "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
                        }
                        type="video/mp4"
                      />
                    </video>
                  ) : (
                    /* IMAGE */
                    <img
                      src={mediaUrl}
                      alt={item.title || "media"}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default Gallery;
