import { TRAILHEADS, NAV_APPS } from "@/lib/backpacking-routes";

/* Driving directions live here rather than on the overview page because the
   route you pick decides the trailhead, and the trailhead decides the alarm. */

export default function TrailheadDirections() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-2">
        {TRAILHEADS.map((t) => (
          <div key={t.id} className="soft-card dark:soft-card-dark overflow-hidden">
            <div className="border-b border-sage/20 bg-sage/5 px-5 py-4">
              <h3 className="font-[family-name:var(--font-cormorant-garamond)] text-2xl font-semibold">
                {t.name}
              </h3>
              <p className="mt-0.5 text-sm opacity-80">{t.drive}</p>
              <p className="mt-1 font-mono text-[11px] opacity-70">{t.coords}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <a
                  href={t.directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-forest px-3.5 py-1.5 text-xs font-semibold text-cream transition-opacity hover:opacity-85 dark:bg-soft-gold dark:text-forest-dark"
                >
                  🚗 Directions from the farm ↗
                </a>
                <a
                  href={t.pinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border-2 border-sage/40 px-3.5 py-1.5 text-xs font-semibold transition-colors hover:border-sage"
                >
                  📍 Drop the pin ↗
                </a>
              </div>
            </div>

            <div className="px-5 py-4">
              <div className="text-xs font-bold uppercase tracking-wide opacity-60">
                Road directions (write them down — service dies before you get there)
              </div>
              <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm opacity-85">
                {t.roadSteps.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ol>
            </div>

            <dl className="divide-y divide-sage/15 border-t border-sage/15 text-sm">
              {[
                ["🅿️ Parking", t.parking],
                ["⛽ Last services", t.lastServices],
                ["⏰ Leave by", t.leaveBy],
              ].map(([label, body]) => (
                <div key={label} className="px-5 py-3">
                  <dt className="text-xs font-bold uppercase tracking-wide opacity-60">{label}</dt>
                  <dd className="mt-0.5 opacity-85">{body}</dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>

      {/* Nav apps */}
      <div className="soft-card dark:soft-card-dark overflow-hidden">
        <div className="border-b border-sage/20 bg-sage/5 px-5 py-3">
          <h3 className="font-semibold">📱 What to put on your phone before we lose service</h3>
          <p className="mt-0.5 text-xs opacity-70">
            Short version: everyone downloads the AllTrails maps, one person brings CalTopo, and Gaia
            is only worth buying if we&apos;re actually doing the wreck.
          </p>
        </div>
        <div className="divide-y divide-sage/15">
          {NAV_APPS.map((a) => (
            <div key={a.app} className="px-5 py-3.5 text-sm">
              <div className="flex flex-wrap items-baseline gap-x-2">
                <span className="font-semibold">{a.app}</span>
                <span className="rounded-full bg-sage/15 px-2 py-0.5 text-[11px] font-semibold">
                  {a.who}
                </span>
              </div>
              <p className="mt-1 text-xs opacity-80">{a.why}</p>
              <p className="mt-1 text-xs opacity-65">
                <strong>Gap:</strong> {a.gap}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
