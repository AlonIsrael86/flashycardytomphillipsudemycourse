"use client";

import { PricingTable } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

export function PricingTableClient() {
  return (
    <PricingTable
      checkoutProps={{
        appearance: {
          baseTheme: dark,
          variables: {
            colorBackground: "#000000",
            colorInputBackground: "#18181b",
            colorInputText: "#ffffff",
            colorText: "#ffffff",
            colorTextSecondary: "#a1a1aa",
            borderRadius: "0.625rem",
          },
        },
      }}
      newSubscriptionRedirectUrl="/dashboard"
    />
  );
}
