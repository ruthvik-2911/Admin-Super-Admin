import { z } from "zod"

export const adSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100, "Title is too long"),
  description: z.string().min(10, "Description must be at least 10 characters").max(500, "Description is too long"),
  type: z.enum(["Banner", "Video", "Thumbnail"]),
  mediaFile: z.any().refine((file) => file !== null && file !== undefined, "Media is required"),
  mediaUrl: z.string().optional(),
  locationMode: z.enum(["manual", "auto", "preset"]),
  latitude: z.coerce.number({ invalid_type_error: "Latitude must be a valid number" }).min(-90).max(90),
  longitude: z.coerce.number({ invalid_type_error: "Longitude must be a valid number" }).min(-180).max(180),
  radius: z.coerce.number({ invalid_type_error: "Radius must be a valid number" }).min(0.1, "Radius must be at least 0.1 KM").max(500, "Maximum radius is 500 KM")
})

export type AdFormData = z.infer<typeof adSchema>
