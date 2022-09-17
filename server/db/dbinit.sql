CREATE TABLE table_name ( +
    user_id SERIAL PRIMARY KEY,  + 
    username VARCHAR (50) NOT NULL,  +
    password VARCHAR (250) NOT NULL,  +
    max_streak INT NOT NULL
);
