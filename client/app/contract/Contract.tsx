import { useState } from "react";
import Dashboard from "@/components/Dashboard";
import IdentificationNFT from "@/components/tx/IdentificationNFT";

export default function Contract() {
  const [result, setResult] = useState("");

  function handleError(error: any) {
    const { info, message } = error;

    function toJSON(error: any) {
      try {
        const errorString = JSON.stringify(error);
        const errorJSON = JSON.parse(errorString);

        return errorJSON;
      } catch {
        return {};
      }
    }

    const { cause } = toJSON(error);
    const { failure } = cause ?? {};

    const failureCause = failure?.cause;
    const failureInfo = failureCause?.info;
    const failureMessage = failureCause?.message;

    setResult(`${failureInfo ?? failureMessage ?? info ?? message ?? error}`);
    console.error(failureCause ?? { error });
  }



  return (
    <>
      <div className="flex justify-center overflow-hidden">
        <div className="flex flex-col gap-2 overflow-hidden">

        <Dashboard onError={handleError} setActionResult={setResult} />
        <IdentificationNFT onError={handleError} setActionResult={setResult} />

          <span className="font-mono break-words whitespace-pre-wrap">{result}</span>
        </div>
      </div>
    </>
  );
}