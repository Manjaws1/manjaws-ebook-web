
import React, { useEffect } from "react";
import { Shield, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CopyrightProtectionProps {
  isOpen: boolean;
  onClose: () => void;
  contentType?: "ebook" | "image" | "general";
}

const CopyrightProtection: React.FC<CopyrightProtectionProps> = ({
  isOpen,
  onClose,
  contentType = "general"
}) => {
  
  // Disable right-click context menu
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Disable common screenshot/copy shortcuts
      if (
        (e.ctrlKey && (e.key === 'c' || e.key === 'a' || e.key === 's' || e.key === 'p')) ||
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'C' || e.key === 'J')) ||
        e.key === 'F12' ||
        e.key === 'PrintScreen'
      ) {
        e.preventDefault();
        // You could show a warning here
      }
    };

    if (isOpen) {
      document.addEventListener('contextmenu', handleContextMenu);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const getContentMessage = () => {
    switch (contentType) {
      case "ebook":
        return "This e-book is protected by copyright law. Unauthorized copying, distribution, or sharing is prohibited.";
      case "image":
        return "This image is protected by copyright. Downloading or reproducing without permission is not allowed.";
      default:
        return "This content is protected by copyright law. Please respect the author's intellectual property rights.";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Copyright Protected Content
          </DialogTitle>
          <DialogDescription className="flex flex-col gap-3">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
              <span>{getContentMessage()}</span>
            </div>
            <div className="text-sm text-gray-600">
              <p className="mb-2">This content is protected by:</p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>Digital Rights Management (DRM)</li>
                <li>Copyright protection technology</li>
                <li>Usage monitoring systems</li>
                <li>Legal enforcement mechanisms</li>
              </ul>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded p-3 text-sm">
              <strong>Notice:</strong> Any attempt to bypass these protections or illegally distribute this content may result in legal action and account termination.
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={onClose} className="bg-primary hover:bg-primary-700">
            I Understand
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CopyrightProtection;
