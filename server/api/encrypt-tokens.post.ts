// /server/api/encrypt-tokens.post.ts
import { encrypt } from '~/server/utils/crypto';
import { getCookie } from 'h3';

export default defineEventHandler(async (event) => {
  // Uzimamo token iz httpOnly cookie-ja
  const authToken = getCookie(event, 'authToken');
  const refreshToken = getCookie(event, 'refreshToken');

  if (!authToken || !refreshToken) {
    throw createError({ statusCode: 400, statusMessage: 'Nedostaju tokeni' });
  }

  const encryptedAuthToken = encrypt(authToken);
  const encryptedRefreshToken = encrypt(refreshToken);

  return {
    encryptedAuthToken,
    encryptedRefreshToken
  };
});
