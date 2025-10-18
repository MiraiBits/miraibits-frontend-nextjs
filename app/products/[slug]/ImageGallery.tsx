'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';

interface ImageGalleryProps {
  images: string[];
  name: string;
}

export default function ImageGallery({ images, name }: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (index: number) => {
    setSelectedImage(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + images.length) % images.length);
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

  return (
    <>
      <div className="flex flex-col-reverse md:flex-row gap-4">
        <div className="flex flex-wrap md:flex-col gap-2">
          {images.map((image, index) => (
            <button
              key={index}
              className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 ${selectedImage === index ? 'border-blue-500' : 'border-transparent'}`}
              onClick={() => setSelectedImage(index)}
            >
              <Image src={image} alt={`${name} thumbnail ${index + 1}`} fill style={{ objectFit: 'cover' }} />
            </button>
          ))}
        </div>
        <div className="aspect-video w-full overflow-hidden rounded-xl bg-gray-50 relative">
          <div className="w-full h-full cursor-pointer" onClick={() => openModal(selectedImage)}>
            <Image src={images[selectedImage]} alt={name} fill sizes="(max-width: 768px) 100vw, 50vw" style={{ objectFit: 'contain' }} />
            <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all flex items-center justify-center">
              <span className="text-white text-lg font-bold opacity-0 hover:opacity-100 transition-opacity">View Gallery</span>
            </div>
          </div>

          {images.length > 1 && (
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
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center" onClick={closeModal}>
          <div className="relative max-w-4xl max-h-4/5" onClick={(e) => e.stopPropagation()}>
            <Image src={images[selectedImage]} alt={name} width={1200} height={800} style={{ objectFit: 'contain', maxHeight: '80vh', width: 'auto' }} />
            
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