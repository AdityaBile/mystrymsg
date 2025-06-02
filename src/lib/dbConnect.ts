import mongoose from "mongoose";

//NOTE : In Next js, it is not connected all time to DB. Thus when data is required connection is made.
/*
  mongoose.connection() : initiates a connection to a MongoDB database
  process.env : to retrieve the connection details (like the database URI, username, password) from the environment variables.
  || "" : This is a fallback. If the MONGODB_URI environment variable is not set (or is empty), the empty string "" will be used as the connection string. 
  {} : This is an empty options object. It can be used to configure various settings for the connection.
*/

type ConnectionObject = {
  isConnected?: number; // "?" : if isConnected is present then its type is number
};

const connection: ConnectionObject = {};

// Note : In Ts, void is any data
async function dbConnect(): Promise<void> {
  if (connection.isConnected) {
    console.log("Already connected to Database");
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI || "", {});

    connection.isConnected = db.connections[0].readyState;
    console.log("DB coneected successfully");
  } catch (error) {
    console.log("Database connection failed", error);
    process.exit(1);
  }
}

export default dbConnect;
