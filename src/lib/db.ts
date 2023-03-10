import mongoose from 'mongoose';

export async function connect(mongoUri: string): Promise<typeof mongoose> {
  return mongoose.connect(mongoUri);
}

export async function disconnect(): Promise<void> {
  return mongoose.connection.close();
}

export function status(): keyof typeof mongoose.ConnectionStates {
  return mongoose.STATES[
    mongoose.connection.readyState
  ] as unknown as keyof typeof mongoose.ConnectionStates;
}
