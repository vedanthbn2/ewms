import dynamic from 'next/dynamic';

const UserFeedbackQueries = dynamic(() => import('./UserFeedbackQueries'), { ssr: false });

export default function UserFeedbackQueriesPage() {
  return <UserFeedbackQueries />;
}
