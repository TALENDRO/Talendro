import Login from "@/components/login";
import { LoginForm } from "@/components/login-form";
import Register from "@/components/register";

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <button>
          <Login />
        </button>
        {/* <button>
          <Register />
        </button> */}
      </div>
    </div>
  );
}
