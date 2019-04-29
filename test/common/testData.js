/*
 * Test data to be used in tests
 */

const token = {
  user1: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6WyJUb3Bjb2RlciBVc2VyIiwiQ29ubmVjdCBTdXBwb3J0IiwiYWRtaW5pc3RyYXRvciIsInRlc3RSb2xlIiwiYWFhIiwidG9ueV90ZXN0XzEiLCJDb25uZWN0IE1hbmFnZXIiLCJDb25uZWN0IEFkbWluIiwiY29waWxvdCIsIkNvbm5lY3QgQ29waWxvdCBNYW5hZ2VyIl0sImlzcyI6Imh0dHBzOi8vYXBpLnRvcGNvZGVyLWRldi5jb20iLCJoYW5kbGUiOiJUb255SiIsImV4cCI6MTU2NTY4MTkyMCwidXNlcklkIjoiODU0Nzg5OSIsImlhdCI6MTU1NTY4MTMyMCwiZW1haWwiOiJhamVmdHNAdG9wY29kZXIuY29tIiwianRpIjoiMTlhMDkzNzAtMjk4OC00N2I4LTkxODktMGRhODVjNjM0ZWQyIn0.V8nsQpbzQ_4iEd0dAbuYsfeydnhSAEQ95AKKwl8RONw',
  user2: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6WyJUb3Bjb2RlciBVc2VyIl0sImlzcyI6Imh0dHBzOi8vYXBpLnRvcGNvZGVyLWRldi5jb20iLCJoYW5kbGUiOiJjYWxsbWVrYXRvb3RpZSIsImV4cCI6MTU2NTY4MTkyMCwidXNlcklkIjoiMjMxMjQzMjkiLCJpYXQiOjE1NTU2ODEzMjAsImVtYWlsIjoiY2FsbG1la2F0b290aWVAdG9wY29kZXIuY29tIiwianRpIjoiMTlhMDkzNzAtMjk4OC00N2I4LTkxODktMGRhODVjNjM0ZWQyIn0.HhZSFbt2zbPcMd3U45ZUDIuylSgOOWXG58MV1D-SvkQ',
  user3: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6WyJUb3Bjb2RlciBVc2VyIl0sImlzcyI6Imh0dHBzOi8vYXBpLnRvcGNvZGVyLWRldi5jb20iLCJoYW5kbGUiOiJob2hvc2t5IiwiZXhwIjoxNTY1NjgxOTIwLCJ1c2VySWQiOiIxNjA5NjgyMyIsImlhdCI6MTU1NTY4MTMyMCwiZW1haWwiOiJjYWxsbWVrYXRvb3RpZUB0b3Bjb2Rlci5jb20iLCJqdGkiOiIxOWEwOTM3MC0yOTg4LTQ3YjgtOTE4OS0wZGE4NWM2MzRlZDIifQ.Zym_RxIT9UElcnhbPzC-N_y1XB7FjZtCqqZZkDjX6Po',
  user4: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6WyJUb3Bjb2RlciBVc2VyIl0sImlzcyI6Imh0dHBzOi8vYXBpLnRvcGNvZGVyLWRldi5jb20iLCJoYW5kbGUiOiJHaG9zdGFyIiwiZXhwIjoxNTY1NjgxOTIwLCJ1c2VySWQiOiIxNTE3NDMiLCJpYXQiOjE1NTU2ODEzMjAsImVtYWlsIjoiZ2hvc3RhckB0b3Bjb2Rlci5jb20iLCJqdGkiOiIxOWEwOTM3MC0yOTg4LTQ3YjgtOTE4OS0wZGE4NWM2MzRlZDIifQ.VhkmYy_06PBdp48kC34pJ5u4mussfYV80jJQF7Dgqt4',
  invalidUser: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6WyJUb3Bjb2RlciBVc2VyIl0sImlzcyI6Imh0dHBzOi8vYXBpLnRvcGNvZGVyLWRldi5jb20iLCJoYW5kbGUiOiJHaG9zdGFyIiwiZXhwIjoxNTY1NjgxOTIwLCJ1c2VySWQiOiIxMTExMTE1MTc0MyIsImlhdCI6MTU1NTY4MTMyMCwiZW1haWwiOiJnaG9zdGFyQHRvcGNvZGVyLmNvbSIsImp0aSI6IjE5YTA5MzcwLTI5ODgtNDdiOC05MTg5LTBkYTg1YzYzNGVkMiJ9.2sl-wdytuOxGRExQAggLShEnmjM0zm9Ew9mX4ufozNg',
  m2m: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL3RvcGNvZGVyLWRldi5hdXRoMC5jb20vIiwic3ViIjoiZW5qdzE4MTBlRHozWFR3U08yUm4yWTljUVRyc3BuM0JAY2xpZW50cyIsImF1ZCI6Imh0dHBzOi8vbTJtLnRvcGNvZGVyLWRldi5jb20vIiwiaWF0IjoxNTU2MDk1OTYzLCJleHAiOjE1NjYxODIzNjMsImF6cCI6ImVuancxODEwZUR6M1hUd1NPMlJuMlk5Y1FUcnNwbjNCIiwic2NvcGUiOiJyZWFkOmNoYWxsZW5nZXMgcmVhZDpzdWJtaXNzaW9uIHJlYWQ6cmV2aWV3X3R5cGUgYWxsOnJldmlldyIsImd0eSI6ImNsaWVudC1jcmVkZW50aWFscyJ9.Rh0zx0OK9uYJywkC-jwksnT9YpUHQDc2Q7GXWiKXngk'
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
  }
}

module.exports = {
  token,
  user
}
