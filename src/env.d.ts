/// <reference types="astro/client" />

interface Window {
  __themeToggleController?: AbortController;
  __themeSwapListenerAdded?: boolean;
  __navSwapListenerAdded?: boolean;
  __tagsKeydown?: boolean;
  __postScrollHandler?: EventListener;
}
