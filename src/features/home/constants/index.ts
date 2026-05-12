import {
  POST_TITLE,
  POST_CREATE,
  PHOTO_TITLE,
  PHOTO_CREATE,
  GALLERY_TITLE,
  GALLERY,
  THEATRE_TITLE,
  THEATRE,
} from '@/app/router/routes';
import { SquarePen, Images, Landmark, Image } from 'lucide-react';

export const HEADER_ITEMS = [
  {
    title: POST_TITLE,
    Icon: SquarePen,
    url: POST_CREATE,
  },
  {
    title: PHOTO_TITLE,
    Icon: Image,
    url: PHOTO_CREATE,
  },
  // {
  //   title: GALLERY_TITLE,
  //   Icon: Images,
  //   url: GALLERY,
  // },
  {
    title: THEATRE_TITLE,
    Icon: Landmark,
    url: THEATRE,
  },
];
