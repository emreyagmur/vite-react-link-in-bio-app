import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";

export interface IDialogBaseProps {
  children?: React.ReactNode;
  handleClose?: () => void;
  isOpen: boolean;
  title?: string | React.ReactElement;
  width?: number | "100%";
}

const DialogBase = (props: IDialogBaseProps) => {
  const { children, handleClose, isOpen, title, width } = props;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
};

export default DialogBase;
