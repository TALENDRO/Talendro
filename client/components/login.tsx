"use client";

import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { auth } from "@/firebase";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import Register from "./register";
import { useAuth } from "@/context/authContext";
import clsx from "clsx";

function Login({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setisRegister] = useState(false);
  const [authenticating, setAuthenticating] = useState(false);

  const { signup, login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || password.length < 6) {
      return;
    }
    setAuthenticating(true);
    try {
      /////
      if (isRegister) {
        console.log("sign successfull");
        await signup(email, password);
      } else {
        console.log("sign fail");
        await login(email, password);
      }

      //////
      await signInWithEmailAndPassword(auth, email, password);
      console.log("User logged in Successfully");
      toast.success("User logged in Successfully", {
        position: "top-center",
      });
    } catch (error: any) {
      console.log(error.message);
      toast.error(error.message, {
        position: "bottom-center",
      });
    } finally {
      setAuthenticating(false);
    }
  };

  return (
    <div className={clsx("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  {/* <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a> */}
                  <Link
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                {authenticating ? "Authenticating..." : "Login"}
              </Button>
              {/* <Button variant="outline" className="w-full">
                Login with Google
              </Button> */}
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="underline underline-offset-4">
                Sign up
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default Login;

// import { signInWithEmailAndPassword } from "firebase/auth";
// import React, { useState } from "react";
// import { auth } from "@/firebase";
// import { toast } from "sonner";
// import Register from "./register";
// // import SignInwithGoogle from "./signInWIthGoogle";

// function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       await signInWithEmailAndPassword(auth, email, password);
//       console.log("User logged in Successfully");
//       //   window.location.href = "/profile";
//       toast.success("User logged in Successfully", {
//         position: "top-center",
//       });
//     } catch (error: any) {
//       console.log(error.message);

//       toast.error(error.message, {
//         position: "bottom-center",
//       });
//     }
//   };

//   function handleRegister() {
//     return <Register />;
//   }

//   return (
//     <form onSubmit={handleSubmit}>
//       <h3>Login</h3>

//       <div className="mb-3">
//         <label>Email address</label>
//         <input
//           type="email"
//           className="form-control"
//           placeholder="Enter email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//         />
//       </div>

//       <div className="mb-3">
//         <label>Password</label>
//         <input
//           type="password"
//           className="form-control"
//           placeholder="Enter password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//         />
//       </div>

//       <div className="d-grid">
//         <button type="submit" className="btn btn-primary">
//           Submit
//         </button>
//       </div>
//       <p className="forgot-password text-right">
//         {/* New user <a href="/register">Register Here</a> */}
//         <button onClick={handleRegister} className="btn btn-primary">
//           Register
//         </button>
//       </p>
//     </form>
//   );
// }

// export default Login;
