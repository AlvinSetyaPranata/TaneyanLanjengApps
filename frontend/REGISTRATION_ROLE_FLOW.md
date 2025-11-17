```typescript
useEffect(() => {
  const fetchRoles = async () => {
    const response = await fetch(`${API_BASE_URL}(`${API_BASE_URL}/roles`));`)
    const roles = await response.json();
    
    // Filter out Admin role
    const filteredRoles = roles
      .filter((role: any) => role.name !== 'Admin')
      .map((role: any) => ({
        value: role.id.toString(),
        label: role.name === 'Teacher' ? 'Pengajar' : 'Student' ? 'Siswa' : role.name
      }));
    
    setRoleOptions(filteredRoles);
  };

  fetchRoles();
}, []);
```