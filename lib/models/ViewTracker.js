import mongoose from 'mongoose';

const viewTrackerSchema = new mongoose.Schema({
    blogId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'blog',
        required: true
    },
    ipAddress: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    timestamp: {
        type: Date,
        default: Date.now,
        required: true
    }
}, {
    timestamps: true
});

// Create a compound unique index for view tracking
viewTrackerSchema.index(
    { blogId: 1, ipAddress: 1, userId: 1 },
    { unique: true, sparse: true }
);

// Single TTL index definition for timestamp
viewTrackerSchema.index(
    { timestamp: 1 },
    { expireAfterSeconds: 10800 } // 3 hours in seconds
);

const ViewTracker = mongoose.models.ViewTracker || mongoose.model('ViewTracker', viewTrackerSchema);

export default ViewTracker; 