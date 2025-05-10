import { model, Schema } from "mongoose";


const chatSchema = new Schema({
    from: {
        type: Schema.Types.ObjectId,
        require: true,
    },
    to: {
        type: Schema.Types.ObjectId,
        require: true,
    },
    message: {
        type: String,
        require: true,
    },
}, {
    timestamps: true,
})

const Chat = model('chat', chatSchema);
export default Chat;