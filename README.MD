# RiteAid Appointment Notifier
Sends email notifications when a new vaccine appointment opens up at RiteAid

# ENV Variables
These variables can either be stored as system enviornment variables or via a .env file <br>
`EMAIL_USER` The username of the email sending the notifications <br>
`EMAIL_PASS` The password of the email sending the notifications <br>
`EMAIL_TARGET` The email(s) to send the notifications to. If multiple emails seperate with a comma

# To Run
1. Change `zipCode` and `searchDistance` variables at the top of index.js to desired paramaters
2. `npm install` installs dependencies
3. `npm start` runs program with dotenv enabled
