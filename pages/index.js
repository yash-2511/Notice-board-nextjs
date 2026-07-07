import { Geist, Geist_Mono } from "next/font/google";
import prisma from "@/lib/prisma";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home({ notices, error }) {
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

      {/* Error State Banner */}
      {error && (
        <div className="mt-6 p-4 rounded-lg bg-red-50 text-red-800 dark:bg-red-950/20 dark:text-red-400 border border-red-200 dark:border-red-900/50">
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {/* Listings */}
      {!error && (
        <>
          {notices.length === 0 ? (
            /* Empty State */
            <div className="text-center py-16 px-4 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 shadow-sm mt-8">
              <svg
                className="w-12 h-12 text-zinc-400 mx-auto mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-.586-1.414l-4.5-4.5A2 2 0 0013.086 3H10"
                />
              </svg>
              <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">No notices found</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1 max-w-xs mx-auto">
                There are currently no announcements. Check back later for updates.
              </p>
            </div>
          ) : (
            /* Grid of Notices */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              {notices.map((notice) => (
                <div
                  key={notice.id}
                  className="relative flex flex-col justify-between p-6 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm transition-all hover:shadow-md"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      {notice.priority === "Urgent" ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800/50">
                          Urgent
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-350 border border-zinc-200 dark:border-zinc-700/50">
                          Normal
                        </span>
                      )}
                      <span className="text-xs text-zinc-500 dark:text-zinc-400">
                        {new Date(notice.publishDate).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-zinc-950 dark:text-zinc-50 leading-snug">
                      {notice.title}
                    </h3>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2 whitespace-pre-wrap">
                      {notice.body}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800/80">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200 border border-zinc-200/50 dark:border-zinc-700/40">
                      {notice.category}
                    </span>
                    <div className="flex gap-2">
                      <button
                        disabled
                        className="text-xs font-medium text-zinc-500 dark:text-zinc-400 opacity-50 cursor-not-allowed hover:text-zinc-900 dark:hover:text-white px-2 py-1"
                      >
                        Edit
                      </button>
                      <button
                        disabled
                        className="text-xs font-medium text-red-500 opacity-50 cursor-not-allowed hover:text-red-600 px-2 py-1"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export async function getServerSideProps() {
  try {
    const notices = await prisma.notice.findMany({
      orderBy: [
        { priority: "desc" }, // Enforces 'Urgent' before 'Normal' in the SQL query
        { publishDate: "desc" }, // Secondary order: newest first
      ],
    });

    // Serialize date fields to avoid SSR hydration issues
    const serializedNotices = notices.map((notice) => ({
      ...notice,
      publishDate: notice.publishDate.toISOString(),
      createdAt: notice.createdAt.toISOString(),
      updatedAt: notice.updatedAt.toISOString(),
    }));

    return {
      props: {
        notices: serializedNotices,
      },
    };
  } catch (error) {
    console.error("Error in getServerSideProps:", error);
    return {
      props: {
        notices: [],
        error: "Failed to fetch notices from database.",
      },
    };
  }
}
