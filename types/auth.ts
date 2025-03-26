import { OAuthStrategy } from "@clerk/types";

export type OAuthProviderType = "oauth_google" | "oauth_github";

export interface OAuthProviderConfig {
  strategy: OAuthProviderType;
  icon: string;
  text: string;
}

export interface OAuthButtonProps {
  provider: OAuthProviderConfig;
  isLoading: boolean;
  onPress: () => void;
}
