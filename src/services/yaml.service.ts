import { roleService } from './role.service';
import { serviceService } from './service.service';
import { accessService } from './access.service';

function generate(): string {
  const roles = roleService.getAll();
  const lines: string[] = [];

  lines.push('# WireGuard ACL — generado por WG-ACL Manager');
  lines.push('');
  lines.push('roles:');

  for (const role of roles) {
    lines.push(`  ${role.id}:`);
    lines.push(`    description: "${role.description}"`);
    lines.push(`    rules:`);

    const services = accessService.getServicesForRole(role.id);
    const totalServices = serviceService.count();

    if (services.length === totalServices) {
      lines.push(`      - "*"`);
    } else {
      for (const svc of services) {
        lines.push(`      - "${svc.endpoint}"`);
      }
    }
    lines.push('');
  }

  return lines.join('\n');
}

async function copyToClipboard(): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(generate());
    return true;
  } catch {
    return false;
  }
}

async function sync(token: string): Promise<boolean> {
  try {
    const res = await fetch('/api/yaml/sync', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return res.ok;
  } catch {
    return false;
  }
}

function download(filename: string = 'wg-acl.yaml'): void {
  const content = generate();
  const blob = new Blob([content], { type: 'text/yaml' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export const yamlService = {
  generate,
  copyToClipboard,
  download,
  sync,
};
