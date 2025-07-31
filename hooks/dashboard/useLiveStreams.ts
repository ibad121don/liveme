import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createStream, fetchLiveStreams } from "@/lib/api";
import { LiveStream, LiveStreamInput } from "@/lib/userAPITypes";

interface LiveStreamResponse {
  data: LiveStream[];
  total: number;
}

export function useLiveStreams(page: number, pageSize: number) {
  return useQuery<LiveStreamResponse>({
    queryKey: ["liveStreams", page, pageSize],
    queryFn: () => fetchLiveStreams(page, pageSize),
  });
}

export function useCreateLiveStream() {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    LiveStream,
    Error,
    Omit<LiveStreamInput, "companyId" | "sellerId">
  >({
    mutationFn: async (inputData) => {
      return await createStream(inputData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["liveStreams"] });
    },
  });

  return {
    createStream: mutation.mutateAsync,
    ...mutation,
  };
}
