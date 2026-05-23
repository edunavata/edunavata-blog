// Single source of truth for taxonomy vocabulary and display names.
// Import from here in content.config.ts and UI pages.
// To add/remove values: edit CATEGORIES or TAGS here — build fails automatically on violations.

export const CATEGORIES = ['data-engineering', 'cloud', 'linux', 'llms', 'carrera'] as const;
export type Category = (typeof CATEGORIES)[number];

export const CATEGORY_LABELS: Record<Category, { es: string; en: string }> = {
  'data-engineering': { es: 'Ingeniería de Datos', en: 'Data Engineering' },
  cloud: { es: 'Cloud', en: 'Cloud' },
  linux: { es: 'Linux', en: 'Linux' },
  llms: { es: 'LLMs', en: 'LLMs' },
  carrera: { es: 'Carrera', en: 'Career' },
};

export function getCategoryLabel(slug: Category, lang: 'es' | 'en'): string {
  return CATEGORY_LABELS[slug][lang];
}

export const TAGS = [
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

export const ORIGINS = ['ai-generated'] as const;
