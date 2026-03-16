export function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-white py-6 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 text-center text-sm text-zinc-600 dark:text-zinc-400 sm:px-6 lg:px-8">
        <p>Personal Finance Tracker &copy; {new Date().getFullYear()}</p>
      </div>
    </footer>
  );
}
