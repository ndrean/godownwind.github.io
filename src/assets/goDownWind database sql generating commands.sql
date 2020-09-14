CREATE TABLE "events" (
  "id" varchar,
  "directCLurl" string,
  "publicID" string,
  "url" string,
  "participants" jsonb,
  "user_id" bigint,
  "itinary_id" bigint,
  "created_at" datetime,
  "updated_at" datetime,
  "comment" text
);

CREATE TABLE "itinaries" (
  "id" varchar,
  "date" date,
  "start" string,
  "end" string,
  "distance" decimal,
  "created_at" datetime,
  "updated_at" datetime,
  "end_gps" decimal,
  "start_gps" decimal
);

CREATE TABLE "users" (
  "id" varchar,
  "email" string,
  "password_digest" string,
  "confirm_token" string,
  "confirm_email" boolean,
  "access_token" string,
  "uid" string,
  "created_at" datetime,
  "updated_at" datetime
);

ALTER TABLE "itinaries" ADD CONSTRAINT "fk_rails_events_itinaries" FOREIGN KEY ("id") REFERENCES "events" ("itinary_id");

ALTER TABLE "users" ADD CONSTRAINT "fk_rails_events_users" FOREIGN KEY ("id") REFERENCES "events" ("user_id");
