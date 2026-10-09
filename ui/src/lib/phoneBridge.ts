/**
 * Finals Phone — lightweight bridge for developer apps.
 * Original helper for 5M Phone iframe apps (not affiliated with other phone scripts).
 */

export type PhoneBridgeMeta = {
  resource: string;
  appId: string;
  theme: 'light' | 'dark';
  host: string;
};

export function getPhoneBridgeMeta(): PhoneBridgeMeta {
  const q = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
  const theme = q.get('fpTheme') === 'light' ? 'light' : 'dark';
  return {
    resource: q.get('fpResource') || '5M_CustomApp',
    appId: q.get('fpAppId') || 'finals-demo',
    theme,
    host: q.get('fpHost') || '5M_Phone',
  };
}

/** Call a NUI callback registered on *this* resource (the developer app). */
export async function appFetch<T = unknown>(event: string, data?: Record<string, unknown>): Promise<T> {
  const { resource } = getPhoneBridgeMeta();
  const res = await fetch(`https://${resource}/${event}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=UTF-8' },
    body: JSON.stringify(data ?? {}),
  });
  const text = await res.text();
  if (!text) return {} as T;
  try {
    return JSON.parse(text) as T;
  } catch {
    return {} as T;
  }
}

type PhoneMessageHandler = (eventName: string, payload: unknown) => void;

/** Listen for pushes from exports['5M_Phone']:SendAppMessage */
export function onPhoneMessage(handler: PhoneMessageHandler): () => void {
  const listener = (e: MessageEvent) => {
    const data = e.data as {
      source?: string;
      type?: string;
      event?: string;
      payload?: unknown;
    };
    if (!data || data.source !== '5M_Phone' || data.type !== 'appMessage') return;
    if (!data.event) return;
    handler(data.event, data.payload);
  };
  window.addEventListener('message', listener);
  return () => window.removeEventListener('message', listener);
}

/** Ask the phone shell to close this app (return to home). */
export function requestCloseApp() {
  const { appId } = getPhoneBridgeMeta();
  if (window.parent && window.parent !== window) {
    window.parent.postMessage(
      { source: '5M_DeveloperApp', type: 'close', appId },
      '*',
    );
  }
}

export function applyTheme(theme: 'light' | 'dark') {
  document.documentElement.dataset.theme = theme;
}
