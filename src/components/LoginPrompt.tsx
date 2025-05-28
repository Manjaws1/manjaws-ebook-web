
import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { LogIn } from "lucide-react";

interface LoginPromptProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;
}

const LoginPrompt: React.FC<LoginPromptProps> = ({ isOpen, onClose, onLogin }) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <LogIn className="h-5 w-5" />
            Login Required
          </AlertDialogTitle>
          <AlertDialogDescription>
            You need to be logged in to access this page. Please log in to continue.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onLogin}>
            Go to Login
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default LoginPrompt;
