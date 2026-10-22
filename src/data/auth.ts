import { createServerFn } from "@tanstack/react-start";

import { changePassword, isAuthenticated, signIn, signOut } from "./auth.server";

export const checkAuth = createServerFn({ method: "GET" }).handler(async (): Promise<boolean> =>
  isAuthenticated(),
);

export type LoginInput = { password: string; remember?: boolean };

export const login = createServerFn({ method: "POST" })
  .inputValidator((input: LoginInput) => input)
  .handler(async ({ data }): Promise<{ ok: boolean; error?: string }> =>
    signIn(data.password, data.remember === undefined ? {} : { remember: data.remember }),
  );

export const logout = createServerFn({ method: "POST" }).handler(async (): Promise<void> => {
  signOut();
});

export type ChangePasswordInput = { current: string; next: string };

export const changeAdminPassword = createServerFn({ method: "POST" })
  .inputValidator((input: ChangePasswordInput) => input)
  .handler(async ({ data }): Promise<{ ok: boolean; error?: string }> => changePassword(data));
