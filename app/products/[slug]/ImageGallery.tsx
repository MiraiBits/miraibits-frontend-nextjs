'use client';

import Image from 'next/image';
import { useState, useEffect, useMemo } from 'react';

interface ImageGalleryProps {
  images: string[];
  name: string;
}

export default function ImageGallery({ images, name }: ImageGalleryProps) {
  const validImages = useMemo(
    () => (images ?? []).filter((src) => typeof src === 'string' && src.trim().length > 0),
    [images]
  );
  const hasImages = validImages.length > 0;
  const [selectedImage, setSelectedImage] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const displayedImage = hasImages ? validImages[selectedImage] : null;

  const openModal = (index: number) => {
    if (!hasImages) return;
    setSelectedImage(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const nextImage = () => {
    if (!hasImages) return;
    setSelectedImage((prev) => (prev + 1) % validImages.length);
  };

  const prevImage = () => {
    if (!hasImages) return;
    setSelectedImage((prev) => (prev - 1 + validImages.length) % validImages.length);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (!hasImages && selectedImage !== 0) {
      setSelectedImage(0);
    } else if (hasImages && selectedImage >= validImages.length) {
      setSelectedImage(0);
    }
  }, [hasImages, selectedImage, validImages.length]);

  useEffect(() => {
    if (!hasImages && isModalOpen) {
      setIsModalOpen(false);
    }
  }, [hasImages, isModalOpen]);

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="aspect-video w-full overflow-hidden rounded-xl bg-gray-50 relative">
          <div
            className={`w-full h-full ${hasImages ? 'cursor-pointer' : 'cursor-default'}`}
            onClick={hasImages ? () => openModal(selectedImage) : undefined}
          >
            {displayedImage ? (
              <>
                <Image
                  src={displayedImage}
                  alt={name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  style={{ objectFit: 'contain' }}
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all flex items-center justify-center">
                  <span className="text-white text-lg font-bold opacity-0 hover:opacity-100 transition-opacity">View Gallery</span>
                </div>
              </>
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-gray-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-gray-400"
                  aria-hidden="true"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2"></rect>
                  <path d="m3 15 4-4a2 2 0 0 1 3 0l7 7"></path>
                  <path d="m14 14 1-1a2 2 0 0 1 3 0l3 3"></path>
                  <circle cx="10" cy="8" r="1"></circle>
                </svg>
                <span className="text-sm font-medium uppercase tracking-wide">No image available</span>
              </div>
            )}
          </div>

          {validImages.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prevImage(); }}
                className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-800 bg-white bg-opacity-50 rounded-full p-2 hover:bg-opacity-75"
                aria-label="Previous Image"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
              </button>

              <button
                onClick={(e) => { e.stopPropagation(); nextImage(); }}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-800 bg-white bg-opacity-50 rounded-full p-2 hover:bg-opacity-75"
                aria-label="Next Image"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
              </button>
            </>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {hasImages ? (
            validImages.map((image, index) => (
              <button
                key={index}
                className={`relative w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden border-2 ${selectedImage === index ? 'border-blue-500' : 'border-transparent'}`}
                onClick={() => setSelectedImage(index)}
              >
                <Image src={image} alt={`${name} thumbnail ${index + 1}`} fill style={{ objectFit: 'cover' }} />
              </button>
            ))
          ) : (
            <div className="w-full rounded-lg border border-dashed border-gray-200 bg-white py-6 text-center text-sm text-gray-500">
              No image available
            </div>
          )}
        </div>
      </div>

      {isModalOpen && displayedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center" onClick={closeModal}>
          <div className="relative max-w-4xl max-h-4/5" onClick={(e) => e.stopPropagation()}>
            <Image src={displayedImage} alt={name} width={1200} height={800} style={{ objectFit: 'contain', maxHeight: '80vh', width: 'auto' }} />
            
            <button onClick={closeModal} className="absolute top-2 right-2 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>

            <button onClick={prevImage} className="absolute left-2 top-1/2 -translate-y-1/2 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
            </button>

            <button onClick={nextImage} className="absolute right-2 top-1/2 -translate-y-1/2 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
