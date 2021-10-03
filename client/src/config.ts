// The apiId here identifies the API in AWS APIGateway that is being called.
// The apiEndpoint is the API's baseUrl.
const apiId = 't2w6qcs62f'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev-v9`

export const authConfig = {
  domain: 'wudev.auth0.com',                             // Auth0 domain
  clientId: '1rjeLFNomhhCoa9nEP0SKt5WAGi4sciN',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'          // callback url
}
