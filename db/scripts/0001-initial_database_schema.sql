CREATE TABLE event (
  entity_id varchar(40),
  index integer,
  event jsonb NOT NULL
);

--
-- user_read_model
--

CREATE TABLE user_read_model (
  id varchar(40),
  read_model jsonb NOT NULL,
  schema_version integer,
  CONSTRAINT user_read_model_primary_key PRIMARY KEY(id)
);
