import type GanttClass from 'frappe-gantt';
import type { Task as GanttTask } from 'frappe-gantt';
import { useCallback, useEffect, useMemo, useRef } from 'react';

export enum ViewMode {
  QuarterDay = 'Quarter Day',
  HalfDay = 'Half Day',
  Day = 'Day',
  Week = 'Week',
  Month = 'Month',
}

function getViewModeString(viewMode: ViewMode): GanttClass.viewMode {
  switch (viewMode) {
    case ViewMode.QuarterDay:
      return 'Quarter Day';
    case ViewMode.HalfDay:
      return 'Half Day';
    case ViewMode.Day:
      return 'Day';
    case ViewMode.Week:
      return 'Week';
    case ViewMode.Month:
      return 'Month';
    default:
      return 'Week';
  }
}

type Task = Pick<GanttTask, 'id' | 'name' | 'start' | 'end'>;

type Props = {
  viewMode: ViewMode;
  tasks: Task[];
  onClick: (task: Task) => void;
  onDateChange: (task: Task, start: Date, end: Date) => void;
};

export function Gantt({
  tasks,
  viewMode,
  onClick,
  onDateChange,
}: Props): JSX.Element | null {
  const gantt = useRef<GanttClass | null>(null);
  const onClickRef = useRef(onClick);
  const onDateChangeRef = useRef(onDateChange);

  useEffect(() => {
    onClickRef.current = onClick;
  }, [onClick]);

  useEffect(() => {
    onDateChangeRef.current = onDateChange;
  }, [onDateChange]);

  const mappedTasks: GanttTask[] = useMemo(
    () =>
      tasks.map((t) => {
        const mappedTask: GanttTask = {
          ...t,
          dependencies: '',
          progress: 100,
        };
        return mappedTask;
      }),
    [tasks]
  );

  const setRef = useCallback(
    (element: HTMLDivElement) => {
      if (!element) {
        return;
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const Gantt: typeof GanttClass = (window as any).Gantt;
      gantt.current = new Gantt(element, mappedTasks, {
        header_height: 50,
        column_width: 30,
        step: 24,
        view_modes: ['Quarter Day', 'Half Day', 'Day', 'Week', 'Month'],
        bar_height: 20,
        bar_corner_radius: 3,
        arrow_curve: 5,
        padding: 18,
        view_mode: getViewModeString(viewMode),
        date_format: 'YYYY-MM-DD',
        on_click(task) {
          console.log('on_click', task);
          onClickRef.current({ ...task });
        },
        on_date_change(task: GanttTask, start, end) {
          onDateChangeRef.current({ ...task }, start, end);
        },
      });
    },
    [mappedTasks, viewMode]
  );

  useEffect(() => {
    if (!gantt.current) {
      return;
    }

    gantt.current.refresh(mappedTasks);
  }, [mappedTasks, gantt]);

  if (mappedTasks.length === 0) {
    return null;
  }

  return <div ref={setRef} />;
}
