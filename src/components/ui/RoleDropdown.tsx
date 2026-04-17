import { useRoles } from '../../hooks/useRoles';

interface RoleDropdownProps {
  currentRoleId: string;
  onChange: (roleId: string) => void;
}

export function RoleDropdown({ currentRoleId, onChange }: RoleDropdownProps) {
  const { roles, getRoleColor } = useRoles();
  const color = getRoleColor(currentRoleId);

  return (
    <select
      className="role-dropdown"
      value={currentRoleId}
      onChange={(e) => onChange(e.target.value)}
      style={{
        background: `${color}25`,
        color: color,
      }}
    >
      {roles.map((role) => (
        <option key={role.id} value={role.id}>
          {role.displayName}
        </option>
      ))}
    </select>
  );
}
