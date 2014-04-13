rosewatch
=========

A bot for "My Wife!"

## Usage
forever -o rosewatch.log start index.js --config config2.json

## Example Config file:

```javascript
{
  "email-account" : "user@email.com",
  "email-password" : "password",
  "email-from" : "Some Name <from@email.com>",
  "email-addresses" : "sendto@email.com",
  "website" : "http://somewebsite/page-to-check"
}
```
