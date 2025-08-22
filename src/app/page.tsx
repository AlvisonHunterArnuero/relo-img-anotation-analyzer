'use client';
import ImageAnnotation from '@/src/components/ImageAnnotation';
import { Paper } from '@mui/material';

export default function Home() {
  return (
    <Paper className="pt-6 font-sans flex flex-col justify-center items-center w-full h-screen mx-auto container">
      <ImageAnnotation />
    </Paper>
  );
}
