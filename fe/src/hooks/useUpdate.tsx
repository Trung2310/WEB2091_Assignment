import { useMutation, useQueryClient } from '@tanstack/react-query'
import { API_SERVICE } from './api_service'

const useUpdate = (resource: keyof typeof API_SERVICE) => {
    const queryClient = useQueryClient();

    const updateMutation = useMutation({
        mutationFn: async ({ id, data }: { id: any; data: any }) => await API_SERVICE[resource].update(id, data),
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: [resource] });
        },
      });
    return updateMutation;
}

export default useUpdate