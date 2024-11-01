import { DottedSeparator } from "@/components/dotted-separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MemberAvatar } from "@/features/members/components/members-avatar";
import { snakeCaseToTitleCase } from "@/lib/utils";
import { PencilIcon } from "lucide-react";
import { ReactElement } from "react";
import { useEditTaskModal } from "../../hooks/use-edit-task-modal";
import { Task } from "../../types";
import { TaskDate } from "../task-date";
import { OverviewProperty } from "./overview-property";

interface TaskOverviewProps {
  task: Task;
}

export const TaskOverview: ({ task }: TaskOverviewProps) => ReactElement = ({
  task,
}) => {
  const { open } = useEditTaskModal();
  return (
    <div className="col-span-1 flex flex-col gap-y-4">
      <div className="rounded-lg bg-muted p-4">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">Overview</p>
          <Button
            size="sm"
            variant="secondary"
            onClick={(): Promise<URLSearchParams> => open(task.$id)}
          >
            <PencilIcon />
            Edit
          </Button>
        </div>
        <DottedSeparator className="my-4" />
        <div className="flex flex-col gap-y-4">
          {task.assignee && (
            <OverviewProperty label="Assignee">
              <MemberAvatar
                member={task.assignee}
                className="size-6"
              />
              <p className="text-sm font-medium">{task.assignee.name}</p>
            </OverviewProperty>
          )}
          <OverviewProperty label="Due Date">
            <TaskDate
              value={task.dueDate}
              className="text-sm font-medium"
            />
          </OverviewProperty>
          <OverviewProperty label="Status">
            <Badge variant={task.status}>
              {snakeCaseToTitleCase(task.status)}
            </Badge>
          </OverviewProperty>
        </div>
      </div>
    </div>
  );
};
