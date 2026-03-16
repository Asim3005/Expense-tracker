import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 py-4">
        <Link href="/" className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
          Finance Tracker
        </Link>
        <ul className="flex items-center gap-6">
          <li>
            <Link
              href="/"
              className="text-sm font-medium text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-50"
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              href="/transactions"
              className="text-sm font-medium text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-50"
            >
              Transactions
            </Link>
          </li>
          <li>
            <Link
              href="/analytics"
              className="text-sm font-medium text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-50"
            >
              Analytics
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
