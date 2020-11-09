export const CACHE_KEY_USER_BOARD = (userId): string => `user_board_${userId}`;

export const CACHE_KEY_BOARD_USER = (boardId): string =>
  `board_user_${boardId}`;
