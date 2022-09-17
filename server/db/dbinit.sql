DROP TABLE users;
CREATE TABLE IF NOT EXISTS users (
    username VARCHAR(250) UNIQUE NOT NULL,
    password VARCHAR(250) NOT NULL,
    max_streak INT NOT NULL,
    PRIMARY KEY (username)
);

DROP TABLE videos;
CREATE TABLE IF NOT EXISTS videos (
    video_id VARCHAR(250) UNIQUE NOT NULL,
    likes INT,
    PRIMARY KEY (video_id)
);

DROP TABLE laughs;
CREATE TABLE IF NOT EXISTS laughs (
    username VARCHAR(250) UNIQUE NOT NULL,
    video_id VARCHAR(250) UNIQUE NOT NULL,
    FOREIGN KEY(video_id) REFERENCES videos(video_id),
    FOREIGN KEY(username) REFERENCES users(username),
    PRIMARY KEY(video_id, username)
);

DROP TABLE followings;
CREATE TABLE IF NOT EXISTS followings (
    username VARCHAR(250) UNIQUE NOT NULL,
    following_username VARCHAR(250) UNIQUE NOT NULL,
    FOREIGN KEY(username) REFERENCES users(username),
    FOREIGN KEY(following_username) REFERENCES users(username),
    PRIMARY KEY(username, following_username)
);




