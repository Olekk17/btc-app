This is my variant of test task completion.

What is done:

1. Created separate service_app that handles requests for required endpoints:
  - /api/rate:
    - get: returns the current BTC/UAH rate, which is loaded from the Coingecko public API.
    - post: sends the same rate to all the users that have subscribed using the next endpoint to this kind of email.
  - /api/emails:
    - get: returns all the emails ever added to the service, including unsubscribed ones
    - post: requires email in payload, adds this email to the list of subscribed users for the emails from above, checks if this email is already used.
    - delete: marks email as unsubscribed and adds deletedAt timestamp. This email won't be notified. Also, this email won't be able to subscribe again.
  - /api/metrics:
    - get: return Prometheus metrics required in tasks
2. Prometheus metrics are saved during the mentioned actions.
3. Except for the requested metrics, I've added one more - for saving the last BTC/UAH rate sent in the email. This is the easiest and most logical solution for the additional task: "Fetch the exchange rate hourly and send an email if the exchange rate changed more than 5% since the last email". The approach is to load metrics once an hour (what is required in the main task with no strict period of data saving), and after that, I compare the last sent price with the current one, and if the difference is more than 5% (it doesn't matter if 5% more than it was in last email or 5% less).
4. Added one more CRON job that sends the current rate daily at 9 AM (Using timezone Europe/Kyiv).
5. Added docker config for service_app, worker_app, and database. Also, migration is run for the DB in order to add required tables to the empty PostgreSQL database.
6. All DB actions are performed using Prisma ORM.

The /api prefix was added because it is said that "basePath: '/api'" in the task description. Probably, this is a misunderstanding, but whatever.

I've added envs with no sensitive data, but you have to add an SMPT email and password for the email service to actually work. I will provide you my credentials for the newly created email in DM, as I trust you, but they won't be saved in the repo.
