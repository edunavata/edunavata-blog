/// <reference types="astro/client" />

interface Window {
  __themeToggleController?: AbortController;
  __mobileMenuController?: AbortController;
  __themeSwapListenerAdded?: boolean;
  __tagsKeydown?: boolean;
  __postScrollHandler?: EventListener;
}
