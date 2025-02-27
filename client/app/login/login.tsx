import Login from "@/components/auth/login";
import Register from "@/components/auth/register";

export default function Page() {
  return (
    <div className="flex  w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <button>
          {" "}
          <Login />{" "}
        </button>
      </div>
    </div>
  );
}
