import { ToastVariant } from './toast-variant.type';

export interface Toast {
  id: string;
  title: string;
  message: string;
  variant: ToastVariant;
}
