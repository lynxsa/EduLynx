import * as Dialog from '@radix-ui/react-dialog';
import * as React from 'react';
import { cn } from '../lib/utils';

export interface ModalProps {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ open, onOpenChange, title, children }) => (
  <Dialog.Root open={open} onOpenChange={onOpenChange}>
    <Dialog.Overlay className="fixed inset-0 bg-black/50" />
    <Dialog.Content
      className={cn(
        'fixed top-[50%] left-[50%] w-full max-w-md -translate-x-[50%] -translate-y-[50%] rounded-lg bg-white p-6 shadow-lg'
      )}
    >
      {title && <Dialog.Title className="text-lg font-semibold mb-4">{title}</Dialog.Title>}
      {children}
      <Dialog.Close className="absolute top-4 right-4">✕</Dialog.Close>
    </Dialog.Content>
  </Dialog.Root>
);
