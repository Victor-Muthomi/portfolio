import { defineCollection, z } from 'astro:content';

/**
 * Tags in the markdown frontmatter can be either:
 *   - a YAML array:           tags: ["Python", "Flask"]
 *   - a comma-separated string: tags: Python, Flask, Tutorial
 * This transform normalises both forms into string[].
 */
const tagsField = z
  .union([
    z.array(z.string()),
    z.string().transform((s) =>
      s
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)
    ),
  ])
  .optional()
  .default([]);

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    author: z.string().optional().default('Victor Muthomi'),
    tags: tagsField,
    category: z.string().optional().default('General'),
    /** Summary shown in the listing and meta-description. Falls back to `description`. */
    excerpt: z.string().optional(),
    description: z.string().optional(),
    image: z.string().optional(),
    updated_date: z.coerce.date().optional(),
  }),
});

export const collections = { blog };
