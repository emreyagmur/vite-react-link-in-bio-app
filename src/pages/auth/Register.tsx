import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import {
  authAccessTokenSelector,
  authActions,
  authErrorSelector,
  authPhaseSelector,
  authUserSelector,
} from "./_store/auth";
import { useDispatch, useSelector } from "react-redux";
import useAuth from "@/hooks/useAuth";
import React from "react";
import { Icons } from "@/store/types";
import { LogIn } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const RegisterSchema = z.object({
  email: z.string().email().min(2, {
    message: "E-mail must be at least 2 characters.",
  }),
  name: z.string().min(3, {
    message: "Name & Lastname must be at least 3 characters.",
  }),
  username: z.string().trim().min(4, {
    message: "Username must be at least 4 characters.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { toast } = useToast();

  const accessToken = useSelector(authAccessTokenSelector);
  const activeUser = useSelector(authUserSelector);
  const authPhase = useSelector(authPhaseSelector);
  const authError = useSelector(authErrorSelector);

  const { login } = useAuth();

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      name: "",
      username: "",
      password: "",
    },
  });

  const onSubmit = (data: z.infer<typeof RegisterSchema>) => {
    dispatch(
      authActions.register(data.name, data.username, data.email, data.password)
    );
  };

  React.useEffect(() => {
    if (accessToken && activeUser && authPhase === "success") {
      // Login the user to the context
      login(accessToken, activeUser);

      setTimeout(() => {
        navigate("/dashboard");
      }, 500);
    }
  }, [accessToken, activeUser, authPhase]);

  React.useEffect(() => {
    if (authPhase === "register-error") {
      toast({
        title: "Error",
        description: authError,
        variant: "destructive",
      });
      dispatch(authActions.setPhase(null, null));
    }
  }, [authPhase]);

  return (
    <div className="flex w-full h-full sm:px-4 justify-center items-center pt-4 mt-16">
      <div className="rounded-lg-xl border bg-card text-card-foreground border-none shadow-none max-w-lg w-full h-min">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Card className="border-none shadow-none">
              <CardHeader>
                <CardTitle>Register</CardTitle>
                <CardDescription>Create an account</CardDescription>
              </CardHeader>
              <CardContent className="gap-4">
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-2 mb-5">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name & Lastname</FormLabel>
                          <FormControl>
                            <Input placeholder="Name & Lastname" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-2 mb-5">
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
                </div>
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-2 mb-5">
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
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-2 mb-5">
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="Password"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-3">
                {authPhase === "loading" ? (
                  <Button className="w-full" disabled>
                    <Icons.spinner className="h-4 w-4 animate-spin ml-3" />
                  </Button>
                ) : (
                  <Button className="w-full">
                    <LogIn className="mr-2 h-4 w-4" />
                    Register
                  </Button>
                )}
                <p>
                  Already have an account?{" "}
                  <span
                    onClick={() => navigate("/login")}
                    className="text-primary cursor-pointer"
                  >
                    Login
                  </span>
                </p>
              </CardFooter>
            </Card>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Register;
