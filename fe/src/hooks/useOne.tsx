import { useQuery } from '@tanstack/react-query'
import { API_SERVICE } from './api_service'

const useOne = (resource: keyof typeof API_SERVICE, id: any) => {
    const getOne= useQuery({
        queryKey: [resource, id],
        queryFn: async () => await API_SERVICE[resource].getById(id),
      });
      
    return getOne;
}

export default useOne