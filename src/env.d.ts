/// <reference types="astro/client" />

interface Window {
  __themeToggleController?: AbortController;
  __mobileMenuController?: AbortController;
  __themeSwapListenerAdded?: boolean;
  __tagsKeydown?: boolean;
  __postScrollHandler?: EventListener;
  __searchController?: AbortController;
  // pagefind-ui.js is an IIFE that registers PagefindUI globally at runtime
  PagefindUI?: new (options: {
    element: string;
    bundlePath?: string;
    showImages?: boolean;
    language?: string;
    placeholder?: string;
  }) => void;
}
