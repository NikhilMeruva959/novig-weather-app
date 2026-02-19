"use client"

import { SignIn } from "@clerk/nextjs";
import { useEffect } from "react";

export default function SignInPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center py-8">
        <SignIn />
      </div>
    </>
  );
}
