import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { title, body, category, priority, publishDate, image } = req.body;

      // 1. Required fields checks
      if (!title || typeof title !== "string" || !title.trim()) {
        return res.status(400).json({ error: "Title is required and cannot be empty." });
      }
      if (!body || typeof body !== "string" || !body.trim()) {
        return res.status(400).json({ error: "Body is required and cannot be empty." });
      }
      if (!publishDate) {
        return res.status(400).json({ error: "Publish date is required." });
      }

      // 2. Enum type restrictions
      if (!category || !["Exam", "Event", "General"].includes(category)) {
        return res.status(400).json({ error: "Category must be one of: Exam, Event, General." });
      }
      if (!priority || !["Normal", "Urgent"].includes(priority)) {
        return res.status(400).json({ error: "Priority must be one of: Normal, Urgent." });
      }

      // 3. Date format validation
      const parsedDate = new Date(publishDate);
      if (isNaN(parsedDate.getTime())) {
        return res.status(400).json({ error: "Publish date must be a valid date format." });
      }

      // 4. Image type restriction (must be string if present)
      if (image && typeof image !== "string") {
        return res.status(400).json({ error: "Image must be a valid string format." });
      }

      // 5. Persistence
      const newNotice = await prisma.notice.create({
        data: {
          title: title.trim(),
          body: body.trim(),
          category,
          priority,
          publishDate: parsedDate,
          image: image ? image.trim() : null,
        },
      });

      return res.status(201).json(newNotice);
    } catch (error) {
      console.error("Database mutation error in POST /api/notices:", error);
      return res.status(500).json({ error: "Internal server error." });
    }
  } else if (req.method === "PUT") {
    try {
      const { id, title, body, category, priority, publishDate, image } = req.body;

      if (!id) {
        return res.status(400).json({ error: "Notice ID is required for updates." });
      }

      const noticeId = parseInt(id, 10);
      if (isNaN(noticeId)) {
        return res.status(400).json({ error: "Invalid notice ID format." });
      }

      // Check if notice exists
      const existingNotice = await prisma.notice.findUnique({
        where: { id: noticeId },
      });
      if (!existingNotice) {
        return res.status(404).json({ error: "Notice not found." });
      }

      // 1. Required fields checks
      if (!title || typeof title !== "string" || !title.trim()) {
        return res.status(400).json({ error: "Title is required and cannot be empty." });
      }
      if (!body || typeof body !== "string" || !body.trim()) {
        return res.status(400).json({ error: "Body is required and cannot be empty." });
      }
      if (!publishDate) {
        return res.status(400).json({ error: "Publish date is required." });
      }

      // 2. Enum type restrictions
      if (!category || !["Exam", "Event", "General"].includes(category)) {
        return res.status(400).json({ error: "Category must be one of: Exam, Event, General." });
      }
      if (!priority || !["Normal", "Urgent"].includes(priority)) {
        return res.status(400).json({ error: "Priority must be one of: Normal, Urgent." });
      }

      // 3. Date format validation
      const parsedDate = new Date(publishDate);
      if (isNaN(parsedDate.getTime())) {
        return res.status(400).json({ error: "Publish date must be a valid date format." });
      }

      // 4. Image type restriction (must be string if present)
      if (image && typeof image !== "string") {
        return res.status(400).json({ error: "Image must be a valid string format." });
      }

      // 5. Update persistence
      const updatedNotice = await prisma.notice.update({
        where: { id: noticeId },
        data: {
          title: title.trim(),
          body: body.trim(),
          category,
          priority,
          publishDate: parsedDate,
          image: image ? image.trim() : null,
        },
      });

      return res.status(200).json(updatedNotice);
    } catch (error) {
      console.error("Database mutation error in PUT /api/notices:", error);
      return res.status(500).json({ error: "Internal server error." });
    }
  } else if (req.method === "DELETE") {
    try {
      const { id } = req.query;

      if (!id) {
        return res.status(400).json({ error: "Notice ID is required for deletion." });
      }

      const noticeId = parseInt(id, 10);
      if (isNaN(noticeId)) {
        return res.status(400).json({ error: "Invalid notice ID format." });
      }

      // Check if notice exists
      const existingNotice = await prisma.notice.findUnique({
        where: { id: noticeId },
      });
      if (!existingNotice) {
        return res.status(404).json({ error: "Notice not found." });
      }

      // Delete from database
      await prisma.notice.delete({
        where: { id: noticeId },
      });

      return res.status(200).json({ message: "Notice deleted successfully." });
    } catch (error) {
      console.error("Database mutation error in DELETE /api/notices:", error);
      return res.status(500).json({ error: "Internal server error." });
    }
  } else {
    res.setHeader("Allow", ["POST", "PUT", "DELETE"]);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
