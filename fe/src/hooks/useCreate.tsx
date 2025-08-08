import { useMutation, useQueryClient } from '@tanstack/react-query'
import { API_SERVICE } from './api_service'

const useCreate = (resource: keyof typeof API_SERVICE) => {
    const queryClient = useQueryClient();

    const addMutation = useMutation({
        mutationFn: async (newData: any) => await API_SERVICE[resource].add(newData),
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: [resource] });
        },
      });
    return addMutation;
}

export default useCreate