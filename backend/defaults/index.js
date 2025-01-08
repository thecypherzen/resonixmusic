/** global constant values
 *
 * The following default values are defined:
 *
 * => AUDIO_CHUNK_SIZE: the default size (in bytes) of an
 *    audio file's chunk.
 * => CACHE_EXP_SECS: expiry time (in seconds) for cached values.
 */

const APIS = { jamendo: 'jamendo' },
      AUDIO_CHUNK_SIZE = Math.ceil(2 ** 20),
      CACHE_EXP_SECS = 24 * 7 * 3600,
      JAMENDO = {
        id: process.env.JAM_CLIENT_ID,
        secret: process.env.JAM_CLIENT_SECRET,
        version: 'v3.0',
        base: 'https://api.jamendo.com',
        callbackUrl: null,
      },
      MIN_PAGE_SIZE = 20,
      MAX_PAGE_SIZE = 200,
      TIMEOUT = 10000,
      MIN_RETRIES = 5,
      MAX_RETRIES = 10;

export {
  AUDIO_CHUNK_SIZE,
  CACHE_EXP_SECS,
  JAMENDO,
  MAX_PAGE_SIZE,
  MAX_RETRIES,
  MIN_PAGE_SIZE,
  MIN_RETRIES,
  TIMEOUT,
};
