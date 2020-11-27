import mongoose from 'mongoose';

export const createDbConnection = async () => {
  const dbConnectionUrl = process.env.MONGO_CONNECTION_URL;

  if (!dbConnectionUrl) {
    throw new Error('environment variable MONGO_CONNECTION_URL is not specified');
  }

  await mongoose.connect(dbConnectionUrl, { useNewUrlParser: true, useUnifiedTopology: true });
}

