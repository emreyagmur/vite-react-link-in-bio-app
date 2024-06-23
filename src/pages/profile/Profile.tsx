import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader2, Save } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  authActions,
  authErrorSelector,
  authPhaseSelector,
  authUserSelector,
} from "../auth/_store/auth";
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

const Profile = () => {
  const { toast } = useToast();
  const dispatch = useDispatch();
  const activeUser = useSelector(authUserSelector);
  const authPhase = useSelector(authPhaseSelector);
  const authError = useSelector(authErrorSelector);

  const ProfileFormSchema = z.object({
    name: z
      .string({
        required_error: "Name Lastname is required",
      })
      .min(3, {
        message: "E-mail must be at least 2 characters.",
      }),
    email: z
      .string({
        required_error: "Email is required",
      })
      .email(),
    username: z
      .string({
        required_error: "Username is required",
      })
      .min(4, {
        message: "Password must be at least 6 characters.",
      }),
    _id: z.string(),
  });

  const form = useForm<z.infer<typeof ProfileFormSchema>>({
    resolver: zodResolver(ProfileFormSchema),
    defaultValues: {
      name: activeUser?.name,
      email: activeUser?.email,
      username: activeUser?.username,
      _id: activeUser?._id,
    },
  });

  const onSubmit = (data: z.infer<typeof ProfileFormSchema>) => {
    console.log(data);
    dispatch(authActions.updateUser(data));
  };

  React.useEffect(() => {
    if (authPhase === "user-updating-error") {
      toast({
        title: "Error",
        description: authError,
        variant: "destructive",
      });
    } else if (authPhase === "user-updating-success") {
      toast({
        title: "Success",
        description: "User update successful",
      });
    }

    dispatch(authActions.setPhase(null, null));
  }, [authPhase]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card className="shadow-none h-full w-ful">
          <CardHeader>
            <CardTitle className="text-xl">Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <form>
              <div className=" grid md:grid-cols-2 grid-cols-1 gap-4 w-full items-center">
                <div className="flex flex-col space-y-1.5">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name Lastname</FormLabel>
                        <FormControl>
                          <Input placeholder="Name Lastname" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>E-mail</FormLabel>
                        <FormControl>
                          <Input placeholder="E-mail" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="flex flex-col mt-3 space-y-1.5">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="Username" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex flex-row gap-3 justify-between">
            {authPhase === "user-updating" ? (
              <Button disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button>
                <Save className="mr-2 h-4 w-4" />
                Save
              </Button>
            )}
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};

export default Profile;
