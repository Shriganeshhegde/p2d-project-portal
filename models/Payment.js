const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    currency: {
        type: String,
        default: 'INR',
        uppercase: true
    },
    paymentMethod: {
        type: String,
        required: true,
        enum: ['credit_card', 'debit_card', 'net_banking', 'upi', 'wallet', 'other']
    },
    paymentGateway: {
        type: String,
        required: true,
        enum: ['razorpay', 'stripe', 'paypal', 'paytm', 'instamojo', 'other'],
        default: 'razorpay'
    },
    status: {
        type: String,
        enum: ['pending', 'processing', 'completed', 'failed', 'refunded', 'cancelled'],
        default: 'pending'
    },
    transactionId: {
        type: String,
        unique: true,
        sparse: true
    },
    paymentDate: {
        type: Date
    },
    receipt: {
        type: String // URL to the payment receipt
    },
    gatewayResponse: {
        type: mongoose.Schema.Types.Mixed // Raw response from payment gateway
    },
    invoiceNumber: {
        type: String,
        unique: true,
        sparse: true
    },
    taxAmount: {
        type: Number,
        default: 0
    },
    discount: {
        amount: {
            type: Number,
            default: 0
        },
        code: String,
        description: String
    },
    refunds: [{
        amount: Number,
        reason: String,
        processedAt: {
            type: Date,
            default: Date.now
        },
        status: {
            type: String,
            enum: ['pending', 'processed', 'failed'],
            default: 'pending'
        },
        referenceId: String
    }],
    metadata: {
        type: Map,
        of: String
    }
}, {
    timestamps: true
});

// Indexes for better query performance
PaymentSchema.index({ student: 1, status: 1 });
PaymentSchema.index({ project: 1 });
PaymentSchema.index({ transactionId: 1 }, { unique: true, sparse: true });
PaymentSchema.index({ 'refunds.status': 1 });

// Virtual for formatted amount (e.g., "₹500.00")
PaymentSchema.virtual('formattedAmount').get(function() {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: this.currency || 'INR'
    }).format(this.amount);
});

// Static method to get total payments by status
PaymentSchema.statics.getTotalByStatus = async function(status) {
    const result = await this.aggregate([
        { $match: { status: status } },
        { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } }
    ]);
    
    return result.length > 0 ? result[0] : { total: 0, count: 0 };
};

// Method to process refund
PaymentSchema.methods.processRefund = async function(amount, reason = '') {
    if (this.status !== 'completed') {
        throw new Error('Only completed payments can be refunded');
    }
    
    if (amount > this.amount) {
        throw new Error('Refund amount cannot exceed payment amount');
    }
    
    // In a real app, this would integrate with the payment gateway
    this.refunds.push({
        amount,
        reason,
        status: 'pending'
    });
    
    // Update payment status if full amount is being refunded
    if (amount === this.amount) {
        this.status = 'refunded';
    }
    
    await this.save();
    
    // In a real app, you would process the refund asynchronously
    return this;
};

// Pre-save hook to generate invoice number
PaymentSchema.pre('save', async function(next) {
    if (this.isNew && !this.invoiceNumber) {
        const count = await this.constructor.countDocuments();
        this.invoiceNumber = `INV-${Date.now()}-${count + 1}`;
    }
    next();
});

module.exports = mongoose.model('Payment', PaymentSchema);
