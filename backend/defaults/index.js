/** global constant values
 *
 * The following default values are defined:
 *
 * => AUDIO_CHUNK_SIZE: the default size (in bytes) of an
 *    audio file's chunk.
 * => CACHE_EXP_SECS: expiry time (in seconds) for cached values.
 */

const AUDIO_CHUNK_SIZE = Math.ceil(2 ** 20),
      CACHE_EXP_SECS = 24 * 7 * 3600,
      JAM_CLIENT_ID = process.env.JAM_CLIENT_ID,
      JAM_CLIENT_SECRET = process.env.JAM_CLIENT_SECRET,
      MIN_PAGE_SIZE = 20,
      MAX_PAGE_SIZE = 200,
      MIN_TIMEOUT = 10000,
      MIN_RETRIES = 5,
      MAX_RETRIES = 10;

export {
  AUDIO_CHUNK_SIZE,
  CACHE_EXP_SECS,
  JAM_CLIENT_ID,
  JAM_CLIENT_SECRET,
  MAX_PAGE_SIZE,
  MAX_RETRIES,
  MAX_TIMEOUT,
  MIN_PAGE_SIZE,
  MIN_RETRIES,
  MIN_TIMEOUT,
  PAGE_SIZE,
};
