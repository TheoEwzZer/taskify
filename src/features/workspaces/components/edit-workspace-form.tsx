"use client";

import { DottedSeparator } from "@/components/dotted-separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeftIcon, CopyIcon, ImageIcon } from "lucide-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ReactElement, RefObject, useRef } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useConfirm } from "../../../hooks/use-confirm";
import { useDeleteWorkspace } from "../api/use-delete-workspace";
import { useResetInviteCode } from "../api/use-reset-invite-code";
import { useUpdateWorkspace } from "../api/use-update-workspace";
import { updateWorkspaceSchema } from "../schemas";
import { Workspace } from "../types";

interface EditWorkspaceFormProps {
  onCancel?: () => void;
  initialValues: Workspace;
}

export const EditWorkspaceForm: ({
  onCancel,
  initialValues,
}: EditWorkspaceFormProps) => ReactElement = ({
  onCancel,
  initialValues,
}: EditWorkspaceFormProps): ReactElement => {
  const router: AppRouterInstance = useRouter();
  const { mutate, isPending } = useUpdateWorkspace();
  const { mutate: deleteWorkspace, isPending: isDeletingWorkspace } =
    useDeleteWorkspace();
  const { mutate: resetInviteCode, isPending: isResettingInviteCode } =
    useResetInviteCode();

  const [DeleteDialog, confirmDelete] = useConfirm(
    "Delete Workspace",
    "This action cannot be undone.",
    "destructive"
  );
  const [ResetDialog, confirmResetInviteCode] = useConfirm(
    "Reset Invite Code",
    "This action will invalidate the current invite code.",
    "destructive"
  );

  const inputRef: RefObject<HTMLInputElement> = useRef<HTMLInputElement>(null);

  const form: UseFormReturn<
    z.infer<typeof updateWorkspaceSchema>,
    any,
    undefined
  > = useForm<z.infer<typeof updateWorkspaceSchema>>({
    resolver: zodResolver(updateWorkspaceSchema),
    defaultValues: {
      ...initialValues,
      image: initialValues.imageUrl ?? "",
    },
  });

  const handleDelete: () => Promise<void> = async (): Promise<void> => {
    const ok: unknown = await confirmDelete();

    if (!ok) {
      return;
    }

    deleteWorkspace(
      { param: { workspaceId: initialValues.$id } },
      {
        onSuccess: (): void => {
          window.location.href = "/";
        },
      }
    );
  };

  const handleResetInviteCode: () => Promise<void> =
    async (): Promise<void> => {
      const ok: unknown = await confirmResetInviteCode();

      if (!ok) {
        return;
      }

      resetInviteCode(
        { param: { workspaceId: initialValues.$id } },
        {
          onSuccess: (): void => {
            router.refresh();
          },
        }
      );
    };

  const onSubmit: (values: z.infer<typeof updateWorkspaceSchema>) => void = (
    values: z.infer<typeof updateWorkspaceSchema>
  ): void => {
    const finalValues = {
      ...values,
      image: values.image instanceof File ? values.image : "",
    };

    mutate(
      { form: finalValues, param: { workspaceId: initialValues.$id } },
      {
        onSuccess: (): void => {
          form.reset();
        },
      }
    );
  };

  const handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const file: File | undefined = e.target.files?.[0];

    if (file) {
      form.setValue("image", file);
    }
  };

  const fullInviteLink: string = `${window.location.origin}/workspaces/${initialValues.$id}/join/${initialValues.inviteCode}`;

  const handleCopyInviteLink: () => void = (): void => {
    navigator.clipboard
      .writeText(fullInviteLink)
      .then((): string | number =>
        toast.success("Invite link copied to clipboard")
      );
  };

  return (
    <div className="flex flex-col gap-y-4">
      <DeleteDialog />
      <ResetDialog />
      <Card className="h-full w-full border-none shadow-none">
        <CardHeader className="flex flex-row items-center gap-x-4 space-y-0 p-7">
          <Button
            size="sm"
            variant="secondary"
            onClick={
              onCancel ||
              ((): void => router.push(`/workspaces/${initialValues.$id}`))
            }
          >
            <ArrowLeftIcon className="mr-1 size-4" />
            Back
          </Button>
          <CardTitle className="text-xl font-bold">
            {initialValues.name}
          </CardTitle>
        </CardHeader>
        <div className="px-7">
          <DottedSeparator />
        </div>
        <CardContent className="p-7">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Workspace Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter workspace name"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <div className="flex flex-col gap-y-2">
                      <div className="flex items-center gap-x-5">
                        {field.value ? (
                          <div className="relative size-[72px] overflow-hidden rounded-md">
                            <Image
                              alt="Workspace Image"
                              fill
                              className="object-cover"
                              src={
                                field.value instanceof File
                                  ? URL.createObjectURL(field.value)
                                  : field.value
                              }
                            />
                          </div>
                        ) : (
                          <Avatar className="size-[72px]">
                            <AvatarFallback>
                              <ImageIcon className="size-[36px] text-neutral-400" />
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div className="flex flex-col">
                          <p className="text-sm">Workspace Icon</p>
                          <p className="text-sm text-muted-foreground">
                            JPG, PNG, SVG or JPEG, max 1MB
                          </p>
                          <input
                            className="hidden"
                            accept=".jpg, .png, .svg, .jpeg"
                            ref={inputRef}
                            disabled={isPending}
                            onChange={handleImageChange}
                            type="file"
                          />
                          {field.value ? (
                            <Button
                              type="button"
                              size="xs"
                              variant="destructive"
                              className="mt-2 w-fit"
                              disabled={isPending}
                              onClick={(): void => {
                                field.onChange(null);
                                if (inputRef.current) {
                                  inputRef.current.value = "";
                                }
                              }}
                            >
                              Remove Image
                            </Button>
                          ) : (
                            <Button
                              type="button"
                              size="xs"
                              variant="teritary"
                              className="mt-2 w-fit"
                              disabled={isPending}
                              onClick={(): void => inputRef.current?.click()}
                            >
                              Change Image
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                />
              </div>
              <DottedSeparator className="py-7" />
              <div className="flex items-center justify-between">
                <Button
                  type="button"
                  size="lg"
                  variant="secondary"
                  onClick={onCancel}
                  disabled={isPending}
                  className={cn(!onCancel && "invisible")}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="lg"
                  disabled={isPending}
                >
                  Save Changes
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      <Card className="h-full w-full border-none shadow-none">
        <CardContent className="p-7">
          <div className="flex flex-col">
            <h3 className="font-bold">Invite Members</h3>
            <p className="text-sm text-muted-foreground">
              Use the invite link to add members to your workspace.
            </p>
            <div className="mt-4">
              <div className="flex items-center gap-x-2">
                <Input
                  disabled
                  value={fullInviteLink}
                />
                <Button
                  onClick={handleCopyInviteLink}
                  variant="secondary"
                  className="size-12"
                >
                  <CopyIcon className="size-5" />
                </Button>
              </div>
            </div>
            <DottedSeparator className="py-7" />
            <Button
              className="ml-auto mt-6 w-fit"
              size="sm"
              variant="destructive"
              type="button"
              disabled={isPending || isResettingInviteCode}
              onClick={handleResetInviteCode}
            >
              Reset invite link
            </Button>
          </div>
        </CardContent>
      </Card>
      <Card className="h-full w-full border-none shadow-none">
        <CardContent className="p-7">
          <div className="flex flex-col">
            <h3 className="font-bold">Danger Zone</h3>
            <p className="text-sm text-muted-foreground">
              Deleting a workspace is irreversible and will remove all
              associated data.
            </p>
            <DottedSeparator className="py-7" />
            <Button
              className="ml-auto mt-6 w-fit"
              size="sm"
              variant="destructive"
              type="button"
              disabled={isPending || isDeletingWorkspace}
              onClick={handleDelete}
            >
              Delete Workspace
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
