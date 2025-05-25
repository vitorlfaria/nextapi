import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

const connect = async () => {
    const connectionState = mongoose.connection.readyState;

    if (connectionState === 1) {
        console.log('MongoDB connection already established');
        return;
    }

    if (connectionState === 2) {
        console.log('MongoDB connection in progress');
        return;
    }

    try {
        console.log(MONGODB_URI!);
        mongoose.connect(MONGODB_URI!, {
            dbName: 'nextapi',
            bufferCommands: true
        });
        console.log('MongoDB connection established');
    } catch (error: any) {
        console.error('Error: ', error);
        throw new Error('MongoDB connection failed: ', error);
    }
}

export default connect;
