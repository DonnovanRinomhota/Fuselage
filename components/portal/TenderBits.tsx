import { closesIn, recLabel, stateLabel, type BidState, type Recommendation } from "@/lib/sofala-sample";

export function StateBadge({ state }: { state: BidState }) {
  return <span className={`badge badge-${state}`}>{stateLabel[state]}</span>;
}

export function Due({ iso }: { iso: string }) {
  const c = closesIn(iso);
  return <span className={`due${c.urgent ? " urgent" : ""}`}>{c.label}</span>;
}


export function RecBadge({ rec }: { rec?: Recommendation }) {
  if (!rec) return <span className="badge badge-closed">Awaiting screening</span>;
  return <span className={`badge rec-${rec.decision}`}>{recLabel[rec.decision]}</span>;
}
