import { Member } from "@/features/members/types";
import { Project } from "@/features/projects/types";
import {
  addMonths,
  format,
  getDay,
  parse,
  startOfWeek,
  subMonths,
} from "date-fns";
import { enUS } from "date-fns/locale";
import { ReactElement, useState } from "react";
import { Calendar, dateFnsLocalizer, DateLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Task, TaskStatus } from "../../types";
import { CustomToolbar } from "./custom-toolbar";
import "./data-calendar.css";
import { EventCard } from "./event-card";

const locales = {
  "en-US": enUS,
};

const localizer: DateLocalizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface DataCalendarProps {
  data: Task[];
}

export const DataCalendar: ({ data }: DataCalendarProps) => ReactElement = ({
  data,
}) => {
  const [value, setValue] = useState<Date>(
    data.length ? new Date(data[0].dueDate) : new Date()
  );

  const events: {
    start: Date;
    end: Date;
    title: string;
    project: Project | undefined;
    assignee: Member | undefined;
    status: TaskStatus;
    id: string;
  }[] = data.map((task: Task) => ({
    start: new Date(task.dueDate),
    end: new Date(task.dueDate),
    title: task.name,
    project: task.project,
    assignee: task.assignee,
    status: task.status,
    id: task.$id,
  }));

  const handleNavigate: (action: "PREV" | "NEXT" | "TODAY") => void = (
    action
  ) => {
    if (action === "PREV") {
      setValue(subMonths(value, 1));
    } else if (action === "NEXT") {
      setValue(addMonths(value, 1));
    } else {
      setValue(new Date());
    }
  };

  return (
    <Calendar
      localizer={localizer}
      date={value}
      events={events}
      views={["month"]}
      defaultView="month"
      toolbar
      showAllEvents
      className="h-full"
      max={new Date(new Date().setFullYear(new Date().getFullYear() + 1))}
      formats={{
        weekdayFormat: (
          date: Date,
          culture: string | undefined,
          localizer: DateLocalizer | undefined
        ): string => localizer?.format(date, "EEEE", culture) ?? "",
      }}
      components={{
        eventWrapper: ({ event }) => (
          <EventCard
            title={event.title}
            project={event.project}
            assignee={event.assignee}
            status={event.status}
            id={event.id}
          />
        ),
        toolbar: (): ReactElement => (
          <CustomToolbar
            onNavigate={handleNavigate}
            date={value}
          />
        ),
      }}
    />
  );
};
