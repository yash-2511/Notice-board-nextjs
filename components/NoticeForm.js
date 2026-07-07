import { useState, useEffect } from "react";

export default function NoticeForm({
  initialData = {},
  onSubmit,
  onCancel,
  submitLabel = "Save Notice",
  isLoading = false,
}) {
  const [title, setTitle] = useState(initialData.title || "");
  const [body, setBody] = useState(initialData.body || "");
  const [category, setCategory] = useState(initialData.category || "General");
  const [priority, setPriority] = useState(initialData.priority || "Normal");
  const [publishDate, setPublishDate] = useState("");
  const [image, setImage] = useState(initialData.image || "");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData.publishDate) {
      const date = new Date(initialData.publishDate);
      if (!isNaN(date.getTime())) {
        setPublishDate(date.toISOString().split("T")[0]);
      }
    } else {
      setPublishDate(new Date().toISOString().split("T")[0]);
    }
  }, [initialData.publishDate]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result); // Save base64 string
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImage("");
  };

  const validate = () => {
    const newErrors = {};
    if (!title.trim()) {
      newErrors.title = "Title is required";
    }
    if (!body.trim()) {
      newErrors.body = "Notice body is required";
    }
    if (!publishDate) {
      newErrors.publishDate = "Publish date is required";
    } else {
      const parsedDate = new Date(publishDate);
      if (isNaN(parsedDate.getTime())) {
        newErrors.publishDate = "Please enter a valid date";
      }
    }
    if (!["Exam", "Event", "General"].includes(category)) {
      newErrors.category = "Invalid category choice";
    }
    if (!["Normal", "Urgent"].includes(priority)) {
      newErrors.priority = "Invalid priority choice";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      title: title.trim(),
      body: body.trim(),
      category,
      priority,
      publishDate: new Date(publishDate).toISOString(),
      image: image || null,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-h-[70vh] overflow-y-auto pr-1">
      {/* Title Field */}
      <div>
        <label
          htmlFor="notice-title"
          className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5"
        >
          Title
        </label>
        <input
          id="notice-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Annual Sports Day"
          className={`w-full px-3 py-2 text-sm rounded-lg border bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-950 dark:focus:ring-zinc-100 transition-all ${
            errors.title ? "border-red-500 dark:border-red-900 focus:ring-red-500" : ""
          }`}
        />
        {errors.title && (
          <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">{errors.title}</p>
        )}
      </div>

      {/* Body Field */}
      <div>
        <label
          htmlFor="notice-body"
          className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5"
        >
          Notice Body
        </label>
        <textarea
          id="notice-body"
          rows="4"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Enter the notice description and details here..."
          className={`w-full px-3 py-2 text-sm rounded-lg border bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-950 dark:focus:ring-zinc-100 transition-all ${
            errors.body ? "border-red-500 dark:border-red-900 focus:ring-red-500" : ""
          }`}
        />
        {errors.body && (
          <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">{errors.body}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Category Field */}
        <div>
          <label
            htmlFor="notice-category"
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5"
          >
            Category
          </label>
          <select
            id="notice-category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-lg border bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-950 dark:focus:ring-zinc-100 transition-all"
          >
            <option value="General">General</option>
            <option value="Exam">Exam</option>
            <option value="Event">Event</option>
          </select>
        </div>

        {/* Priority Field */}
        <div>
          <label
            htmlFor="notice-priority"
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5"
          >
            Priority
          </label>
          <select
            id="notice-priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-lg border bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-950 dark:focus:ring-zinc-100 transition-all"
          >
            <option value="Normal">Normal</option>
            <option value="Urgent">Urgent</option>
          </select>
        </div>

        {/* Publish Date Field */}
        <div>
          <label
            htmlFor="notice-publish-date"
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5"
          >
            Publish Date
          </label>
          <input
            id="notice-publish-date"
            type="date"
            value={publishDate}
            onChange={(e) => setPublishDate(e.target.value)}
            className={`w-full px-3 py-2 text-sm rounded-lg border bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-950 dark:focus:ring-zinc-100 transition-all ${
              errors.publishDate ? "border-red-500 dark:border-red-900 focus:ring-red-500" : ""
            }`}
          />
          {errors.publishDate && (
            <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">{errors.publishDate}</p>
          )}
        </div>
      </div>

      {/* Image Upload Field */}
      <div>
        <label
          htmlFor="notice-image"
          className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5"
        >
          Attachment Image <span className="text-xs text-zinc-400 font-normal">(Optional)</span>
        </label>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <label
            htmlFor="notice-image"
            className="cursor-pointer inline-flex items-center px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-950 transition-colors"
          >
            Choose Image File
            <input
              id="notice-image"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="sr-only"
            />
          </label>
          
          {image && (
            <div className="flex items-center gap-3">
              {/* Image Preview thumbnail */}
              <div className="relative w-12 h-12 rounded-lg border border-zinc-200 dark:border-zinc-800 overflow-hidden bg-zinc-100 dark:bg-zinc-900">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image}
                  alt="Attachment Preview"
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                type="button"
                onClick={handleRemoveImage}
                className="text-xs font-medium text-red-500 hover:text-red-600 px-2 py-1"
              >
                Remove
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-200 dark:border-zinc-800">
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="px-4 py-2 text-sm font-medium rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 text-sm font-medium rounded-lg bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors disabled:opacity-50 inline-flex items-center gap-2"
        >
          {isLoading && (
            <svg
              className="animate-spin -ml-1 mr-1 h-4 w-4 text-current"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          )}
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
