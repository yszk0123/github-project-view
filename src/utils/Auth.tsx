import Image from 'next/image';
import { signIn, signOut, useSession } from 'next-auth/react';

import { styles } from './Auth.css';

type Props = {
  children: React.ReactNode;
};

export function Auth({ children }: Props): JSX.Element {
  const { data: session } = useSession();

  if (!session) {
    return (
      <>
        Not signed in <br />
        <button onClick={() => signIn()}>Sign in</button>
      </>
    );
  }

  return (
    <>
      <div className={styles.header}>
        Signed in as {session.user?.name}
        {session.user?.image ? (
          <Image
            alt={session.user?.name ?? undefined}
            height={32}
            src={session.user?.image}
            width={32}
          />
        ) : null}
        <button onClick={() => signOut()}>Sign out</button>
      </div>
      {children}
    </>
  );
}
