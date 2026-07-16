"use client";

import React, { useState } from 'react';

interface PermissionMatrixBuilderProps {
  initialRole?: string;
  onSave: (roleData: any) => void;
}

const ALL_MODULES = [
  'WABA', 'CRM', 'ERP', 'E_COMMERCE', 'SUPERADMIN'
];

const PERMISSIONS = [
  'READ', 'WRITE', 'DELETE', 'MANAGE_USERS'
];

export function PermissionMatrixBuilder({ initialRole = 'NEW_ROLE', onSave }: PermissionMatrixBuilderProps) {
  const [roleName, setRoleName] = useState(initialRole);
  
  // A map of Module -> Array of granted permissions
  const [matrix, setMatrix] = useState<Record<string, string[]>>({});

  const togglePermission = (module: string, perm: string) => {
    setMatrix(prev => {
      const current = prev[module] || [];
      const updated = current.includes(perm) 
        ? current.filter(p => p !== perm)
        : [...current, perm];
      
      return { ...prev, [module]: updated };
    });
  };

  const handleSave = () => {
    onSave({
      name: roleName,
      permissions: matrix
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <label style={{ display: 'block', marginBottom: '8px', color: '#94a3b8' }}>Role Name</label>
        <input 
          type="text" 
          value={roleName} 
          onChange={(e) => setRoleName(e.target.value)}
          style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '4px' }}
        />
      </div>

      <div>
        <h4 style={{ color: '#94a3b8', marginBottom: '12px' }}>Permissions Matrix</h4>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <th style={{ padding: '10px', color: '#94a3b8' }}>Module</th>
                {PERMISSIONS.map(p => <th key={p} style={{ padding: '10px', color: '#94a3b8' }}>{p}</th>)}
              </tr>
            </thead>
            <tbody>
              {ALL_MODULES.map(mod => (
                <tr key={mod} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '10px', fontWeight: 'bold' }}>{mod}</td>
                  {PERMISSIONS.map(p => (
                    <td key={p} style={{ padding: '10px' }}>
                      <input 
                        type="checkbox"
                        checked={(matrix[mod] || []).includes(p)}
                        onChange={() => togglePermission(mod, p)}
                        style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <button 
        onClick={handleSave}
        style={{ padding: '12px', background: 'var(--accent, #3b82f6)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', marginTop: '10px' }}
      >
        Save Role
      </button>
    </div>
  );
}
