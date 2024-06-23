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
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  return (
    <div className="flex w-full sm:px-4 mt-24 justify-center pt-4">
      <div className="rounded-lg-xl border bg-card text-card-foreground border-none shadow-none max-w-lg w-full h-min">
        <Card className="border-none shadow-none">
          <CardHeader>
            <CardTitle>Register</CardTitle>
            <CardDescription>Create an account</CardDescription>
          </CardHeader>
          <CardContent>
            <form>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" placeholder="Name of your project" />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="framework">Framework</Label>
                  <Input id="name" placeholder="Name of your project" />
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            <Button className="w-full">Register</Button>
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
      </div>
    </div>
  );
};

export default Register;
