import { ToastVariant } from './toast-variant.type';

export interface ToastInput {
  title: string;
  message: string;
  variant: ToastVariant;
}
