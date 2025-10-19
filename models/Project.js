const mongoose = require('mongoose');

const DocumentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    path: {
        type: String,
        required: true
    },
    uploadDate: {
        type: Date,
        default: Date.now
    },
    size: {
        type: Number
    },
    mimeType: {
        type: String
    }
});

const ProjectSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true
    },
    semester: {
        type: Number,
        required: true
    },
    document: {
        type: String, // Path to the main project document
        required: true
    },
    additionalDocuments: [DocumentSchema],
    status: {
        type: String,
        enum: ['draft', 'submitted', 'under_review', 'approved', 'revision_requested', 'rejected'],
        default: 'draft'
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'failed', 'refunded'],
        default: 'pending'
    },
    submissionDate: {
        type: Date,
        default: Date.now
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    },
    review: {
        score: {
            type: Number,
            min: 0,
            max: 100
        },
        feedback: String,
        reviewedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        reviewedAt: Date
    },
    tags: [{
        type: String
    }],
    isPublished: {
        type: Boolean,
        default: false
    },
    metadata: {
        pages: Number,
        wordCount: Number,
        fileSize: Number
    }
}, {
    timestamps: true
});

// Indexes for better query performance
ProjectSchema.index({ student: 1, status: 1 });
ProjectSchema.index({ department: 1, semester: 1 });
ProjectSchema.index({ title: 'text', description: 'text' });

// Update lastUpdated timestamp before saving
ProjectSchema.pre('save', function(next) {
    this.lastUpdated = Date.now();
    next();
});

// Virtual for getting project status in a more readable format
ProjectSchema.virtual('statusFormatted').get(function() {
    return this.status
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
});

// Static method to get projects by status
ProjectSchema.statics.findByStatus = function(status) {
    return this.find({ status: new RegExp(status, 'i') });
};

// Instance method to check if project is reviewable
ProjectSchema.methods.isReviewable = function() {
    return this.status === 'submitted' || this.status === 'revision_requested';
};

// Add text search index for project search
ProjectSchema.index({
    title: 'text',
    description: 'text',
    'review.feedback': 'text'
});

module.exports = mongoose.model('Project', ProjectSchema);
