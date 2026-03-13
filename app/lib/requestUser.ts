import "server-only";

import { headers } from "next/headers";

const USER_HEADER_CANDIDATES = [
  "x-remote-user",
  "remote-user",
  "remote_user",
  "x-forwarded-user",
];

export async function getRequestKerberosLogin() {
  const requestHeaders = await headers();

  for (const headerName of USER_HEADER_CANDIDATES) {
    const headerValue = requestHeaders.get(headerName)?.trim();
    if (headerValue) {
      return headerValue;
    }
  }

  const envRemoteUser = process.env.REMOTE_USER?.trim();
  if (envRemoteUser) {
    return envRemoteUser;
  }

  return "unknown";
}