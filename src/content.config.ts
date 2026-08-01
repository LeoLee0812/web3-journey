import { defineCollection } from 'astro:content';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';

// Starlight 文档集合：所有章节 MDX 都放在 src/content/docs 下
export const collections = {
  docs: defineCollection({ loader: docsLoader(), schema: docsSchema() }),
};
