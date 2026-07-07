import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { title, body, category, priority, publishDate } = req.body;

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

      // 4. Persistence
      const newNotice = await prisma.notice.create({
        data: {
          title: title.trim(),
          body: body.trim(),
          category,
          priority,
          publishDate: parsedDate,
        },
      });

      return res.status(201).json(newNotice);
    } catch (error) {
      console.error("Database mutation error in POST /api/notices:", error);
      return res.status(500).json({ error: "Internal server error." });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
