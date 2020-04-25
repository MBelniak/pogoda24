CREATE TABLE post (
  id                      BIGINT PRIMARY KEY AUTO_INCREMENT,
  post_type               nvarchar DEFAULT 'FORECAST' not null,
  post_date               TIMESTAMP DEFAULT CURRENT_TIMESTAMP not null,
  description             nvarchar,
  images_public_ids       nvarchar,
  is_added_to_top_bar     boolean,
  due_date                TIMESTAMP,
  short_description       nvarchar,
  views                   BIGINT
);

create sequence hibernate_sequence;

CREATE TABLE site_traffic (
  id      BIGINT PRIMARY KEY AUTO_INCREMENT,
  date    TIMESTAMP DEFAULT CURRENT_TIMESTAMP not null,
  views   BIGINT
);