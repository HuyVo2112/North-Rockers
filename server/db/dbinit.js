try {
    await client.query("CREATE TABLE [IF NOT EXISTS] table_name (" +
      "user_id serial PRIMARY KEY, " + 
      "username VARCHAR (50) NOT NULL, " +
      "password VARCHAR (250) NOT_NULL, " +
      "max_streak INT NOT_NULL", +
      ""
      table_constraints
   ); ")
  }