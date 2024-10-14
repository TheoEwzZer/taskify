import { createSessionClient } from "@/lib/appwrite";
import { Models } from "node-appwrite";

export const getCurrent: () => Promise<Models.User<Models.Preferences> | null> =
  async (): Promise<Models.User<Models.Preferences> | null> => {
    try {
      const { account } = await createSessionClient();

      return await account.get();
    } catch {
      return null;
    }
  };
