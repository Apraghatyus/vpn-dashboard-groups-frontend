import { useMemo, useCallback, useState } from 'react';
import { useAppContext } from '../context/AppContext';

export function useYaml() {
  const { state } = useAppContext();
  const [copied, setCopied] = useState(false);

  const yaml = useMemo(() => {
    const lines: string[] = [];
    lines.push('# WireGuard ACL — generado por WG-ACL Manager');
    lines.push('');
    lines.push('roles:');

    for (const role of state.roles) {
      lines.push(`  ${role.id}:`);
      lines.push(`    description: "${role.description}"`);
      lines.push(`    rules:`);

      const serviceIds = state.accessMatrix
        .filter((e) => e.roleId === role.id)
        .map((e) => e.serviceId);
      const roleServices = state.services.filter((s) => serviceIds.includes(s.id));

      if (roleServices.length === state.services.length) {
        lines.push(`      - "*"`);
      } else {
        for (const svc of roleServices) {
          lines.push(`      - "${svc.endpoint}"`);
        }
      }
      lines.push('');
    }

    return lines.join('\n');
  }, [state.roles, state.accessMatrix, state.services]);

  const copyToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(yaml);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      return true;
    } catch {
      return false;
    }
  }, [yaml]);

  const download = useCallback(
    (filename: string = 'wg-acl.yaml') => {
      const blob = new Blob([yaml], { type: 'text/yaml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    },
    [yaml]
  );

  return { yaml, copyToClipboard, download, copied };
}
