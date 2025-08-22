'use client';

import React, { useState, useEffect, useRef } from 'react';

import NextImage from 'next/image';
import { Box, Button, CircularProgress, Alert } from '@mui/material';

import { Check, Close } from '@mui/icons-material';
import {
  Image,
  Category,
  BoundingBox,
  AnnotationRequest,
} from '@/types/annotation';
import {
  fetchUnanalyzedImages,
  fetchCategories,
  submitAnnotation,
} from '../services/api';
import CustomSnackBar from './CustomSnackBar';
import FooterImgCarrousel from './FooterImgCarrousel';
import CategoryList from './CategoryList';

const ImageAnnotation: React.FC = () => {
  const [images, setImages] = useState<Image[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<
    number | null
  >(null);
  const [boundingBox, setBoundingBox] = useState<BoundingBox | null>(
    null
  );
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const imageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const currentImage = images[currentImageIndex];
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [imagesData, categoriesData] = await Promise.all([
          fetchUnanalyzedImages(),
          fetchCategories(),
        ]);
        setImages(imagesData);
        setCategories(categoriesData);
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to load data'
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    const canvas = canvasRef && canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;

    if (canvas && imageRef.current) {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    // Draw bounding box
    ctx.strokeStyle = '#3f51b5';
    ctx.lineWidth = 3;
    ctx.strokeRect(
      boundingBox?.topLeftX as number,
      boundingBox?.topLeftY as number,
      boundingBox?.width as number,
      boundingBox?.height as number
    );

    // Draw label background with the clicked Category
    ctx.fillStyle = '#3f51b5';
    const text =
      categories.find((c) => c.id === selectedCategory)?.name ||
      'Object';
    const textMetrics = ctx.measureText(text);
    ctx.fillRect(
      boundingBox?.topLeftX as number,
      (boundingBox?.topLeftY as number) - 20,
      textMetrics.width + 10,
      20
    );

    // Draw label text
    ctx.fillStyle = 'white';
    ctx.font = '14px Arial';
    ctx.fillText(
      text,
      (boundingBox?.topLeftX as number) + 5,
      (boundingBox?.topLeftY as number) - 5
    );
  }, [boundingBox, currentImage, categories, selectedCategory]);

  useEffect(() => {
    if (imageRef.current && canvasRef.current) {
      const rect = imageRef.current.getBoundingClientRect();
      canvasRef.current.width = rect.width;
      canvasRef.current.height = rect.height;
    }
  }, [currentImage]);

  // Canvas Event handlers

  const handleMouseDown = (
    e: React.MouseEvent<HTMLCanvasElement>
  ) => {
    if (!imageRef.current) return;

    const rect = imageRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsDrawing(true);
    setStartPoint({ x, y });
  };

  const handleMouseMove = (
    e: React.MouseEvent<HTMLCanvasElement>
  ) => {
    if (!isDrawing || !imageRef.current) return;

    const rect = imageRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newBoundingBox = {
      topLeftX: Math.min(startPoint.x, x),
      topLeftY: Math.min(startPoint.y, y),
      width: Math.abs(x - startPoint.x),
      height: Math.abs(y - startPoint.y),
    };

    const ctx = canvasRef?.current?.getContext('2d');
    if (ctx) {
      ctx.clearRect(
        0,
        0,
        canvasRef?.current?.width as number,
        canvasRef?.current?.height as number
      );

      ctx.strokeStyle = '#3f51b5';
      ctx.lineWidth = 3;
      ctx.strokeRect(
        newBoundingBox.topLeftX,
        newBoundingBox.topLeftY,
        newBoundingBox.width,
        newBoundingBox.height
      );
    }

    setBoundingBox(newBoundingBox);
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const handleCategoryChange = (cat: number) => {
    setSelectedCategory(cat);
  };

  const handleSubmit = async (isComplete: boolean) => {
    if (!currentImage) return;

    try {
      setLoading(true);
      const annotationRequest: AnnotationRequest = {
        imageId: currentImage.id,
        annotations:
          isComplete && selectedCategory && boundingBox
            ? [
                {
                  categoryId: selectedCategory,
                  boundingBoxes: [boundingBox],
                },
              ]
            : [],
      };

      await submitAnnotation(annotationRequest);

      if (isComplete) {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          if (currentImageIndex < images.length - 1) {
            setCurrentImageIndex((prev) => prev + 1);
          } else {
            setCurrentImageIndex(0);
          }
          setSelectedCategory(null);
          setBoundingBox(null);
        }, 1000);
      } else {
        if (currentImageIndex < images.length - 1) {
          setCurrentImageIndex((prev) => prev + 1);
        } else {
          setCurrentImageIndex(0);
        }
        setSelectedCategory(null);
        setBoundingBox(null);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to submit annotation'
      );
    } finally {
      setLoading(false);
    }
  };

  const isCompleteDisabled = !selectedCategory || !boundingBox;

  if (loading && images.length === 0) {
    return (
      <Box className="flex justify-center items-center h-64">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" className="m-4">
        {error}
      </Alert>
    );
  }

  if (!currentImage) {
    return (
      <Alert severity="info" className="m-4">
        No images to analyze
      </Alert>
    );
  }

  return (
    <>
      <div className="flex w-full gap-3 justify-between items-start h-full p-4">
        <Box className="flex w-1/2 h-full overflow-hidden">
          <Box className="h-full w-full flex justify-center">
            <Box className="h-full max-h-4/5 w-full flex flex-col cursor-crosshair relative">
              <Box
                style={{
                  width: '100%',
                  height: '600px',
                  position: 'relative',
                }}
              >
                <NextImage
                  fill
                  ref={imageRef}
                  style={{ maxWidth: '100%', objectFit: 'contain' }}
                  src={currentImage.url}
                  alt="To annotate"
                  className="h-screen max-h-fit w-full border-2 cursor-pointer"
                />
                <canvas
                  ref={canvasRef}
                  className="absolute top-0 left-0 mx-auto"
                  width={800}
                  height={600}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  style={{
                    pointerEvents: 'auto',
                  }}
                />
              </Box>
            </Box>
          </Box>
        </Box>
        <Box className="flex flex-col w-1/2 h-full max-h-3/5 gap-6">
          <CategoryList
            label="Please Select Category"
            categories={categories}
            handleCategoryChange={handleCategoryChange}
          />
          <Box className="flex gap-2 items-start justify-between">
            <Button
              variant="outlined"
              color="error"
              startIcon={<Close />}
              onClick={() => handleSubmit(false)}
              disabled={loading}
            >
              Discard
            </Button>
            <Button
              variant="contained"
              color="primary"
              startIcon={<Check />}
              onClick={() => handleSubmit(true)}
              disabled={isCompleteDisabled || loading}
            >
              Complete
            </Button>
          </Box>
        </Box>
      </div>
      <FooterImgCarrousel
        images={images}
        onImageClick={setCurrentImageIndex}
      />
      <CustomSnackBar
        msg="Annotation submitted successfully!"
        isSuccess={success}
      />
    </>
  );
};

export default ImageAnnotation;
