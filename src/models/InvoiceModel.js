import mongoose, { Schema, models } from 'mongoose';

const invoiceModel = new Schema({
    customer: {
        type: Object,
        required: true
    },
    amount: {
        type: String,
        trim: true,
        required: true
    },
    status: {
        type: String,
        default: "Unpaid",
        required: true
    },
    sent: {
        type: Number,
        default: 0,
        required: true 
    }

},
{ timestamps: true }
)

const Invoice = models.Invoice || mongoose.model("Invoice", invoiceModel);
export default Invoice;