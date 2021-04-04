import type { NextPage } from 'next';
import { useMemo, useState } from 'react';

import { useProjectQuery } from '../utils/__generated__/graphql';
import { styles } from './index.css';

function isExist<T>(v: T | null | undefined): v is T {
  return v != null;
}

type Issue = {
  id: string;
  title: string;
  labels: string[];
};

type Variables = {
  org: string;
  projectNumber: number;
};

function Component(): JSX.Element {
  const [org, setOrg] = useState<string | null>(null);
  const [projectNumber, setProjectNumber] = useState<number | null>(null);
  const [variables, setVariables] = useState<Variables | null>(null);
  const { data } = useProjectQuery({
    variables: variables ?? undefined,
    skip: !variables,
  });

  const issues: Issue[] | null = useMemo(
    () =>
      data?.organization?.projectNext?.items.edges
        ?.map((edge) => {
          const content = edge?.node?.content;
          switch (content?.__typename) {
            case 'Issue':
              return {
                id: content.id,
                title: content.title,
                labels:
                  content.labels?.nodes
                    ?.map((node) => node?.name)
                    .filter(isExist) ?? [],
              };
            case 'DraftIssue':
              return {
                id: content.id,
                title: content.title,
                labels: [],
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
      <br />
      <label htmlFor="org">org</label>
      <input
        id="org"
        type="text"
        value={org ?? ''}
        onChange={(e) => setOrg(e.currentTarget.value)}
      />
      <br />
      <label htmlFor="projectNumber">projectNumber</label>
      <input
        id="projectNumber"
        type="number"
        value={projectNumber ?? ''}
        onChange={(e) => setProjectNumber(Number(e.currentTarget.value))}
      />
      <button
        type="submit"
        onClick={(e) => {
          e.preventDefault();
          setVariables(org && projectNumber ? { org, projectNumber } : null);
        }}
      >
        Search
      </button>
      {issues?.map((issue) => {
        return (
          <div key={issue.id}>
            {issue.title}: {issue.labels.join(', ')}
          </div>
        );
      })}
    </>
  );
}

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <Component />
      </main>
    </div>
  );
};

export default Home;
