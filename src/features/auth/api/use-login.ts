import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";
import { ClientResponse } from "hono/client";
import { StatusCode } from "hono/utils/http-status";

type ResponseType = InferResponseType<typeof client.api.auth.login.$post>;
type RequestType = InferRequestType<typeof client.api.auth.login.$post>;

export const useLogin: () => UseMutationResult<
  ResponseType,
  Error,
  RequestType,
  unknown
> = () => {
  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response: ClientResponse<ResponseType, StatusCode, "json"> =
        await client.api.auth.login.$post({ json });
      return await response.json();
    },
  });
};
