CREATE TABLE post (
  id                      BIGINT PRIMARY KEY AUTO_INCREMENT,
  post_type               nvarchar DEFAULT 'FORECAST' not null,
  post_date               TIMESTAMP DEFAULT CURRENT_TIMESTAMP not null,
  title                   nvarchar(100),
  description             nvarchar,
  images_public_ids       nvarchar,
  views                   BIGINT
);

create sequence hibernate_sequence;

CREATE TABLE warning_info (
  id                  BIGINT PRIMARY KEY AUTO_INCREMENT,
  due_date            TIMESTAMP DEFAULT CURRENT_TIMESTAMP not null,
  short_description   nvarchar,
  post_id             BIGINT
);

CREATE TABLE site_traffic (
  id      BIGINT PRIMARY KEY AUTO_INCREMENT,
  date    DATE DEFAULT GETDATE() not null,
  views   BIGINT
);