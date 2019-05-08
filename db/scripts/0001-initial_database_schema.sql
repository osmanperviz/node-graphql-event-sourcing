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
  text_search tsvector,
  CONSTRAINT user_read_model_primary_key PRIMARY KEY(id)
);

CREATE FUNCTION update_user_read_model_text_search() RETURNS trigger AS $$
  BEGIN
    new.text_search :=
      setweight(to_tsvector('german', coalesce(new.read_model->>'email','')), 'A') ||
      setweight(to_tsvector('german', coalesce(new.read_model->>'firstName','')), 'A') ||
      setweight(to_tsvector('german', coalesce(new.read_model->>'lastName','')), 'A');
    RETURN new;
  END
$$ LANGUAGE plpgsql;

CREATE TRIGGER user_read_model_text_search_trigger
  BEFORE INSERT OR UPDATE ON user_read_model FOR EACH ROW
  EXECUTE PROCEDURE update_user_read_model_text_search();
