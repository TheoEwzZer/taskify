import { getCurrent } from "@/features/auth/actions";
import { CreateWorkspaceForm } from "@/features/workspaces/components/create-workspace-form";
import { redirect } from "next/navigation";
import { Models } from "node-appwrite";
import { ReactElement } from "react";

export default async function Home(): Promise<ReactElement> {
  const user: Models.User<Models.Preferences> | null = await getCurrent();

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <div className="h-full bg-neutral-500 p-4">
      <CreateWorkspaceForm />
    </div>
  );
}
