import { Dialog, DialogContent } from "@/components/ui/dialog";

interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export function Modal({ open, onOpenChange, children }: ModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-transparent border-none shadow-none p-0 max-w-none">
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
}
