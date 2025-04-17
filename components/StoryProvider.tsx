// providers/StoryProvider.tsx
import React, { createContext, useContext, useState } from "react";
import { Modal } from "react-native";
import StoryView from "@/components/StoryView";
import { Id } from "@/convex/_generated/dataModel";

type Story = {
  _id: Id<"stories">;
  userId: string;
  imageUrl: string;
  storageId: Id<"_storage">;
  user: {
    _id: string;
    username: string;
    image?: string;
    fullName: string;
    email: string;
    followers: number;
    following: number;
    posts: number;
    clerkId: string;
  } | null;
};

type StoryContextType = {
  showStory: (story: Story) => void;
};

const StoryContext = createContext<StoryContextType>({
  showStory: () => {},
});

export function StoryProvider({ children }: { children: React.ReactNode }) {
  const [currentStory, setCurrentStory] = useState<Story | null>(null);

  const showStory = (story: Story) => {
    setCurrentStory(story);
  };

  return (
    <StoryContext.Provider value={{ showStory }}>
      {children}
      <Modal visible={!!currentStory} animationType="fade">
        {currentStory && (
          <StoryView
            story={currentStory}
            onClose={() => setCurrentStory(null)}
          />
        )}
      </Modal>
    </StoryContext.Provider>
  );
}

export const useStory = () => useContext(StoryContext);
