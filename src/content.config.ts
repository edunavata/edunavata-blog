import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const CATEGORIES = ['data-engineering', 'cloud', 'linux', 'llms', 'carrera'] as const;

const TAGS = [
  // Data Engineering
  'apache-spark',
  'dbt',
  'airflow',
  'kafka',
  'flink',
  'python',
  'sql',
  'data-pipelines',
  'streaming',
  'batch-processing',
  'data-quality',
  'lakehouse',
  'delta-lake',
  'iceberg',
  'duckdb',
  // Cloud
  'aws',
  'gcp',
  'azure',
  'terraform',
  'docker',
  'kubernetes',
  'iac',
  'serverless',
  'cloud-storage',
  'networking',
  // Linux
  'bash',
  'shell-scripting',
  'vim',
  'git',
  'linux-tools',
  'performance',
  'monitoring',
  'systemd',
  // LLMs
  'llm',
  'rag',
  'fine-tuning',
  'langchain',
  'prompt-engineering',
  'embeddings',
  'ollama',
  'openai-api',
  'mlops',
  // Carrera
  'aprendizaje',
  'productividad',
  'open-source',
  'entrevistas',
  'herramientas',
  // Transversales
  'tutorial',
  'referencia',
  'mejores-practicas',
  'debugging',
  'rendimiento',
] as const;

const ORIGINS = ['ai-generated'] as const;

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      date: z.coerce.date(),
      draft: z.boolean().default(false),
      slug: z.string(),
      description: z.string().min(50).max(160),
      summary: z.string().optional(),
      category: z.enum(CATEGORIES),
      tags: z.array(z.enum(TAGS)).min(3).max(5),
      origins: z.array(z.enum(ORIGINS)).optional(),
      aiModel: z.string().optional(),
      cover: z.object({ image: image(), alt: z.string() }).optional(),
      lang: z.enum(['es', 'en']).default('es'),
      author: z.string().default('Edu González'),
      updatedDate: z.coerce.date().optional(),
    }),
});

export const collections = { posts };
export { CATEGORIES, TAGS, ORIGINS };
