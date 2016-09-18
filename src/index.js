import fetch from 'isomorphic-fetch';
import querystring from 'querystring';
import { trimStart } from 'lodash/string';
import { sprintf } from 'sprintf-js';

/**
 * Endpoint constants.
 * @type {Object}
 */
export const Constants = {
  // Food Services
  FS_MENU: 'foodservices/menu',
  FS_NOTES: 'foodservices/notes',
  FS_DIETS: 'foodservices/diets',
  FS_OUTLETS: 'foodservices/outlets',
  FS_LOCATIONS: 'foodservices/locations',
  FS_WATCARD: 'foodservices/watcard',
  FS_ANNOUNCEMENTS: 'foodservices/announcements',
  FS_PRODUCTS_ID: 'foodservices/products/%(product_id)s',
  FS_YEAR_WEEK_MENU: 'foodservices/%(year)s/%(week)s/menu',
  FS_YEAR_WEEK_NOTES: 'foodservices/%(year)s/%(week)s/notes',
  FS_YEAR_WEEK_ANNOUNCEMENTS: 'foodservices/%(year)s/%(week)s/announcements',

  // Feds
  FEDS_EVENTS: 'feds/events',
  FEDS_EVENTS_ID: 'feds/events/%(id)s',
  FEDS_LOCATIONS: 'feds/locations',

  // courses
  COURSES: 'courses',
  COURSES_SUBJECT: 'courses/%(subject)s',
  COURSES_ID: 'courses/%(course_id)s',
  COURSES_CLASS_SCHEDULE: 'courses/%(class_number)s/schedule',
  COURSES_SUBJECT_CATALOG: 'courses/%(subject)s/%(catalog_number)s',
  COURSES_SUBJECT_CATALOG_SCHEDULE: 'courses/%(subject)s/%(catalog_number)s/schedule',
  COURSES_SUBJECT_CATALOG_PREREQUISITES: 'courses/%(subject)s/%(catalog_number)s/prerequisites',
  COURSES_SUBJECT_CATALOG_EXAMSCHEDULE: 'courses/%(subject)s/%(catalog_number)s/examschedule',

  // awards/scholarships
  AWARDS_GRAD: 'awards/graduate',
  AWARDS_UNDERGRAD: 'awards/undergraduate',

  // events
  EVENTS: 'events',
  EVENTS_SITE: 'events/%(site)s',
  EVENTS_SITE_ID: 'events/%(site)s/%(id)s',
  EVENTS_HOLIDAYS: 'events/holidays',

  // blogs
  BLOGS_SITE: 'blogs/%(site)s',
  BLOGS_SITE_ID: 'blogs/%(site)s/%(id)s',

  // news
  NEWS: 'news',
  NEWS_SITE: 'news/%(site)s',
  NEWS_SITE_ID: 'news/%(site)s/%(id)s',

  // opportunities/jobs
  OPPORTUNITIES: 'opportunities',
  OPPORTUNITIES_SITE: 'opportunities/%(site)s',
  OPPORTUNITIES_SITE_ID: 'opportunities/%(site)s/%(id)s',

  // services
  SERVICES_SITE: 'services/%(site)s',

  // weather
  WEATHER_CURRENT: 'weather/current',

  // terms
  TERMS_LIST: 'terms/list',
  TERMS_TERM_COURSES: 'terms/%(term)s/courses',
  TERMS_TERM_EXAMS: 'terms/%(term)s/examschedule',
  TERMS_TERM_SUBJECT_SCHEDULE: 'terms/%(term)s/%(subject)s/schedule',
  TERMS_TERM_SUBJECT_CATALOG_SCHEDULE: 'terms/%(term)s/%(subject)s/%(catalog_number)s/schedule',
  TERMS_TERM_ENROLLMENT: 'terms/%(term)s/enrollment',
  TERMS_TERM_SUBJECT_ENROLLMENT: 'terms/%(term)s/%(subject)s/enrollment',
  TERMS_TERM_INFOSESSIONS: 'terms/%(term)s/infosessions',

  // resources
  RESOURCES_TUTORS: 'resources/tutors',
  RESOURCES_PRINTERS: 'resources/printers',
  RESOURCES_INFOSESSIONS: 'resources/infosessions',
  RESOURCES_GOOSEWATCH: 'resources/goosewatch',
  RESOURCES_SUNSHINELIST: 'resources/sunshinelist',

  // definitions and codes
  CODES_UNITS: 'codes/units',
  CODES_TERMS: 'codes/terms',
  CODES_GROUPS: 'codes/groups',
  CODES_SUBJECTS: 'codes/subjects',
  CODES_INSTRUCTIONS: 'codes/instructions',

  // building
  BUILDINGS_LIST: 'buildings/list',
  BUILDINGS_CODE: 'buildings/%(building_code)s',
  BUILDINGS_BUILDING_ROOM_COURSES: 'buildings/%(building)s/%(room)s/courses',
  BUILDINGS_CODE_ACCESSPOINTS: 'buildings/%(building_code)s/accesspoints',
  BUILDINGS_CODE_VENDINGMACHINES: 'buildings/%(building_code)s/vendingmachines',

  // points of interest
  POI_ATMS: 'poi/atms',
  POI_GREYHOUND: 'poi/greyhound',
  POI_HELPLINES: 'poi/helplines',
  POI_LIBRARIES: 'poi/libraries',
  POI_PHOTOSPHERES: 'poi/photospheres',
  POI_DEFIBRILLATORS: 'poi/defibrillators',
  POI_CONSTRUCTIONSITES: 'poi/constructionsites',
  POI_ACCESSIBLEENTRANCES: 'poi/accessibleentrances',
  POI_VISITORINFORMATION: 'poi/visitorinformation',

  // parking
  PARKING_WATPARK: 'parking/watpark',
  PARKING_LOTS_METER: 'parking/lots/meter',
  PARKING_LOTS_PERMIT: 'parking/lots/permit',
  PARKING_LOTS_VISITOR: 'parking/lots/visitor',
  PARKING_LOTS_SHORTTERM: 'parking/lots/shortterm',
  PARKING_LOTS_ACCESSIBLE: 'parking/lots/accessible',
  PARKING_LOTS_MOTORCYCLE: 'parking/lots/motorcycle',

  // transit
  TRANSIT_GRT: 'transit/grt',
  TRANSIT_GRT_STOPS: 'transit/grt/stops',

  // people directory search
  DIRECTORY_ID: 'directory/%(user_id)s',

  // API
  API_USAGE: 'api/usage',
  API_SERVICES: 'api/services',
  API_METHODS: 'api/methods',
  API_VERSIONS: 'api/versions',
  API_CHANGELOG: 'api/changelog',

  // server
  SERVER_TIME: 'server/time',
  SERVER_CODES: 'server/codes',
};

/**
 * The request client.
 */
export const Client = class {
  /**
   * The base API URL.
   * @type {String}
   */
  static BASE_API_URL = 'https://api.uwaterloo.ca/v2/';

  /**
   * Constructor.
   * @param {String} key - The API key.
   */
  constructor(key) {
    if (typeof key !== 'string') {
      throw new TypeError('API key must be provided.');
    }

    this._key = key;
  }

  /**
   * Makes a request to the API.
   * @param {String} endpoint - The endpoint to hit.
   * @param {Object} params - The parameters to substitute into the endpoint string.
   * @returns {Promise.<String|TypeError>} Resolves to the API response or a fetch network error.
   */
  request(endpoint, params = {}) {
    return fetch(this._buildRequestUrl(endpoint, params)).then(response => response.json());
  }

  /**
   * Constructs the request URL.
   * @param {String} endpoint - The endpoint to hit.
   * @param {Object} params - The parameters to substitute into the endpoint string.
   * @returns {String} The request URL.
   * @private
   */
  _buildRequestUrl(endpoint, params) {
    return `${this.constructor.BASE_API_URL}${sprintf(trimStart(endpoint, '/'), params)}.json?${querystring.stringify({ key: this._key })}`;
  }
};
