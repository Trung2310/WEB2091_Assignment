import { useMutation, useQueryClient } from '@tanstack/react-query'
import { API_SERVICE } from './api_service'

const useRemove = (resource: keyof typeof API_SERVICE) => {
    const queryClient = useQueryClient();

    const removeMutation = useMutation({
        mutationFn: async (id: any) => await API_SERVICE[resource].remove(id),
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: [resource] });
        },
      });
    return removeMutation;
}

export default useRemove