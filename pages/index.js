import { useState } from "react";
import { useRouter } from "next/router";
import { Geist, Geist_Mono } from "next/font/google";
import prisma from "@/lib/prisma";
import NoticeForm from "@/components/NoticeForm";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home({ notices, error }) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [editingNotice, setEditingNotice] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // Deletion States
  const [deletingNoticeId, setDeletingNoticeId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  const handleFormSubmit = async (formData) => {
    setFormLoading(true);
    setSubmitError(null);
    
    const isEditing = !!editingNotice;
    const url = "/api/notices";
    const method = isEditing ? "PUT" : "POST";
    const bodyData = isEditing ? { id: editingNotice.id, ...formData } : formData;

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyData),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || `Failed to ${isEditing ? "update" : "create"} notice.`);
      }

      // Success: close form and refresh page data
      setShowForm(false);
      setEditingNotice(null);
      router.replace(router.asPath);
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteNotice = async () => {
    if (!deletingNoticeId) return;
    setDeleteLoading(true);
    setDeleteError(null);
    try {
      const response = await fetch(`/api/notices?id=${deletingNoticeId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to delete notice.");
      }

      // Success: close modal and refresh page data
      setDeletingNoticeId(null);
      router.replace(router.asPath);
    } catch (err) {
      setDeleteError(err.message);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleOpenCreateForm = () => {
    setEditingNotice(null);
    setSubmitError(null);
    setShowForm(true);
  };

  const handleOpenEditForm = (notice) => {
    setSubmitError(null);
    setEditingNotice(notice);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingNotice(null);
  };

  const handleOpenDeleteConfirm = (id) => {
    setDeleteError(null);
    setDeletingNoticeId(id);
  };

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
            onClick={handleOpenCreateForm}
            className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-950 dark:focus:ring-zinc-100"
          >
            Add Notice
          </button>
        </div>
      </div>

      {/* Reusable Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/40 backdrop-blur-sm dark:bg-black/60">
          <div className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-xl p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-zinc-100 dark:border-zinc-800/80">
              <h2 className="text-lg font-bold text-zinc-950 dark:text-zinc-50">
                {editingNotice ? "Edit Notice" : "Create New Notice"}
              </h2>
              <button
                onClick={handleCloseForm}
                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
                aria-label="Close form modal"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {submitError && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-800 dark:bg-red-950/20 dark:text-red-400 border border-red-200 dark:border-red-900/50 text-xs font-medium">
                {submitError}
              </div>
            )}

            <NoticeForm
              initialData={editingNotice || {}}
              onCancel={handleCloseForm}
              onSubmit={handleFormSubmit}
              submitLabel={editingNotice ? "Update Notice" : "Create Notice"}
              isLoading={formLoading}
            />
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingNoticeId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/40 backdrop-blur-sm dark:bg-black/60">
          <div className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-xl p-6 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-lg font-bold text-zinc-950 dark:text-zinc-50">Delete Notice</h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2">
              Are you sure you want to delete this notice? This action is permanent and cannot be undone.
            </p>

            {deleteError && (
              <div className="mt-4 p-3 rounded-lg bg-red-50 text-red-800 dark:bg-red-950/20 dark:text-red-400 border border-red-200 dark:border-red-900/50 text-xs font-medium">
                {deleteError}
              </div>
            )}

            <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800/80">
              <button
                type="button"
                onClick={() => setDeletingNoticeId(null)}
                disabled={deleteLoading}
                className="px-4 py-2 text-sm font-medium rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteNotice}
                disabled={deleteLoading}
                className="px-4 py-2 text-sm font-medium rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50 inline-flex items-center gap-2"
              >
                {deleteLoading && (
                  <svg className="animate-spin -ml-1 mr-1 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                )}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

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
                        onClick={() => handleOpenEditForm(notice)}
                        className="text-xs font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white px-2 py-1 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleOpenDeleteConfirm(notice.id)}
                        className="text-xs font-medium text-red-650 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 px-2 py-1 transition-colors"
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
