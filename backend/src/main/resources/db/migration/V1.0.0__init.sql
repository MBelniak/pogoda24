CREATE TABLE fact (
  id                       BIGINT PRIMARY KEY AUTO_INCREMENT,
  post_date                TIMESTAMP DEFAULT CURRENT_TIMESTAMP not null,
  description              nvarchar,
  images_public_ids_json   nvarchar
);

CREATE TABLE forecast (
  id                       BIGINT PRIMARY KEY AUTO_INCREMENT,
  post_date                TIMESTAMP DEFAULT CURRENT_TIMESTAMP not null,
  description              nvarchar,
  images_public_ids        nvarchar
);

CREATE TABLE warning (
  id                      BIGINT PRIMARY KEY AUTO_INCREMENT,
  post_date               TIMESTAMP DEFAULT CURRENT_TIMESTAMP not null,
  description             nvarchar,
  images_public_ids_json  nvarchar,
  is_added_to_top_bar     boolean,
  due_date                DATE,
  due_time                TIME,
  short_description       nvarchar
);

create sequence hibernate_sequence;
