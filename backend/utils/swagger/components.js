/**
 * @openapi
 * components:
 *   schemas:
 *     AudioFormat:
 *       type: string
 *       description: >
 *         The audio format you wish to use on the fileurl returned field. That is the format of the returned file. Currently only mp32 is supported.
 *       pattern: '^[A-Za-z0-9]+$'
 *     Format:
 *       description: The way to format the response data.
 *       type: string
 *       enum: [xml, json, jsonpretty]
 *       default: jsonpretty
 *    Page:
 *       description: The page number to return
 *       type: integer
 *       minimum: 1
 *       default: 1
 *     PageSize:
 *       description: The number of items in a single result list
 *       type: integer
 *       minimum: 1
 *       default: 20
 */
 /*     ResultsFullCount:
 *       description: Total results in database
 *     Order:
 *       description: >
 *         Sets the field by which to order results. Can also specify if ascending or descending by adding _asc or _desc respectively to the order value. The default is ascending order. When choosing an order field, it should be a field in the object.
 *       type: array
 *         items:
 *           type: string
 *           enum: ['name', 'id', 'releasedate', 'artist_id',
 *                    'artist_name', 'popularity_total',
 *                    'popularity_month', 'popularity_week']
 *       examples:
 *         example1:
 *           summary: using default asc order
 *           value: order=popularity_month
 *         example2:
 *           summary: explicitly specifying ascending order
 *           value: order=popularity_month_asc
 *         example3:
 *           summary: explicitly specifying descending order
 *           value: order=popularity_month_desc
 *     DateBetween:
 *       description: |
 *         filter results based on a date_from and date_to separated by an underscore (_). Both dates must be in yyyy-mm-dd format.
 *       type: string
 *       example: '2024-01-03_2024-12-24'
 *     ImageSize:
 *       description: |
 *         The size of the cover of the returned resource. A size of n returns the nxn-sized cover image.
 *       type:
 *         enum: [25, 35, 50, 55, 60, 65, 70, 75, 85, 100, 130,
 *                150, 200, 300, 400, 500, 600]
 *       default: 500
 *     DateType:
 *       type: string
 *       format: date
 *     UrlType:
 *       type: string
 *       format: uri
 *     AlbumId:
 *       description: An album's id
 *       type: string
 *     ArtistId:
 *       description: An artist's id
 *       type: string
 *     UserId:
 *       description: A user's id
 *       type: string
 *     TrackId:
 *       description: A track's id
 *       type: string
 *     ReviewId:
 *       description: An album's id
 *       type: string
 *     #
 *     ### DERRIVED OBJECTS
 *     #
 *     AlbumIds:
 *       description: A list of album ids
 *       type: array
 *       items:
 *         $ref: '#/components/schemas/AlbumId'
 *     ArtistIds:
 *       description: A list of artist ids. Only artists with matching ids will be included in results. If no provided id matches an artist, the results field of returned data will be empty.
 *       type: array
 *       items:
 *         $ref: '#/components/schemas/ArtistId'
 *     ReviewIds:
 *       description: A list of review ids. Only reviews with matching ids will be included in results. If no provided id matches a review, the results field of returned data will be empty.
 *       type: array
 *       items:
 *         $ref: '#/components/schemas/ReviewId'
 *     TrackIds:
 *       description: A list of track ids. Only tracks with matching ids will be included in results. If no provided id matches a track, the results field of returned data will be empty.
 *       description: A list of track ids to fetch.
 *       type: array
 *       items:
 *         $ref: '#/components/schemas/TrackId'
 *     UserIds:
 *       description: A list of user ids. Only user with matching ids will be included in results. If no id matches a review, the results field of returned data will be empty.
 *       type: array
 *       items:
 *         $ref: '#/components/schemas/UserId'
 *     Album:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: album's 'id'
 *         name:
 *           type: string
 *           description: The album's name
 *         release_date:
 *           description: Album release date
 *           $ref: '#/components/schemas/DateType'
 *         artist_id:
 *           description: Id of artist who created the album
 *           type: string
 *         artist_name:
 *           description: Name of artist who created the album
 *           type: string
 *         image:
 *           description: Album's cover image
 *           $ref: '#/components/schemas/UrlType'
 *         zip:
 *           description: Url to download album as a zip file
 *           $ref: '#/components/schemas/UrlType'
 *         shorturl:
 *           description: Url to get the album's preview
 *           $ref: '#/components/schemas/UrlType'
 *         shareurl:
 *           description: The Url to use in sharing album
 *           $ref: '#/components/schemas/UrlType'
 *         zip_allowed:
 *           description: Indicates if the album is downloadable or not.
 *           type: boolean
 *     #Artist:
 *     #Playlist:
 *     #Review:
 *     #Track:
 *     #User:
 *     #
 *     ### HIGH-LEVEL OBJECTS
 *     #
 *     DataHeader:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           enum: [ succeeded, failed ]
 *         code:
 *           type: integer
 *           minimum: 0
 *         error_message:
 *           type: string
 *           default: ""
 *         next:
 *           type: string
 *         results_count:
 *           type: integer
 *         warnings:
 *           type: string
 *           default: ""
 *         x-took:
 *           type: string
 *       required:
 *         - status
 *         - code
 *         - error_message
 *         - warnings
 *         - x-took
 *     DataResults:
 *       type: array
 *       items:
 *         type:
 *           oneOf:
 *             $ref: '#/components/schemas/Album'
 *             $ref: '#/components/schemas/Artist'
 *             $ref: '#/components/schemas/Playlist'
 *             $ref: '#/components/schemas/Review'
 *             $ref: '#/components/schemas/Track'
 *             $ref: '#/components/schemas/User'
 *     ResponseData:
 *       type: object
 *       properties:
 *         headers:
 *           schema:
 *             $ref: '#/components/schemas/DataHeader'
 *         results:
 *           schema:
 *             $ref: '#/components/schemas/DataResults'
 *
 */
