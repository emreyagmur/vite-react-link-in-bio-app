import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  EllipsisVertical,
  Pencil,
  Trash2,
  SquarePlus,
  Loader2,
  Save,
} from "lucide-react";
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
import nouser from "@/assets/nouser.jpg";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  userSettingActions,
  userSettingPhaseSelector,
  userSettingSelector,
  userSettingErrorSelector,
  IUserSetting,
} from "./_store/user-setting";
import { ReactSocialMediaIcons } from "react-social-media-icons";

const LinkList = () => {
  const { id, action } = useParams();
  const { toast } = useToast();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  //const { handleSubmit } = useForm();

  const activeUser = useSelector(authUserSelector);
  const userLinks = useSelector(userLinksSelector);
  const phase = useSelector(userLinksPhaseSelector);
  const phaseError = useSelector(userLinksErrorSelector);

  const userSetting = useSelector(userSettingSelector);
  const userSettingPhase = useSelector(userSettingPhaseSelector);
  const userSettingError = useSelector(userSettingErrorSelector);

  const [userImage, setUserImage] = React.useState(
    userSetting?.userAvatar || null
  );
  const [showConfirmDialog, setShowConfirmDialog] = React.useState(false);

  const handleCloseConfirm = () => {
    navigate("/links");
    setShowConfirmDialog(false);
  };

  const handleDeleteConfirm = () => {
    dispatch(userLinksActions.deleteUserLink(id));
  };

  const getBase64 = (file: any) => {
    return new Promise((resolve) => {
      let baseURL: string | ArrayBuffer = "";
      let reader = new FileReader();

      reader.readAsDataURL(file);
      reader.onload = () => {
        baseURL = reader.result;
        resolve(baseURL);
      };
    });
  };

  const handleFileSelect = (event: any) => {
    const file = event.target.files[0];

    getBase64(file)
      .then((result) => {
        file["base64"] = result;
        setUserImage(file.base64);
      })
      .catch((err) => {
        toast({
          title: "Error",
          description: err,
          variant: "destructive",
        });
      });
  };

  const UserSettingFormSchema = z.object({
    displayName: z.string({
      required_error: "Display Name is required",
    }),
    description: z.string(),
    userId: z.string(),
    userAvatar: z.string(),
    _id: z.string(),
  });

  const form = useForm<z.infer<typeof UserSettingFormSchema>>({
    resolver: zodResolver(UserSettingFormSchema),
    defaultValues: {
      userId: activeUser._id,
      _id: userSetting?._id || "",
      description: userSetting?.description || null,
      displayName: userSetting?.displayName || null,
      userAvatar: userImage || "",
    },
  });

  const onSubmitUserSetting = (data: z.infer<typeof UserSettingFormSchema>) => {
    console.log(userSetting);
    if (userSetting) {
      const newValues: Partial<IUserSetting> = Object.assign(data, {
        userAvatar: userImage,
      });
      dispatch(userSettingActions.updateUserSetting(newValues));
    } else {
      dispatch(userSettingActions.addUserSetting(data));
    }
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
    dispatch(userSettingActions.pullUserSetting(activeUser));
  }, []);

  React.useEffect(() => {
    setShowConfirmDialog(id && action === "delete" ? true : false);
  }, [id, action, phase, userLinks, showConfirmDialog, setShowConfirmDialog]);

  return (
    <React.Fragment>
      <Card className="shadow-none w-full">
        <CardContent className="w-full">
          <div className="flex flex-col items-center justify-center gap-3">
            <input
              accept="image/*"
              style={{ display: "none" }}
              id="icon-button-file"
              type="file"
              onChange={(e) => handleFileSelect(e)}
            />

            <label htmlFor="icon-button-file" className="cursor-pointer py-4">
              <img
                src={userImage || nouser}
                alt="user-background"
                className="w-20 h-20 rounded-full ring-4 ring-white object-cover"
              />
            </label>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmitUserSetting)}>
              <div className="flex flex-col gap-4 w-full">
                <div className="flex flex-col space-y-1.5">
                  <FormField
                    control={form.control}
                    name="displayName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Display Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Display Name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Input placeholder="Description" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="flex flex-row gap-3 justify-between mt-4">
                {userSettingPhase === "user-setting-loading" ? (
                  <Button disabled>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please wait
                  </Button>
                ) : (
                  <Button type="submit">
                    <Save className="mr-2 h-4 w-4" />
                    Save
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
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
                <TableHead className="w-[100px]">Icon</TableHead>
                <TableHead className="w-[100px]">Title</TableHead>
                <TableHead>Url</TableHead>
                <TableHead>Link Type</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {userLinks &&
                userLinks.map((link) => (
                  <TableRow key={link?._id}>
                    <TableCell>
                      {link?.icon ? (
                        <ReactSocialMediaIcons
                          roundness={50}
                          icon={link?.icon}
                          size="43"
                          url={null}
                        />
                      ) : null}
                    </TableCell>
                    <TableCell>{link?.title}</TableCell>
                    <TableCell>{link?.url}</TableCell>
                    <TableCell>{link?.linkType}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu modal={false}>
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
