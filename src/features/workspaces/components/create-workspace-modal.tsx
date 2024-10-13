"use client";

import { ResponsiveModal } from "@/components/responsive-modal";
import { useCreateWorkspaceModal } from "../hooks/use-create-workspace-modal";
import { CreateWorkspaceForm } from "./create-workspace-form";

export const CreateWorkspaceModal = () => {
  const { open, isOpen, setIsOpen, close } = useCreateWorkspaceModal();

  return (
    <ResponsiveModal
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <CreateWorkspaceForm onCancel={close} />
    </ResponsiveModal>
  );
};
