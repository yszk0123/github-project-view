import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useMemo } from 'react';

import { useProjectQuery } from '../../../../utils/__generated__/graphql';
import { Gantt, ViewMode } from '../../../../utils/Gantt';
import { styles } from './[project].css';

function isExist<T>(v: T | null | undefined): v is T {
  return v != null;
}

function getViewMode(viewMode: string): ViewMode {
  switch (viewMode) {
    case 'quarter':
      return ViewMode.QuarterDay;
    case 'half':
      return ViewMode.HalfDay;
    case 'day':
      return ViewMode.Day;
    case 'week':
      return ViewMode.Week;
    case 'month':
      return ViewMode.Month;
    default:
      return ViewMode.Week;
  }
}

type Issue = {
  id: string;
  title: string;
  labels: string[];
  start: string | null | undefined;
  end: string | null | undefined;
  url: string | null | undefined;
};

const noop = () => {
  /* nothing */
};

function Component(): JSX.Element {
  const router = useRouter();
  const {
    org,
    project: projectNumber,
    viewMode: viewModeString,
  } = router.query;
  const viewMode = getViewMode(String(viewModeString));
  const { data } = useProjectQuery({
    variables: {
      org: String(org),
      projectNumber: Number(projectNumber),
    },
  });

  const issues: Issue[] | null = useMemo(
    () =>
      data?.organization?.projectNext?.items.edges
        ?.map((edge) => {
          const start = edge?.node?.fieldValues.nodes?.find((node) =>
            ['Start', 'Start Date', 'StartAt'].includes(
              node?.projectField.name ?? ''
            )
          )?.value;
          const end = edge?.node?.fieldValues.nodes?.find((node) =>
            ['End', 'End Date', 'EndAt'].includes(node?.projectField.name ?? '')
          )?.value;
          const content = edge?.node?.content;
          switch (content?.__typename) {
            case 'PullRequest':
            case 'Issue':
              return {
                id: content.id,
                title: content.title,
                labels:
                  content.labels?.nodes
                    ?.map((node) => node?.name)
                    .filter(isExist) ?? [],
                start,
                end,
                url: content.url,
              };
            case 'DraftIssue':
              return {
                id: content.id,
                title: content.title,
                labels: [],
                start,
                end,
                url: undefined,
              };
            default:
              return null;
          }
        })
        .filter(isExist) ?? null,
    [data]
  );

  return (
    <>
      <Gantt
        viewMode={viewMode}
        tasks={
          issues?.map((i) => ({
            id: i.id,
            name: i.title,
            start: i.start ?? '2022-01-01',
            end: i.end ?? i.start ?? '2022-01-01',
            url: i.url,
          })) ?? []
        }
        onDateChange={noop}
        onClick={(t) => {
          const task = issues?.find((i) => i.id === t.id);
          if (!task || !task.url) return;
          window.open(task.url);
        }}
      />
    </>
  );
}

const Project: NextPage = () => {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <Component />
      </main>
    </div>
  );
};

export default Project;
