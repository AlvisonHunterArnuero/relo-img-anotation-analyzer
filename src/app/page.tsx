'use client';
import ImageAnnotation from '@/src/components/ImageAnnotation';
import {
  Paper,
  ThemeProvider,
  CssBaseline,
  Box,
  Typography,
} from '@mui/material';
import theme from '../theme';

export default function Home() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box className="bg-gray-800 p-4">
        <Typography
          variant="h4"
          component="h1"
          className="text-white w-full mx-auto text-left pl-6 uppercasept-2"
        >
          Image Annotation Analyzer
        </Typography>
        <Typography
          variant="body1"
          className="text-gray-400 w-full mx-auto text-left pl-6 pt-2"
        >
          Annotate images with bounding boxes and categories.
        </Typography>
      </Box>
      <Paper className="main-page">
        <ImageAnnotation />
      </Paper>
    </ThemeProvider>
  );
}
