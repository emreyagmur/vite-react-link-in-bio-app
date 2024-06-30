import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Save } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { authUserSelector } from "../auth/_store/auth";
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
import React from "react";
import { useToast } from "@/components/ui/use-toast";
import {
  IUserLink,
  userLinksActions,
  userLinksErrorSelector,
  userLinksPhaseSelector,
  userLinksSelector,
} from "./_store/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { iconList } from "./_store/data-types";
import { useParams } from "react-router-dom";

interface LinkFormProps {
  handleClose?: () => void;
  actionType: string;
}

const LinkForm: React.FC<LinkFormProps> = (props) => {
  const { actionType, handleClose } = props;
  const { id } = useParams();
  const { toast } = useToast();
  const dispatch = useDispatch();
  const userLinks = useSelector(userLinksSelector);
  const activeUser = useSelector(authUserSelector);
  const phase = useSelector(userLinksPhaseSelector);
  const phaseError = useSelector(userLinksErrorSelector);

  const userLinkInfo: IUserLink = userLinks?.find(
    (l: IUserLink) => l._id === id
  );

  const LinkFormSchema = z.object({
    title: z.string({
      required_error: "Title is required",
    }),
    url: z.string({
      required_error: "Email is required",
    }),
    userId: z.string(),
    linkType: z.string(),
    icon: z.string(),
    _id: z.string(),
  });

  const form = useForm<z.infer<typeof LinkFormSchema>>({
    resolver: zodResolver(LinkFormSchema),
    defaultValues: {
      _id: (actionType === "add" && "") || userLinkInfo?._id || "",
      title: (actionType === "add" && null) || userLinkInfo?.title || null,
      url: (actionType === "add" && null) || userLinkInfo?.url || null,
      userId: activeUser?._id,
      linkType: (actionType === "add" && "") || userLinkInfo?.linkType || "",
      icon: (actionType === "add" && "") || userLinkInfo?.icon || "",
    },
  });

  const onSubmit = (data: z.infer<typeof LinkFormSchema>) => {
    if (actionType === "add") {
      dispatch(userLinksActions.addUserLink(data));
    } else {
      dispatch(userLinksActions.updateUserLink(data));
    }
  };

  React.useEffect(() => {
    if (phase === "user-link-create-error" || phase === "update-error") {
      toast({
        title: "Error",
        description: phaseError,
        variant: "destructive",
      });
      dispatch(userLinksActions.setPhase(null, null));
    } else if (
      phase === "user-link-create-success" ||
      phase === "update-success"
    ) {
      toast({
        description: "Saved",
      });

      dispatch(userLinksActions.setPhase(null, null));
      handleClose();
    }
  }, [phase]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className=" grid grid-cols-1 gap-4 w-full items-center">
          <div className="flex flex-col space-y-1.5">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Link Title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-col space-y-1.5">
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Url</FormLabel>
                  <FormControl>
                    <Input placeholder="Link Url" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex flex-col space-y-1.5">
            <FormField
              control={form.control}
              name="icon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Icon</FormLabel>

                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a Icon" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {iconList.map((i) => (
                        <SelectItem key={i.id} value={i.iconName}>
                          {i.iconName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex flex-col space-y-1.5">
            <FormField
              control={form.control}
              name="linkType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Link Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Link Type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="link">Link</SelectItem>
                      <SelectItem value="button">Button</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className="flex flex-row gap-3 justify-between mt-4">
          {phase === "user-link-create-loading" ? (
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
  );
};

export default LinkForm;
