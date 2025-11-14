```typescript
useEffect(() => {
  const fetchRoles = async () => {
    const response = await fetch('http://localhost:8000/api/roles');
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