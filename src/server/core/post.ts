import { reddit } from '@devvit/web/server';

export const createPost = async () => {
  return await reddit.submitCustomPost({
    title: '🧩 Subdle Daily — Guess Today\'s Mystery Subreddit in 4 Clues!',
  });
};
