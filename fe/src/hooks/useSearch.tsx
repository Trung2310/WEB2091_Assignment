import { useQuery } from "@tanstack/react-query";

const fetchSearch = async (resource: string, query: string) => {
  if (!query) return [];
  const res = await fetch(`http://localhost:3002/${resource}?q=${query}`);
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
};

export const useSearchQuery = (resource: string, query: string) => {
  const { data, isLoading } = useQuery({
    queryKey: [resource, query],
    queryFn: () => fetchSearch(resource, query),
    enabled: !!query, 
    staleTime: 1000 * 60, 
  });
  return { data, isLoading };
};
