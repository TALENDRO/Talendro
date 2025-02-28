import { NETWORK } from "@/config/lucid";
import { handleError } from "@/lib/utils";
import { toast } from "sonner";

export function withErrorHandling(asyncFn: any) {
  return async (...args: any) => {
    try {
      const result = await asyncFn(...args);
      toast.success("Success", {
        description: result,
        action: {
          label: "Open",
          onClick: () =>
            window.open(
              `https://${NETWORK == "Mainnet" ? "" : NETWORK}.cexplorer.io/tx/${result}`,
              "_blank"
            ),
        },
      });
      return result;
    } catch (error: any) {
      toast.error(error.message || "An error occurred!");
      console.error(handleError(error));
    }
  };
}
