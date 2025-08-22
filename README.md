# Image Annotation Analyzer

A Next.js 15 application for annotating images with bounding boxes and categories.

<img width="1266" height="970" alt="image" src="https://github.com/user-attachments/assets/2cd48880-4093-4f2f-a630-4c2193a451ed" />

## Features

- Fetch and display unanalyzed images from API
- Draw bounding boxes on images
- Select categories for annotations
- Submit or discard annotations
- Responsive UI with Material-UI and Tailwind CSS

## Prerequisites

- Node.js 18+
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd image-annotation-analyzer

Now run the development server:

```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Usage
The application will load unanalyzed images and categories automatically.

Select a category from the dropdown.

Click and drag on the image to draw a bounding box.

Click "Complete" to submit the annotation or "Discard" to skip.

The application will automatically move to the next image.


## Project Structure
src/
  app/
    globals.css
    layout.tsx
    page.tsx
  components/
    ImageAnnotation.tsx
  services/
    api.ts
  types/
    annotation.ts
  theme.ts


## Technologies Used
Next.js 15 with App Router

TypeScript

Material-UI (MUI) for UI components

Tailwind CSS 4 for styling

React Hooks for state management

## API Endpoints
GET /unanalyzed-images - Fetch images to annotate

GET /categories - Fetch available categories

POST /annotations - Submit annotations

## Notes
The application handles API errors and displays appropriate messages.

The "Complete" button is disabled until both a category and bounding box are selected.

Canvas is used to draw bounding boxes over images for better performance.


  ## Key Features Implemented

1. **Image Queue Management**: Sequential image loading and navigation
2. **Bounding Box Drawing**: Interactive drawing with mouse events
3. **Category Selection**: Dropdown with fetched categories
4. **Annotation Submission**: Complete and discard functionality
5. **Validation**: Complete button disabled until requirements met
6. **Error Handling**: API error handling with user feedback
7. **Loading States**: Visual feedback during API calls
8. **Responsive Design**: Works on different screen sizes

The implementation follows React best practices with proper separation of concerns, TypeScript for type safety, and a clean UI with Material-UI and Tailwind CSS.
