CREATE DATABASE photoshare;

CREATE TABLE users(
  id INT PRIMARY KEY NOT NULL,
  username VARCHAR(200) NOT NULL,
  email VARCHAR(200) NOT NULL, 
  icon_url VARCHAR(200) default NULL
  password VARCHAR(200) NOT NULL,
  UNIQUE (email, username)
);

CREATE TABLE rooms(
  id INT PRIMARY KEY NOT NULL, 
  members_count INT NOT NULL default 1,
);

CREATE TABLE messages(
  id INT PRIMARY KEY NOT NULL,
  body VARCHAR(500) NOT NULL, 
  sender_id INT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL default current_timestamp,
  room_id INT NOT NULL,
  CONSTRAINT fk_sender_id FOREIGN KEY(sender_id) REFERENCES users (id),
  CONSTRAINT fk_room_id FOREIGN KEY(room_id) REFERENCES rooms (id)
);

CREATE TYPE rel_status AS ENUM ('pending', 'approved');

CREATE TABLE relationships(
  id INT PRIMARY KEY NOT NULL, 
  request_id INT NOT NULL,
  reciever_id INT NOT NULL,
  status rel_status NOT NULL,
  CONSTRAINT fk_request_id FOREIGN KEY(request_id) REFERENCES users (id),
  CONSTRAINT fk_reciever_id FOREIGN KEY(reciever_id) REFERENCES users (id)
);

CREATE TABLE room_members(
  user_id INT NOT NULL,
  room_id INT NOT NULL,
  unseen_messages BOOLEAN NOT NULL default FALSE,
  room_name VARCHAR(20) NOT NULL,
  joined_at TIMESTAMPTZ NOT NULL default current_timestamp,
  icon_url VARCHAR(100), 
  CONSTRAINT fk_user_id FOREIGN KEY(user_id) REFERENCES users (id),
  CONSTRAINT fk_room_id FOREIGN KEY(room_id) REFERENCES rooms (id)
);