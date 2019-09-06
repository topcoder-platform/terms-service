/*
 * Test data to be used in tests
 */

const token = {
  user1: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6WyJUb3Bjb2RlciBVc2VyIiwiQ29ubmVjdCBTdXBwb3J0IiwiYWRtaW5pc3RyYXRvciIsInRlc3RSb2xlIiwiYWFhIiwidG9ueV90ZXN0XzEiLCJDb25uZWN0IE1hbmFnZXIiLCJDb25uZWN0IEFkbWluIiwiY29waWxvdCIsIkNvbm5lY3QgQ29waWxvdCBNYW5hZ2VyIl0sImlzcyI6Imh0dHBzOi8vYXBpLnRvcGNvZGVyLWRldi5jb20iLCJoYW5kbGUiOiJUb255SiIsImV4cCI6MTU4NTY4MTkyMCwidXNlcklkIjoiODU0Nzg5OSIsImlhdCI6MTU1NTY4MTMyMCwiZW1haWwiOiJhamVmdHNAdG9wY29kZXIuY29tIiwianRpIjoiMTlhMDkzNzAtMjk4OC00N2I4LTkxODktMGRhODVjNjM0ZWQyIn0.iz-6i97loCCkr5k_BQ974U0yYVJJ6fRaDTrQkfIk8SI',
  user2: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6WyJUb3Bjb2RlciBVc2VyIl0sImlzcyI6Imh0dHBzOi8vYXBpLnRvcGNvZGVyLWRldi5jb20iLCJoYW5kbGUiOiJjYWxsbWVrYXRvb3RpZSIsImV4cCI6MTU4NTY4MTkyMCwidXNlcklkIjoiMjMxMjQzMjkiLCJpYXQiOjE1NTU2ODEzMjAsImVtYWlsIjoiY2FsbG1la2F0b290aWVAdG9wY29kZXIuY29tIiwianRpIjoiMTlhMDkzNzAtMjk4OC00N2I4LTkxODktMGRhODVjNjM0ZWQyIn0.3qNoXuKfi_z017BhZOokjmHvDsUfuszZmhRQIl6c41M',
  user3: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6WyJUb3Bjb2RlciBVc2VyIl0sImlzcyI6Imh0dHBzOi8vYXBpLnRvcGNvZGVyLWRldi5jb20iLCJoYW5kbGUiOiJob2hvc2t5IiwiZXhwIjoxNTg1NjgxOTIwLCJ1c2VySWQiOiIxNjA5NjgyMyIsImlhdCI6MTU1NTY4MTMyMCwiZW1haWwiOiJjYWxsbWVrYXRvb3RpZUB0b3Bjb2Rlci5jb20iLCJqdGkiOiIxOWEwOTM3MC0yOTg4LTQ3YjgtOTE4OS0wZGE4NWM2MzRlZDIifQ.-d8ixuid-IKC4VYp6u34ux902oT4qXn21CxzQMXFwp8',
  user4: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6WyJUb3Bjb2RlciBVc2VyIl0sImlzcyI6Imh0dHBzOi8vYXBpLnRvcGNvZGVyLWRldi5jb20iLCJoYW5kbGUiOiJHaG9zdGFyIiwiZXhwIjoxNTg1NjgxOTIwLCJ1c2VySWQiOiIxNTE3NDMiLCJpYXQiOjE1NTU2ODEzMjAsImVtYWlsIjoiZ2hvc3RhckB0b3Bjb2Rlci5jb20iLCJqdGkiOiIxOWEwOTM3MC0yOTg4LTQ3YjgtOTE4OS0wZGE4NWM2MzRlZDIifQ.ieZlpLl55QdEK0SQTx6gjPgjOP-8h8EtsBQrp8B60WQ',
  invalidUser: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6WyJUb3Bjb2RlciBVc2VyIl0sImlzcyI6Imh0dHBzOi8vYXBpLnRvcGNvZGVyLWRldi5jb20iLCJoYW5kbGUiOiJHaG9zdGFyIiwiZXhwIjoxNTg1NjgxOTIwLCJ1c2VySWQiOiIxMTExMTE1MTc0MyIsImlhdCI6MTU1NTY4MTMyMCwiZW1haWwiOiJnaG9zdGFyQHRvcGNvZGVyLmNvbSIsImp0aSI6IjE5YTA5MzcwLTI5ODgtNDdiOC05MTg5LTBkYTg1YzYzNGVkMiJ9.xepbhFUhb4FpKfj9mTywtwIMYPRl8pJALuWe04ZxYQc',
  m2mRead: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL3RvcGNvZGVyLWRldi5hdXRoMC5jb20vIiwic3ViIjoiZW5qdzE4MTBlRHozWFR3U08yUm4yWTljUVRyc3BuM0JAY2xpZW50cyIsImF1ZCI6Imh0dHBzOi8vbTJtLnRvcGNvZGVyLWRldi5jb20iLCJpYXQiOjE1NTYwOTU5NjMsImV4cCI6MTU4NjE4MjM2MywiYXpwIjoiZW5qdzE4MTBlRHozWFR3U08yUm4yWTljUVRyc3BuM0IiLCJzY29wZSI6InRlcm1zOnJlYWQiLCJndHkiOiJjbGllbnQtY3JlZGVudGlhbHMifQ.7RW416Xd5ODDGpa2BToQQkxavEy-l_v89GJs-VlNQ-k',
  m2mWrite: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL3RvcGNvZGVyLWRldi5hdXRoMC5jb20vIiwic3ViIjoiZW5qdzE4MTBlRHozWFR3U08yUm4yWTljUVRyc3BuM0JAY2xpZW50cyIsImF1ZCI6Imh0dHBzOi8vbTJtLnRvcGNvZGVyLWRldi5jb20iLCJpYXQiOjE1NTYwOTU5NjMsImV4cCI6MTU4NjE4MjM2MywiYXpwIjoiZW5qdzE4MTBlRHozWFR3U08yUm4yWTljUVRyc3BuM0IiLCJzY29wZSI6InRlcm1zOndyaXRlIiwiZ3R5IjoiY2xpZW50LWNyZWRlbnRpYWxzIn0.oP2D79LytdGN8UXL3kZeR97emwk7-XLKo3EmYhvu7F0'
}

const user = {
  user1: {
    roles: [
      'Topcoder User',
      'Connect Support',
      'administrator',
      'testRole',
      'aaa',
      'tony_test_1',
      'Connect Manager',
      'Connect Admin',
      'copilot',
      'Connect Copilot Manager'
    ],
    iss: 'https://api.topcoder-dev.com',
    handle: 'TonyJ',
    exp: 1565681920,
    userId: '8547899',
    iat: 1555681320,
    email: 'ajefts@topcoder.com',
    jti: '19a09370-2988-47b8-9189-0da85c634ed2'
  },
  user2: {
    roles: [
      'Topcoder User'
    ],
    iss: 'https://api.topcoder-dev.com',
    handle: 'callmekatootie',
    exp: 1565681920,
    userId: '23124329',
    iat: 1555681320,
    email: 'callmekatootie@topcoder.com',
    jti: '19a09370-2988-47b8-9189-0da85c634ed2'
  },
  user3: {
    roles: [
      'Topcoder User'
    ],
    iss: 'https://api.topcoder-dev.com',
    handle: 'hohosky',
    exp: 1565681920,
    userId: '16096823',
    iat: 1555681320,
    email: 'callmekatootie@topcoder.com',
    jti: '19a09370-2988-47b8-9189-0da85c634ed2'
  },
  user4: {
    roles: [
      'Topcoder User'
    ],
    iss: 'https://api.topcoder-dev.com',
    handle: 'Ghostar',
    exp: 1565681920,
    userId: '151743',
    iat: 1555681320,
    email: 'ghostar@topcoder.com',
    jti: '19a09370-2988-47b8-9189-0da85c634ed2'
  },
  invalidUser: {
    roles: [
      'Topcoder User'
    ],
    iss: 'https://api.topcoder-dev.com',
    handle: 'Ghostar',
    exp: 1565681920,
    userId: '11111151743',
    iat: 1555681320,
    email: 'ghostar@topcoder.com',
    jti: '19a09370-2988-47b8-9189-0da85c634ed2'
  },
  m2mRead: {
    iss: 'https://topcoder-dev.auth0.com/',
    sub: 'enjw1810eDz3XTwSO2Rn2Y9cQTrspn3B@clients',
    aud: 'https://m2m.topcoder-dev.com/',
    iat: 1556095963,
    exp: 1566182363,
    azp: 'enjw1810eDz3XTwSO2Rn2Y9cQTrspn3B',
    scope: 'terms:read',
    gty: 'client-credentials',
    userId: null,
    scopes: [ 'terms:read' ],
    isMachine: true
  },
  m2mWrite: {
    iss: 'https://topcoder-dev.auth0.com/',
    sub: 'enjw1810eDz3XTwSO2Rn2Y9cQTrspn3B@clients',
    aud: 'https://m2m.topcoder-dev.com/',
    iat: 1556095963,
    exp: 1566182363,
    azp: 'enjw1810eDz3XTwSO2Rn2Y9cQTrspn3B',
    scope: 'terms:write',
    gty: 'client-credentials',
    userId: null,
    scopes: [ 'terms:write' ],
    isMachine: true
  }
}

const request = {
  createTermsOfUse: {
    requiredFields: ['typeId', 'title', 'agreeabilityTypeId'],
    reqBody: {
      text: 'text',
      typeId: 10,
      title: 'title',
      url: 'url',
      agreeabilityTypeId: 4,
      docusignTemplateId: 'test-template-1'
    }
  },
  updateTermsOfUse: {
    requiredFields: ['typeId', 'title', 'agreeabilityTypeId'],
    reqBody: {
      text: 'update-text',
      typeId: 11,
      title: 'update-title',
      url: 'update-url',
      agreeabilityTypeId: 4,
      docusignTemplateId: 'update-test-template-1'
    }
  },
  searchTermsOfUse: {
    response: {
      result: [
        {
          id: 20754,
          title: 'Standard Terms for Topcoder Competitions v2.2',
          url: '',
          text: 'text',
          agreeabilityType: 'Electronically-agreeable'
        },
        {
          id: 21303,
          title: 'Standard Terms for Topcoder Competitions v2.2',
          url: '',
          text: 'text',
          agreeabilityType: 'Electronically-agreeable'
        },
        {
          id: 21304,
          title: 'Standard Terms for Topcoder Competitions v2.2',
          url: '',
          text: 'another text',
          docusignTemplateId: '100',
          agreeabilityType: 'Docusign-template'
        },
        {
          id: 21305,
          title: 'Standard Terms for Topcoder Competitions v2.2',
          url: '',
          text: 'failure test case',
          agreeabilityType: 'Docusign-template'
        },
        {
          id: 21306,
          title: 'Standard Terms for Topcoder Competitions v2.2',
          url: '',
          text: 'text',
          agreeabilityType: 'Electronically-agreeable'
        }
      ]
    }
  },
  createTermsForResource: {
    requiredFields: ['reference', 'referenceId', 'tag', 'termsOfUseIds'],
    reqBody: {
      reference: 'challenge',
      referenceId: '12346',
      tag: 'copilot',
      termsOfUseIds: [21307]
    }
  },
  updateTermsForResource: {
    requiredFields: ['reference', 'referenceId', 'tag', 'termsOfUseIds'],
    reqBody: {
      reference: 'new-reference',
      referenceId: '11111',
      tag: 'tester',
      termsOfUseIds: [21303, 21304]
    }
  },
  searchTermsForResource: {
    response: {
      result: [
        {
          id: 'a41d1974-5823-473e-bacb-7eed17500ad3',
          reference: 'challenge',
          referenceId: '12345',
          tag: 'manager',
          termsOfUseIds: [
            '21307'
          ],
          createdBy: 'admin'
        },
        {
          id: 'a41d1974-5823-473e-bacb-7eed17500ad2',
          reference: 'challenge',
          referenceId: '12345',
          tag: 'copilot',
          termsOfUseIds: [
            '21307'
          ],
          createdBy: 'admin'
        },
        {
          id: 'a41d1974-5823-473e-bacb-7eed17500ad1',
          reference: 'challenge',
          referenceId: '12345',
          tag: 'submitter',
          termsOfUseIds: [
            '21303',
            '21304'
          ],
          createdBy: 'admin'
        }
      ]
    }
  },
  checkTermsForResource: {
    singleTag: {
      response: {
        result: [
          {
            tag: 'submitter',
            allAgreed: false,
            unAgreedTerms: [
              {
                id: 21304,
                title: 'Standard Terms for Topcoder Competitions v2.2',
                url: '',
                text: 'another text',
                agreed: false,
                docusignTemplateId: '100',
                agreeabilityType: 'Docusign-template'
              }
            ]
          }
        ]
      }
    },
    multipleTags: {
      response: {
        result: [
          {
            tag: 'submitter',
            allAgreed: false,
            unAgreedTerms: [
              {
                id: 21303,
                title: 'Standard Terms for Topcoder Competitions v2.2',
                url: '',
                text: 'text',
                agreed: false,
                agreeabilityType: 'Electronically-agreeable'
              },
              {
                id: 21304,
                title: 'Standard Terms for Topcoder Competitions v2.2',
                url: '',
                text: 'another text',
                agreed: false,
                docusignTemplateId: '100',
                agreeabilityType: 'Docusign-template'
              }
            ]
          },
          {
            tag: 'copilot',
            allAgreed: true,
            unAgreedTerms: []
          }
        ]
      }
    }
  }
}

module.exports = {
  token,
  user,
  request
}
