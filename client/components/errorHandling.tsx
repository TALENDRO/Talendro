import { toast } from "sonner";

export function withErrorHandling(asyncFn: any) {
  return async (...args: any) => {
    try {
      const result = await asyncFn(...args);
      toast.success("Success", { description: result });
      return result;
    } catch (error: any) {
      toast.error(error.message || "An error occurred!");
      console.error("Error:", error);
    }
  };
}
