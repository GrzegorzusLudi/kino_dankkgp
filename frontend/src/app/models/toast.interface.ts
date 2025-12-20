export interface Toast {
  id: string;
  title: string;
  message: string;
  variant: 'info' | 'success' | 'danger';
}
