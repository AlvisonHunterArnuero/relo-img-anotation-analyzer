export interface Image {
    id: number;
    url: string;
    width: number;
    height: number;
}

export interface Category {
    id: number;
    name: string;
}

export interface BoundingBox {
    topLeftX: number;
    topLeftY: number;
    width: number;
    height: number;
}

export interface AnnotationData {
    categoryId: number;
    boundingBoxes: BoundingBox[];
}

export interface AnnotationRequest {
    imageId: number;
    annotations: AnnotationData[];
}

export interface CategoryListProps {
  categories: Category[];
  selectedId?: Category['id'];
  handleCategoryChange: (id: Category['id']) => void;
  label?: string;
  useAsFormField?: boolean;
}