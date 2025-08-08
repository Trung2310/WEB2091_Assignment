import { useQuery } from '@tanstack/react-query';
import { API_SERVICE } from './api_service';

export const useList = (resource: keyof typeof API_SERVICE, search: any = '') => {
    const fetchData = async () => {
        const data = await API_SERVICE[resource].getAll(search);
        return data;
    };
    const { data, isLoading, error, refetch, } = useQuery({
        queryKey: [resource],
        queryFn: fetchData,
    });
    return { data, isLoading, error, refetch };
}
