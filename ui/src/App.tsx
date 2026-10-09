import { useEffect, useState } from 'react';
import {
  appFetch,
  getPhoneBridgeMeta,
  onPhoneMessage,
  requestCloseApp,
} from './lib/phoneBridge';

type Snapshot = {
  ok?: boolean;
  name?: string;
  serverId?: number;
  heading?: number;
  coords?: { x: number; y: number; z: number };
};

export function App() {
  const meta = getPhoneBridgeMeta();
  const [snap, setSnap] = useState<Snapshot | null>(null);
  const [liveHeading, setLiveHeading] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    void (async () => {
      try {
        const data = await appFetch<Snapshot>('getPlayerSnapshot');
        if (alive) setSnap(data);
      } catch {
        if (alive) setError('Could not load player data. Are you in-game?');
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    return onPhoneMessage((eventName, payload) => {
      if (eventName !== 'heading') return;
      const degrees = (payload as { degrees?: number } | null)?.degrees;
      if (typeof degrees === 'number') setLiveHeading(degrees);
    });
  }, []);

  const heading = liveHeading ?? (typeof snap?.heading === 'number' ? Math.floor(snap.heading) : null);

  return (
    <div className="demo">
      <header className="demo__top">
        <div>
          <p className="demo__eyebrow">5M Phone · Developer app</p>
          <h1 className="demo__title">{meta.appId}</h1>
        </div>
        <button type="button" className="demo__close" onClick={requestCloseApp}>
          Close
        </button>
      </header>

      <section className="demo__card">
        <h2>Player</h2>
        {error ? <p className="demo__err">{error}</p> : null}
        <dl className="demo__grid">
          <div>
            <dt>Name</dt>
            <dd>{snap?.name ?? '—'}</dd>
          </div>
          <div>
            <dt>Server ID</dt>
            <dd>{snap?.serverId ?? '—'}</dd>
          </div>
          <div>
            <dt>Heading</dt>
            <dd>{heading != null ? `${heading}°` : '—'}</dd>
          </div>
        </dl>
      </section>

      <section className="demo__card">
        <h2>Bridge tips</h2>
        <ul>
          <li>
            Load data with <code>appFetch('eventName')</code>
          </li>
          <li>
            Receive pushes via <code>onPhoneMessage</code>
          </li>
          <li>
            Register with <code>exports['5M_Phone']:RegisterApp</code>
          </li>
        </ul>
      </section>
    </div>
  );
}
