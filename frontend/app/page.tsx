import { DashboardContent } from "@/components/DashboardContent";

export default function Home() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h2 className="mb-6 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
        Dashboard
      </h2>
      <DashboardContent />
    </div>
  );
}
