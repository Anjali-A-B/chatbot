import { useQuery } from '@tanstack/react-query';

const token = localStorage.getItem('token');

const fetchCompany = async () => {
  const res = await fetch('/api/company/home', {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
};

const { data, error, isLoading } = useQuery(['company'], fetchCompany);
