<h1>Quotastic</h1>
<p>This app will allow the user to register, write one paragraph of motivational quotes, review already registered users and their quotes, and upvote or downvote a quote. Users can also edit and delete only their own quotes.</p>
<ul>It has the following endpoints:
<li>/signup - Sign up to the system (username, password)</li>
<li>/login - Logs in an existing user with a password</li>
<li>/me - Get the currently logged in user information</li>
<li>/me/myquote - Post your quote</li>
<li>/me/myquote/:id - Update your quote (you can update only your quotes)</li>
<li>/me/update-password - Update the current users password</li>
<li>/me/update-avatar - Update the current users avatar</li>
<li>/quotes/:id - List username & result of votes of a user quote</li>
<li>/quotes/:id/upvote - Upvote a quote</li>
<li>/quotes/:id/downvote - Downvote a quote</li>
<li>/quotes - List users and quotes in a most upvoted to least liked quotes</li>
<li>me/quotes - Current users quotes</li>