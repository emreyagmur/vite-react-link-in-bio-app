import * as React from "react";
import { IDialogBaseProps } from "./DialogBase";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";

interface IConfirmDialogProps extends IDialogBaseProps {
  handleConfirm?: any;
}

const ConfirmDialog = (props: IConfirmDialogProps) => {
  const { handleClose, handleConfirm, isOpen } = props;
  return (
    <React.Fragment>
      <AlertDialog open={isOpen} onOpenChange={handleClose}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleClose}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </React.Fragment>
  );
};

export default ConfirmDialog;
