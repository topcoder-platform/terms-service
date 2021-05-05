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

## E2E testing with Postman

You should be able to find the tests result from the command window of running `npm run test:newman` for each test case.

Below is a sample output result of creating terms of use by admin.

```
newman

terms-api

Iteration 1/3

❏ terms of use / create terms of use
↳ create terms of use by admin
  POST http://localhost:3000/v5/terms [200 OK, 568B, 1594ms]
  ✓  Status code is 200

Iteration 2/3

↳ create terms of use by admin
  POST http://localhost:3000/v5/terms [200 OK, 568B, 1345ms]
  ✓  Status code is 200

Iteration 3/3

↳ create terms of use by admin
  POST http://localhost:3000/v5/terms [200 OK, 568B, 1289ms]
  ✓  Status code is 200

┌─────────────────────────┬──────────────────────┬──────────────────────┐
│                         │             executed │               failed │
├─────────────────────────┼──────────────────────┼──────────────────────┤
│              iterations │                    3 │                    0 │
├─────────────────────────┼──────────────────────┼──────────────────────┤
│                requests │                    3 │                    0 │
├─────────────────────────┼──────────────────────┼──────────────────────┤
│            test-scripts │                    3 │                    0 │
├─────────────────────────┼──────────────────────┼──────────────────────┤
│      prerequest-scripts │                    0 │                    0 │
├─────────────────────────┼──────────────────────┼──────────────────────┤
│              assertions │                    3 │                    0 │
├─────────────────────────┴──────────────────────┴──────────────────────┤
│ total run duration: 4.3s                                              │
├───────────────────────────────────────────────────────────────────────┤
│ total data received: 966B (approx)                                    │
├───────────────────────────────────────────────────────────────────────┤
│ average response time: 1409ms [min: 1289ms, max: 1594ms, s.d.: 132ms] │
└───────────────────────────────────────────────────────────────────────┘
```

Note, in order to cover all the edge cases. The postman tests choose using the inner Json from the json testing data.
e.g. In `test/postman/testData/terms-of-use/create-terms-of-use-with-any-optional-fields.json`, the format is like:
```json
{
  "input": {
    "title": "term of use with only required fields",
    "typeId": "{{TYPE_ID_1}}",
    "agreeabilityTypeId": "{{AGREEABILITY_TYPE_ID_1}}"
  },
  "expected": {
    "legacyId": null,
    "text": null,
    "url": null
  },
  "httpCode": 200
}
```
The `input` node is set in the request body filed which can be customized with all kinds of different vataibales(optional or required).
Parsing the `input` node is done by the postman's `Pre-request Script` feature like below:
```js
var inputJSONdata = pm.iterationData.get("input");
pm.variables.set("input_body",JSON.stringify(inputJSONdata));
```

You can import the postman collection to check the deails of all the cases.