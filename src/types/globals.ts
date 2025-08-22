import { Image } from '@/types/annotation';

export interface CustomSnackBarProps {
    msg: string;
    isSuccess: boolean;
}

export interface FooterImgCarrouselProps {
  images: Image[];
  onImageClick: (index: number) => void;
}