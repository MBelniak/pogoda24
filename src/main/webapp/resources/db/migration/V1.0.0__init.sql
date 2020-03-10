CREATE TABLE forecast_map (
  id          BIGINT PRIMARY KEY AUTO_INCREMENT,
  image_url   nvarchar not null,
  post_id     BIGINT not null
);

CREATE TABLE post (
  id          BIGINT PRIMARY KEY AUTO_INCREMENT,
  post_date   TIMESTAMP DEFAULT CURRENT_TIMESTAMP not null,
  description nvarchar
);

create sequence hibernate_sequence;

ALTER TABLE forecast_map
    ADD FOREIGN KEY (post_id) references post(id);
