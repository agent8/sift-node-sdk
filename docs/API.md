# API

This page contains information on the SDK's classes, methods and functions.

## class SiftAPI

A client for EasilyDo's Sift API. Sift is an Artificial Intelligence for Email
that creates relevant features for your users with an email parse API that
simplifies and understands mail.

You can read more about [Sift here](http://sift.easilydo.com).

The SiftAPI object returns a Promise for each of the API endpoint implemented.
You can read more about Promises [here](https://developer.mozilla.org/en-US/do
cs/Web/JavaScript/Reference/Global_Objects/Promise).

**Parameters**

* `apiKey` - A `string` that can be found from the [developer's dashboard](htt
ps://sift.easilydo.com/sift/dashboard)
* `apiSecret` - A `string` that can be found from the [developer's dashboard](h
ttps://sift.easilydo.com/sift/dashboard)

**Example**

ES6/7:
```javascript
import { SiftAPI } from 'siftapi';

let sift = new Sift('<API_KEY>', '<API_SECRET>');
```

ES5:
```javascript
var siftapi = require('siftapi');

var sift = new siftapi.SiftAPI('<API_KEY>', '<API_SECRET>');
```

## Methods

### discovery

Returns the parsed `eml` file in the Promise.

**Parameters**

* `username`: A `string` that is the username to perform Discovery with
* `filename`: A `string` that is the absolute path of the `eml` file

**Example**

ES6/7:
```javascript
import fs from 'fs';

let data;
fs.readFile('<filename>', (err, eml) => {
    if(err) {
        return console.log(err);
    }

    sift.discovery('<username>', eml)
        .then(body => {
            data = body
        })
        .catch(err => {
            return console.log('err');
        });
});
```

ES5:
```javascript
var fs = require('fs');

var data;
fs.readFile('<filename>', function(err, eml) {
    if(err) {
        return console.log(err);
    }

    sift.discovery('<username>', eml)
        .then(function(body) {
            data = body
        })
        .catch(function(err) {
            return console.log(err);
        });
});
```

### addUser

Adds a new user with the given username. The add connections API will
automatically create an account if it doesn't exist.

**Parameters**

* `username`: A `string` that is the expected username of the new user
* `locale`: A `string` that is the locale of the new user

**Examples**

```JavaScript
let newUser;
sift.addUser('test')
    .then(body => {
        newUser = body.result;
        /*
        {
            "user_id": "<newly created user id>",
            "username": "<given user name>"
        }
        */
    })
    .catch(err => {
        console.log(err)
    });
```

### deleteUser

Removes a user with the given username.

**Parameters**

* `username`: A `string` that is the expected username of the user to be removed

**Example**

```javascript
sift.deleteUser('test')
    .then(body => {
        console.log(body.result); // "deleted"
    })
    .catch(err => {
        console.log(err)
    });
```

### getEmailConnections

Get all email connections linked to the user account.

**Parameters**

* `username`: A `string` that is the expected username of the user to obtain
    the email connections from

**Example**

```javascript
sift.getEmailConnections('test')
    .then(body => {
        if (body.message !== 'success' && body.code !== 200) {
            return console.log(body.message);
        }
        console.log(body.result);
        /*
        [{
            "email": "johndoe@gmail.com",
            "state": "<valid or invalid>",
            "id": 2,
            "email_type": "google"
        },
        {
            "email": "john.doe@icloud.com",
            "state": "<valid or invalid>",
            "id": 3,
            "email_type": "imap"
        }]
        */
    })
    .catch(err => {
        console.log(err);
    });
```

### addEmailConnection

Adds a new email connection to the user account.

**Parameters**

* `username`: A `string` that is the expected username of the user to add the email
    connection to
* `accountType`: A `string`, `google`/`yahoo`/`live`/`imap`/`exchange`
* `emailParams`: An `object` containing account specific parameters, see below
    for which parameter to include

**Account Specific Parameters**

*Gmail*

```
{
    "account": <Email address associated with Google>,
    "refresh_token": <The refresh token for the OAuth2 connection>
}
```

*Yahoo*

```
{
    "account": <Email address associated with Yahoo>,
    "refresh_token": <The refresh token for the OAuth2 connection,>
    "redirect_uri": <The redirect URI that was used for the OAuth2 connection>
}
```

*Microsoft Live/Hotmail*

```
{
    "refresh_token": <The refresh token for the OAuth2 connection>,
    "redirect_uri": <The redirect URI that was used for the OAuth2 connection>
}
```

*IMAP*

```
{
    "account": <Email address associated with the IMAP account>,
    "password": <Password for the IMAP account>,
    "host": <Host for the IMAP account>
}
```

*Exchange*

```
{
    "email": <Email address for the Exchange account>,
    "password": <Password for the Exchange account>,
    "host": <Host of the exchange account> (Optional),
    "account": <Username for the Exchange account> (Optional)
}
```

**Example**

```javascript
let params = {
    account: "username@gmail.com",
    refresh_token: "token"
};

let newEmailConnectionId;
sift.addEmailConnection('username', 'google' params)
    .then(body => {
        newEmailConnectionId = body.result.id
        console.log(body);
        /*
        {
            "message": "success",
            "code": 200,
            "id": "<uuid>",
            "result": {
                "id": "<newly created connection_id>"
            }
        }
        */
    })
    .catch(err => {
        return console.log(err);
    });
```

## deleteEmailConnection

Deletes an email connection from the given user.

**Parameters**

* `username`: A `string` that is the userame of the user to remove the
    connection from
* `connection_id`: An `integer` that is the connection to be removed

**Example**

```javascript
sif.deleteEmailConnection('username', 'connection_id')
    .then(body => {
        console.log(body);
        /*
        {
            "message": "success",
            "code": 200,
            "id": "<uuid>",
            "result": "deleted"
        }
        */
    })
    .catch(err => {
        return console.log(err);
    });
```

## getSifts

Get all Sifts(tasks) from the user.

**Parameters**

* `username` - A `string` that is the username of the user to get the Sifts
    from
* `params` - An `object` that contains additional params.
    - `limit` - The maximum number of results to return. Developer can set any
        value between 0 to 100 and max is 100. (Defaults to 100)
    - `offset` - Start the list at this offset (zero-based)
    - `last_update_time` - Epoch timestamp. Returns results with last update
        time greater than (that is, more recent than) the specified time.
    - `domains` - A list of domains separated by comma. The domain should be
        one of the following string: flight, hotel, rentalcar, train,
        boardingpass, shipment, contact, purchase, reservation, event, deal,
        bill. If omited, this api will return the sifts with all domains.

**Example**

```javascript
sift.getSifts('username', {})
    .then(body => {
        console.log(body)
        /*
        {
            "message": "success",
            "code": 200,
            "id": "<uuid>",
            "result": [
                {
                    "payload": <schema object for sift payload>,
                    "sift_id": <sift id>,
                    "mime_id": <id of raw email message>,
                    "fid": <id of folder in the email server>,
                    "mid": <id of message in the email server>,
                    "account_id": <id of email account>,
                    "user_id": <id of user>
                }, ...
            ]
        }
        */
    })
    .catch(err => {
        console.log(err);
    });
```

## getSift

Get a single Sift from the user.

**Parameters**

* `username` - A `string` that is the username of the user to get the Sifts
    from
* `siftId` - An `integer` that is the ID of the Sift to get from the user
* `params` - An `object` that contains:
    {
        include_eml: 1 <- if an eml MIME file is wanted together with the
                            payload
    }

**Example**

```javascript
sift.getSift('username', '<sift_id>', { include_eml: 1 })
    .then(body => {
        console.log(body)
        /*
        {
            "message": "success",
            "code": 200,
            "id": "<uuid>",
            "result": {
                    "payload": <schema object for sift payload>,
                    "sift_id": <sift id>,
                    "mime_id": <id of raw email message>,
                    "fid": <id of folder in the email server>,
                    "mid": <id of message in the email server>,
                    "account_id": <id of email account>,
                    "user_id": <id of user>
            }
        }
        */
    })
    .catch(err => {
        console.log(err);
    });
```

## getConnectToken

Get a new token for specific user.

**Parameters**

* `username` - A `string` that is the username of the user to get the token
    for

**Example**

```javascript
let connectToken;
sift.getConnectToken('username')
    .then(body => {
        console.log(body);
        /*
        {
            "message": "success",
            "code": 200,
            "id": "<uuid>",
            "result": {
                "connect_token": "<newly created connect_token>"
            }
        }
        */
    })
    .catch(err => {
        return console.log(err);
    });
```

## postFeedback

Gives feedback to the EasilyDo team.

**Parameters**

* `email` - A `string` that is the contents of the eml file, similar to the one
    sent to `discovery`
* `locale`: A `string` that is the locale of the email
* `timezone`: A `string` that is the timezone of the email

**Example**

```javascript
sift.postFeedback(emlString, 'en_US', 'America/Los_Angeles')
    .then(body = {
        console.log(body);
        /*
        {
            "message": "OK",
            "code": 200,
            "id": "<uuid>",
            "result": {
                "bill": {"extracted": true, "classified": true}
            }
        }
        */
    })
    .catch(err => {
        return console.log(err);
    });
```

