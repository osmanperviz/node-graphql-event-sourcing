CREATE TABLE schema_version (
  version integer,
  description varchar(4000) NOT NULL,
  state varchar(100) NOT NULL,
  begin_date timestamp NOT NULL,
  end_date timestamp,
  duration integer,
  CONSTRAINT schema_version_primary_key PRIMARY KEY(version)
);
