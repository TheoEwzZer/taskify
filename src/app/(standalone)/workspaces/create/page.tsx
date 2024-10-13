import { getCurrent } from "@/features/auth/actions";
import { CreateWorkspaceForm } from "@/features/workspaces/components/create-workspace-form";
import { redirect } from "next/navigation";
import { Models } from "node-appwrite";
import { ReactElement } from "react";

const WorkspaceCreatePage: () => Promise<ReactElement> =
  async (): Promise<ReactElement> => {
    const user: Models.User<Models.Preferences> | null = await getCurrent();

    if (!user) {
      redirect("/sign-in");
    }

    return (
      <div className="w-full lg:max-w-xl">
        <CreateWorkspaceForm />
      </div>
    );
  };

export default WorkspaceCreatePage;