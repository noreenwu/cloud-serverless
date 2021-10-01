// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
// const apiId = 'x5n3x9nt4a'
const apiId = '664e4eb7vg'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev-v7`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map
  domain: 'wudev.auth0.com',            // Auth0 domain
  clientId: '1rjeLFNomhhCoa9nEP0SKt5WAGi4sciN',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
