# Topcoder Terms API

## Postman test
- import Postman collection and environment file in the docs folder to Postman
- Refer `ReadMe.md` to start the app and postgres database
- run `npm run init-db` and then `npm run test-data` to clear and insert test data before testing.
- Go to https://lauscher.topcoder-dev.com/, login with `tonyj/appirio123`, you can verify Kafka message have been sent to topic `test.new.bus.events`

## Unit test Coverage

  87 passing (1m)

File                                |  % Stmts | % Branch |  % Funcs |  % Lines | Uncovered Line #s
------------------------------------|----------|----------|----------|----------|-------------------
All files                           |    89.21 |    80.34 |    88.61 |    89.49 |
 terms-service                      |      100 |    85.71 |      100 |      100 |
  app-bootstrap.js                  |      100 |      100 |      100 |      100 |
  app-constants.js                  |      100 |    85.71 |      100 |      100 |                18
 terms-service/config               |      100 |     91.3 |      100 |      100 |
  default.js                        |      100 |     91.3 |      100 |      100 |        9,10,43,55
  test.js                           |      100 |      100 |      100 |      100 |
 terms-service/src/common           |     67.3 |    46.03 |    73.53 |    68.39 |
  errors.js                         |      100 |       50 |      100 |      100 |                23
  helper.js                         |    41.98 |    33.33 |    52.63 |    42.86 |... 17,218,219,223
  logger.js                         |    92.65 |    68.18 |      100 |    92.65 |   31,57,62,86,120
 terms-service/src/models           |      100 |      100 |      100 |      100 |
  DocusignEnvelope.js               |      100 |      100 |      100 |      100 |
  TermsForResource.js               |      100 |      100 |      100 |      100 |
  TermsOfUse.js                     |      100 |      100 |      100 |      100 |
  TermsOfUseAgreeabilityType.js     |      100 |      100 |      100 |      100 |
  TermsOfUseDependency.js           |      100 |      100 |      100 |      100 |
  TermsOfUseDocusignTemplateXref.js |      100 |      100 |      100 |      100 |
  UserTermsOfUseBanXref.js          |      100 |      100 |      100 |      100 |
  UserTermsOfUseXref.js             |      100 |      100 |      100 |      100 |
  index.js                          |      100 |      100 |      100 |      100 |
 terms-service/src/services         |    97.59 |    93.81 |      100 |    97.56 |
  DocusignService.js                |    94.06 |    80.77 |      100 |    93.94 |... 80,227,255,256
  TermsForResourceService.js        |      100 |    95.83 |      100 |      100 |               198
  TermsOfUseService.js              |    99.11 |    98.41 |      100 |     99.1 |               193

## E2E test Coverage

  168 passing (1m)

File                                |  % Stmts | % Branch |  % Funcs |  % Lines | Uncovered Line #s
------------------------------------|----------|----------|----------|----------|-------------------
All files                           |    95.68 |    86.87 |    98.17 |    95.59 |
 terms-service                      |    95.35 |    82.86 |    95.24 |    95.12 |
  app-bootstrap.js                  |      100 |      100 |      100 |      100 |
  app-constants.js                  |      100 |    85.71 |      100 |      100 |                18
  app-routes.js                     |    97.37 |    96.77 |      100 |    97.37 |                24
  app.js                            |    90.38 |    68.75 |    85.71 |    90.38 |    38,55,77,86,93
 terms-service/config               |      100 |     91.3 |      100 |      100 |
  default.js                        |      100 |     91.3 |      100 |      100 |        9,10,43,55
  test.js                           |      100 |      100 |      100 |      100 |
 terms-service/src                  |      100 |      100 |      100 |      100 |
  routes.js                         |      100 |      100 |      100 |      100 |
 terms-service/src/common           |    89.94 |     74.6 |    97.06 |    89.68 |
  errors.js                         |      100 |       50 |      100 |      100 |                23
  helper.js                         |    86.42 |    76.92 |    94.74 |    85.71 |... 85,204,210,214
  logger.js                         |    92.65 |    72.73 |      100 |    92.65 |   31,57,62,86,120
 terms-service/src/controllers      |      100 |      100 |      100 |      100 |
  DocusignController.js             |      100 |      100 |      100 |      100 |
  TermsForResourceController.js     |      100 |      100 |      100 |      100 |
  TermsOfUseController.js           |      100 |      100 |      100 |      100 |
 terms-service/src/models           |      100 |      100 |      100 |      100 |
  DocusignEnvelope.js               |      100 |      100 |      100 |      100 |
  TermsForResource.js               |      100 |      100 |      100 |      100 |
  TermsOfUse.js                     |      100 |      100 |      100 |      100 |
  TermsOfUseAgreeabilityType.js     |      100 |      100 |      100 |      100 |
  TermsOfUseDependency.js           |      100 |      100 |      100 |      100 |
  TermsOfUseDocusignTemplateXref.js |      100 |      100 |      100 |      100 |
  UserTermsOfUseBanXref.js          |      100 |      100 |      100 |      100 |
  UserTermsOfUseXref.js             |      100 |      100 |      100 |      100 |
  index.js                          |      100 |      100 |      100 |      100 |
 terms-service/src/services         |    97.59 |    93.81 |      100 |    97.56 |
  DocusignService.js                |    94.06 |    80.77 |      100 |    93.94 |... 80,227,255,256
  TermsForResourceService.js        |      100 |    95.83 |      100 |      100 |               198
  TermsOfUseService.js              |    99.11 |    98.41 |      100 |     99.1 |               193
