'use client';

import React from 'react';
import NextImage from 'next/image';
import { Box, Container } from '@mui/material';
import { FooterImgCarrouselProps } from '@/types/globals';
const FooterImgCarrousel: React.FC<FooterImgCarrouselProps> = ({
  images,
  onImageClick,
}) => {
  return (
    <Container className="absolute bottom-0 overflow-hidden w-full">
      <Box className="w-screen flex max-h-full gap-4 overflow-x-auto">
        {images.map((img, idx) => (
          <NextImage
            key={img.id}
            width={100}
            height={60}
            src={img.url}
            onClick={() => onImageClick(idx)}
            alt={`Footer Image ${img.id}`}
            className="border-2 rounded-sm border-gray-300 shadow-md hover:cursor-pointer hover:scale-90 transform duration-500 ease-in-out"
          />
        ))}
      </Box>
    </Container>
  );
};

export default FooterImgCarrousel;
