import { PageLoader } from '@tecbunny/admin-ui';

export default function ManagementLoading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <PageLoader />
    </div>
  );
}
