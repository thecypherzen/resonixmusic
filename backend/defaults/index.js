/** global constant values
 *
 * The following default values are defined:
 *
 * => AUDIO_CHUNK_SIZE: the default size (in bytes) of an
 *    audio file's chunk.
 * => CACHE_EXP_SECS: expiry time (in seconds) for cached values.
 */

const AUDIO_CHUNK_SIZE = Math.ceil(2 ** 20);
const CACHE_EXP_SECS = 24 * 7 * 3600;
export {
  AUDIO_CHUNK_SIZE,
  CACHE_EXP_SECS,
};
