import { closesIn, stateLabel, type BidState } from "@/lib/sofala-sample";

export function StateBadge({ state }: { state: BidState }) {
  return <span className={`badge badge-${state}`}>{stateLabel[state]}</span>;
}

export function Due({ iso }: { iso: string }) {
  const c = closesIn(iso);
  return <span className={`due${c.urgent ? " urgent" : ""}`}>{c.label}</span>;
}
