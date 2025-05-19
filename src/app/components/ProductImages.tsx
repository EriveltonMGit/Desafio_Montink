"use client";

import { useEffect } from "react";
import Image from "next/image";
import { useProductContext, ProductImage } from "../store/ProductContext";

function convertToEmbedUrl(url: string): string {
  if (url.includes("youtube.com/embed/")) return url;

  const regExp =
    /^.*(?:(?:youtu\.be\/)|(?:v\/)|(?:u\/\w\/)|(?:embed\/)|(?:watch\?v=|\&v=))([^#&?]*).*/;
  const match = url.match(regExp);

  const videoId = match && match[1] && match[1].length === 11 ? match[1] : null;

  return videoId
    ? `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0`
    : "https://www.youtube.com/embed/invalid-video-id";
}

export default function ProductImages() {
  const { state, dispatch } = useProductContext();
  const { product, selectedImage, loading } = state;

  useEffect(() => {
    if (selectedImage) {
      localStorage.setItem("selectedImage", JSON.stringify(selectedImage));
    }
  }, [selectedImage]);

  const handleThumbnailClick = (image: ProductImage) => {
    dispatch({ type: "SET_SELECTED_IMAGE", payload: image });
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-4 ">
        <div className="relative w-full aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-100 animate-pulse" />
        <div className="flex gap-2 overflow-x-auto pb-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="w-20 h-20 bg-gray-100 rounded-md animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (!product) {
    return <div className="text-red-500">Failed to load product images</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="relative w-full flex items-center aspect-square rounded-lg overflow-hidden border border-gray-200">
        {selectedImage ? (
          selectedImage.type === "video" ? (
            <div className="w-full h-full flex items-center justify-center bg-black">
              <iframe
                src={convertToEmbedUrl(selectedImage.url)}
                title={selectedImage.alt || "Vídeo do produto"}
                className="w-full h-[50%]"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
          <div className="relative w-full h-[60%] flex items-center justify-center bg-gray-100">
              <Image
                src={selectedImage.url || "/placeholder.svg"}
                alt={selectedImage.alt || "Imagem do produto"}
                fill
                className="object-contain"
                priority
              />
            </div>
          )
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-500">
            <span>Selecione uma mídia</span>
          </div>
        )}
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {product.images.map((image: ProductImage, index: number) => (
          <button
            key={index}
            onClick={() => handleThumbnailClick(image)}
            className={`relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden border-2 transition-all ${
              selectedImage?.url === image.url
                ? "border-emerald-500"
                : "border-gray-200 hover:border-emerald-300"
            }`}
          >
            {image.type === "video" ? (
              <div className="flex items-center justify-center bg-gray-100 text-gray-500 w-full h-full">
                🎥
              </div>
            ) : (
              <Image
                src={image.url || "/placeholder.svg"}
                alt={image.alt || `Miniatura ${index + 1}`}
                fill
                className="object-cover"
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
