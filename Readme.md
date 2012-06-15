
# node-email-templates

Node.js module for rendering beautiful emails with [ejs][1] templates and email-friendly inline CSS using [juice][2].



## Quick start

1. Install the module for your respective project.

```bash
npm install email-templates
```

2. Create a folder called `templates` inside your root directory (or elsewhere).

3. For each of your templates, respectively name and create a folder inside the `templates` folder.

4. Add the following files inside the template's folder:

  * `html.ejs` - html + [ejs][1] version of your email template
  * `plaintext.ejs` - plaintext + [ejs][1] version of your email template
  * `style.css` - stylesheet for the template, which will render `html.ejs` with inline CSS (optional)

5. Utilize one of the examples below for your respective email module and start sending beautiful emails!



# Usage

Pass a valid directory path as an argument to the module.

```js
var path           = require('path')
  , emailTemplates = require('email-templates')(path.join(__dirname, 'templates'));
```

Then render a template for a single email or render multiple (having only loaded the template once).

```js
var path           = require('path')
  , templateDir    = path.join(__dirname, 'templates')
  , emailTemplates = require('email-templates');

emailTemplates(templatesDir, function(err, templates) {

  // Render a single email with one template
  var locals = { pasta: 'Spaghetti' };
  template('pasta-dinner', locals, function(err, html, text) {
    // ...
  });

  // Render multiple emails with one template
  var locals = [
    { pasta: 'Spaghetti' },
    { pasta: 'Rigatoni' }
  ];
  var Render = function(locals) {
    this.locals = locals;
    this.send = function(err, html, text) {
      // ...
    };
    this.batch = function(batch) {
      batch(this.locals, this.send);
    };
  };
  template('pasta-dinner', true, function(err, batch) {
    for(var user in users) {
      var render = new Render(users[user]);
      render.batch(batch);
    }
  });

});
```



## Example with [Nodemailer][3])

```js
var path           = require('path')
  , templatesDir   = path.resolve(__dirname, '..', 'templates')
  , emailTemplates = require('email-templates')
  , nodemailer     = require('nodemailer');

emailTemplates(templatesDir, function(err, template) {

  if (err) {
    console.log(err);
  } else {

    // ## Send a single email

    // Prepare nodemailer transport object
    var transport = nodemailer.createTransport("SMTP", {
      service: "Gmail",
      auth: {
        user: "some-user@gmail.com",
        pass: "some-password"
      }
    });

    // An example users object with formatted email function
    var locals = {
      email: 'mamma.mia@spaghetti.com',
      name: {
        first: 'Mamma',
        last: 'Mia'
      }
    };

    // Send a single email
    template('newsletter', locals, function(err, html, text) {
      if (err) {
        console.log(err);
      } else {
        transportBatch.sendMail({
          from: 'Spicy Meatball <spicy.meatball@spaghetti.com>',
          to: locals.email,
          subject: 'Mangia gli spaghetti con polpette!',
          html: html,
          // generateTextFromHTML: true,
          text: text
        }, function(err, responseStatus) {
          if (err) {
            console.log(err);
          } else {
            console.log(responseStatus.message);
          }
        });
      }
    });


    // ## Send a batch of emails and only load the template once

    // Prepare nodemailer transport object
    var transportBatch = nodemailer.createTransport("SMTP", {
      service: "Gmail",
      auth: {
        user: "some-user@gmail.com",
        pass: "some-password"
      }
    });

    // An example users object
    var users = [
      {
        email: 'pappa.pizza@spaghetti.com',
        name: {
          first: 'Pappa',
          last: 'Pizza'
        }
      },
      {
        email: 'mister.geppetto@spaghetti.com',
        name: {
          first: 'Mister',
          last: 'Geppetto'
        }
      }
    ];

    // Custom function for sending emails outside the loop
    //
    // NOTE:
    //  We need to patch postmark.js module to support the API call
    //  that will let us send a batch of up to 500 messages at once.
    //  (e.g. <https://github.com/diy/trebuchet/blob/master/lib/index.js#L160>)
    var Render = function(locals) {
      this.locals = locals;
      this.send = function(err, html, text) {
        if (err) {
          console.log(err);
        } else {
          transportBatch.sendMail({
            from: 'Spicy Meatball <spicy.meatball@spaghetti.com>',
            to: locals.email,
            subject: 'Mangia gli spaghetti con polpette!',
            html: html,
            // generateTextFromHTML: true,
            text: text
          }, function(err, responseStatus) {
            if (err) {
              console.log(err);
            } else {
              console.log(responseStatus.message);
            }
          });
        }
      };
      this.batch = function(batch) {
        batch(this.locals, this.send);
      };
    };

    // Load the template and send the emails
    template('newsletter', true, function(err, batch) {
      for(var user in users) {
        var render = new Render(users[user]);
        render.batch(batch);
      }
    });

  }
});
```



## Example with [Postmark App][4]) (utilizing [Postmark.js][5])

**NOTE**: Did you know `nodemailer` can also be used to send SMTP email through Postmark? See [this section][6] of their Readme for more info.

For more message format options, see [this section][7] of Postmark's developer documentation section.

```js
var path           = require('path')
  , templatesDir   = path.resolve(__dirname, '..', 'templates')
  , emailTemplates = require('email-templates')
  , postmark       = require('postmark')('your-api-key');

emailTemplates(templatesDir, function(err, template) {

  if (err) {
    console.log(err);
  } else {

    // ## Send a single email

    // An example users object with formatted email function
    var locals = {
      email: 'mamma.mia@spaghetti.com',
      name: {
        first: 'Mamma',
        last: 'Mia'
      }
    };

    // Send a single email
    template('newsletter', locals, function(err, html, text) {
      if (err) {
        console.log(err);
      } else {
        postmark.send({
          From: 'Spicy Meatball <spicy.meatball@spaghetti.com>',
          To: locals.email,
          Subject: 'Mangia gli spaghetti con polpette!',
          HtmlBody: html,
          TextBody: text
        }, function(err, response) {
          if (err) {
            console.log(err.status);
            console.log(err.message);
          } else {
            console.log(response);
          }
        });
      }
    });


    // ## Send a batch of emails and only load the template once

    // An example users object
    var users = [
      {
        email: 'pappa.pizza@spaghetti.com',
        name: {
          first: 'Pappa',
          last: 'Pizza'
        }
      },
      {
        email: 'mister.geppetto@spaghetti.com',
        name: {
          first: 'Mister',
          last: 'Geppetto'
        }
      }
    ];

    // Custom function for sending emails outside the loop
    //
    // NOTE:
    //  We need to patch postmark.js module to support the API call
    //  that will let us send a batch of up to 500 messages at once.
    //  (e.g. <https://github.com/diy/trebuchet/blob/master/lib/index.js#L160>)
    var Render = function(locals) {
      this.locals = locals;
      this.send = function(err, html, text) {
        if (err) {
          console.log(err);
        } else {
          postmark.send({
            From: 'Spicy Meatball <spicy.meatball@spaghetti.com>',
            To: locals.email,
            Subject: 'Mangia gli spaghetti con polpette!',
            HtmlBody: html,
            TextBody: text
          }, function(err, response) {
            if (err) {
              console.log(err.status);
              console.log(err.message);
            } else {
              console.log(response);
            }
          });
        }
      };
      this.batch = function(batch) {
        batch(this.locals, this.send);
      };
    };

    // Load the template and send the emails
    template('newsletter', true, function(err, batch) {
      for(user in users) {
        var render = new Render(users[user]);
        render.batch(batch);
      }
    });

  }
});
```



## Contributors

* Nick Baugh <niftylettuce@gmail.com>



## License

MIT Licensed



[1]:
[2]:
[3]: https://github.com/andris9/Nodemailer
[4]: http://postmarkapp.com/
[5]: https://github.com/voodootikigod/postmark.js
[6]: https://github.com/andris9/Nodemailer#well-known-services-for-smtp
[7]: http://developer.postmarkapp.com/developer-build.html#message-format