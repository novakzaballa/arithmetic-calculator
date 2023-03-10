import {  Navigate, useOutlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Bar } from "./Bar";

export const PrivatePage = () => {
  const { user } = useAuth();
  const outlet = useOutlet();

  if (!user) {
    return <Navigate to="/" />;
  }

  return (
    <div>
      <Bar
        pages={[
          { label: "Operations", path: "operations" },
          { label: "Records", path: "records" }
        ]}
      />
      {outlet}
    </div>
  );
};
