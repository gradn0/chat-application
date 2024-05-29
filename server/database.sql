CREATE DATABASE photoshare;

CREATE TABLE users(
  id BIGSERIAL PRIMARY KEY NOT NULL,
  username VARCHAR(200) NOT NULL,
  email VARCHAR(200) NOT NULL, 
  password VARCHAR(200) NOT NULL,
  UNIQUE (email, username)
);

CREATE TABLE rooms(
  id BIGSERIAL PRIMARY KEY NOT NULL, 
  name VARCHAR(20) NOT NULL,
  icon_url VARCHAR(100)
);

CREATE TABLE messages(
  id BIGSERIAL PRIMARY KEY NOT NULL,
  body VARCHAR(500) NOT NULL, 
  sender_id INT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL default current_timestamp,
  room_id INT NOT NULL,
  CONSTRAINT fk_sender_id FOREIGN KEY(sender_id) REFERENCES users (id),
  CONSTRAINT fk_room_id FOREIGN KEY(room_id) REFERENCES rooms (id)
);

CREATE TYPE rel_status AS ENUM ('pending', 'approved', 'denied');

CREATE TABLE relationships(
  id BIGSERIAL PRIMARY KEY NOT NULL, 
  request_id INT NOT NULL,
  reciever_id INT NOT NULL,
  status rel_status NOT NULL,
  CONSTRAINT fk_request_id FOREIGN KEY(request_id) REFERENCES users (id),
  CONSTRAINT fk_reciever_id FOREIGN KEY(reciever_id) REFERENCES rooms (id)
);