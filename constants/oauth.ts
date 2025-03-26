import { OAuthProviderConfig } from "@/types/auth";

export const OAUTH_PROVIDERS: Record<string, OAuthProviderConfig> = {
  google: {
    strategy: "oauth_google",
    icon: "logo-google",
    text: "Continue with Google",
  },
  github: {
    strategy: "oauth_github",
    icon: "logo-github",
    text: "Continue with Github",
  },
} as const;
