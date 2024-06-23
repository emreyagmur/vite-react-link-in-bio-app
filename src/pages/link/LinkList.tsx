import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EllipsisVertical, Pencil, Trash2, SquarePlus } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { authUserSelector } from "../auth/_store/auth";
import React from "react";
import { useToast } from "@/components/ui/use-toast";
import {
  userLinksActions,
  userLinksErrorSelector,
  userLinksPhaseSelector,
  userLinksSelector,
} from "./_store/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate, useParams } from "react-router-dom";
import DialogBase from "@/components/DialogBase";
import LinkForm from "./LinkForm";
import ConfirmDialog from "@/components/ConfirmDialog";

const LinkList = () => {
  const { id, action } = useParams();
  const { toast } = useToast();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const activeUser = useSelector(authUserSelector);
  const userLinks = useSelector(userLinksSelector);
  const phase = useSelector(userLinksPhaseSelector);
  const phaseError = useSelector(userLinksErrorSelector);

  const [showConfirmDialog, setShowConfirmDialog] = React.useState(false);

  const handleCloseConfirm = () => {
    navigate("/links");
    setShowConfirmDialog(false);
  };

  const handleDeleteConfirm = () => {
    dispatch(userLinksActions.deleteUserLink(id));
  };

  React.useEffect(() => {
    if (phase === "delete-error") {
      toast({
        title: "Error",
        description: phaseError,
        variant: "destructive",
      });
      dispatch(userLinksActions.setPhase(null, null));
    } else if (phase === "delete-success") {
      toast({
        title: "Success",
        description: "Link delete successful",
      });
      dispatch(userLinksActions.setPhase(null, null));
    }
  }, [phase]);

  React.useEffect(() => {
    dispatch(userLinksActions.pullUserLinks(activeUser));
  }, []);

  React.useEffect(() => {
    setShowConfirmDialog(id && action === "delete" ? true : false);
  }, [id, action, phase, userLinks, showConfirmDialog, setShowConfirmDialog]);

  return (
    <React.Fragment>
      <Card className="shadow-none h-full w-ful">
        <CardHeader>
          <CardTitle className="text-xl">
            <div className="flex justify-between items-center">
              Links{" "}
              <Button onClick={() => navigate("/links/add")}>
                <SquarePlus className="mr-2 h-4 w-4" /> Ekle
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">title</TableHead>
                <TableHead>Url</TableHead>
                <TableHead>Link Type</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {userLinks &&
                userLinks.map((link) => (
                  <TableRow key={link?._id}>
                    <TableCell className="font-medium">{link?.title}</TableCell>
                    <TableCell>{link?.url}</TableCell>
                    <TableCell>{link?.linkType}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <Button variant="outline" size="icon">
                            <EllipsisVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-[100px]">
                          <DropdownMenuItem
                            onClick={() => navigate(`/links/edit/${link?._id}`)}
                            className="cursor-pointer"
                          >
                            <Pencil className="mr-2 h-4 w-4" />
                            <span>Edit</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() =>
                              navigate(`/links/delete/${link?._id}`)
                            }
                            className="cursor-pointer"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>Delete</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {action === "add" && (
        <DialogBase
          isOpen={true}
          handleClose={() => navigate("/links")}
          title="Add Link"
        >
          <LinkForm
            actionType={action}
            handleClose={() => navigate("/links")}
          />
        </DialogBase>
      )}

      {action === "edit" && (
        <DialogBase
          isOpen={true}
          handleClose={() => navigate("/links")}
          title="Edit Link"
        >
          <LinkForm
            actionType={action}
            handleClose={() => navigate("/links")}
          />
        </DialogBase>
      )}

      <ConfirmDialog
        handleClose={handleCloseConfirm}
        handleConfirm={handleDeleteConfirm}
        isOpen={showConfirmDialog}
      />
    </React.Fragment>
  );
};

export default LinkList;
