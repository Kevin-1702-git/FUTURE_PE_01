"use client";

import { Toaster } from "react-hot-toast";

export function AppToaster() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          borderRadius: "16px",
          background: "#1A1A1A",
          color: "#FFF8F0"
        }
      }}
    />
  );
}
