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
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImageIcon } from "lucide-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Models } from "node-appwrite";
import { ReactElement, RefObject, useRef } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { useCreateProject } from "../api/use-create-project";
import { createProjectSchema } from "../schemas";

interface CreateProjectFormProps {
  onCancel?: () => void;
}

export const CreateProjectForm: ({
  onCancel,
}: CreateProjectFormProps) => ReactElement = ({
  onCancel,
}: CreateProjectFormProps) => {
  const workspaceId: string = useWorkspaceId();
  const router: AppRouterInstance = useRouter();
  const { mutate, isPending } = useCreateProject();

  const inputRef: RefObject<HTMLInputElement> = useRef<HTMLInputElement>(null);

  const form: UseFormReturn<
    z.infer<typeof createProjectSchema>,
    any,
    undefined
  > = useForm<z.infer<typeof createProjectSchema>>({
    resolver: zodResolver(createProjectSchema.omit({ workspaceId: true })),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit: (values: z.infer<typeof createProjectSchema>) => void = (
    values: z.infer<typeof createProjectSchema>
  ) => {
    const finalValues = {
      ...values,
      workspaceId,
      image: values.image instanceof File ? values.image : "",
    };

    mutate(
      { form: finalValues },
      {
        onSuccess: ({ data }: { data: Models.Document }): void => {
          form.reset();
          router.push(`/workspaces/${workspaceId}/projects/${data.$id}`);
        },
      }
    );
  };

  const handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file: File | undefined = e.target.files?.[0];

    if (file) {
      form.setValue("image", file);
    }
  };

  return (
    <Card className="h-full w-full border-none shadow-none">
      <CardHeader className="flex p-7">
        <CardTitle className="text-xl font-bold">
          Create a new project
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
                    <FormLabel>Project Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter project name"
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
                            alt="Project Image"
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
                        <p className="text-sm">Project Icon</p>
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
                            onClick={() => {
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
                Create Project
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
