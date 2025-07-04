import mongoose from 'mongoose';
const connectDB = async () => {
	const mongoURI =
		process.env.NODE_ENV === 'Production'
			? process.env.MONGO_URI_PROD
			: process.env.MONGO_URI_DEV;

	if (!mongoURI) {
		throw new Error('❌ MONGO_URI is not set in environment variables!');
	}
	try {
		await mongoose.connect(mongoURI, {});
		console.log('✅ MongoDB Connected');
	} catch (err) {
		console.error('❌ MongoDB Error:', err);
		process.exit(1); // Exit process on failure
	}
};

export default connectDB;
