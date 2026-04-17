import type { PeerStatus } from '../../models';

interface StatusDotProps {
  status: PeerStatus;
}

export function StatusDot({ status }: StatusDotProps) {
  return <span className={`status-dot ${status}`} />;
}
