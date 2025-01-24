import React from "react";
import Client from "./client";

export default function Page() {
  return (
    <div>
      user can see his details like name username address email and option to
      stake amount (this will also mint the talendro token and stake 100ada in
      stakewallet) &nbsp;
      <Client />;
    </div>
  );
}

// export default function Page1() {

// }
