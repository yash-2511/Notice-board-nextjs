import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  return (
    <div className={`${geistSans.variable} ${geistMono.variable} font-sans`}>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Notices</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            View and manage official announcements and notices.
          </p>
        </div>
        <div>
          <button
            disabled
            className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 opacity-50 cursor-not-allowed transition-colors"
          >
            Add Notice
          </button>
        </div>
      </div>

      {/* Info notice about database foundation */}
      <div className="my-6 p-4 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          <span className="font-semibold text-zinc-900 dark:text-zinc-100">Project Shell Ready:</span> The base layout and theme toggle are complete. Database connectivity and interactive operations will be implemented in the upcoming phases.
        </p>
      </div>

      {/* Mock Notices Grid to demonstrate UI & Themes */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4 text-zinc-700 dark:text-zinc-300">Preview: Responsive Notice Cards</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1 - Urgent Notice */}
          <div className="relative flex flex-col justify-between p-6 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm transition-all">
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800/50">
                  Urgent
                </span>
                <span className="text-xs text-zinc-500 dark:text-zinc-400">
                  {new Date().toLocaleDateString()}
                </span>
              </div>
              <h3 className="text-base font-bold text-zinc-950 dark:text-zinc-50">
                End Semester Exam Schedule
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2 line-clamp-3">
                The official timetable for the end semester examinations has been published. Please review your schedules and seating arrangements.
              </p>
            </div>
            
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800/80">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
                Exam
              </span>
              <div className="flex gap-2">
                <button disabled className="text-xs font-medium text-zinc-500 dark:text-zinc-400 opacity-50 cursor-not-allowed hover:text-zinc-900 dark:hover:text-white px-2 py-1">
                  Edit
                </button>
                <button disabled className="text-xs font-medium text-red-500 opacity-50 cursor-not-allowed hover:text-red-600 px-2 py-1">
                  Delete
                </button>
              </div>
            </div>
          </div>

          {/* Card 2 - Normal Notice */}
          <div className="relative flex flex-col justify-between p-6 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm transition-all">
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700/50">
                  Normal
                </span>
                <span className="text-xs text-zinc-500 dark:text-zinc-400">
                  {new Date().toLocaleDateString()}
                </span>
              </div>
              <h3 className="text-base font-bold text-zinc-950 dark:text-zinc-50">
                Annual Cultural Festival 2026
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2 line-clamp-3">
                Registrations are now open for the annual cultural festival. Students interested in volunteering or performing can sign up at the student center.
              </p>
            </div>
            
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800/80">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
                Event
              </span>
              <div className="flex gap-2">
                <button disabled className="text-xs font-medium text-zinc-500 dark:text-zinc-400 opacity-50 cursor-not-allowed hover:text-zinc-900 dark:hover:text-white px-2 py-1">
                  Edit
                </button>
                <button disabled className="text-xs font-medium text-red-500 opacity-50 cursor-not-allowed hover:text-red-600 px-2 py-1">
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
