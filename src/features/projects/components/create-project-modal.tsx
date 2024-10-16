"use client";

import { ResponsiveModal } from "@/components/responsive-modal";
import { ReactElement } from "react";
import { useCreateProjectModal } from "../hooks/use-create-project-modal";
import { CreateProjectForm } from "./create-project-form";

export const CreateProjectModal: () => ReactElement = (): ReactElement => {
  const { isOpen, setIsOpen, close } = useCreateProjectModal();

  return (
    <ResponsiveModal
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <CreateProjectForm onCancel={close} />
    </ResponsiveModal>
  );
};
