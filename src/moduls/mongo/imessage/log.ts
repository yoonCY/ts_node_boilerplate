export default (mongoose: any) => {

    return new mongoose.Schema({
        event_name: String,
        type: { type: String, default: "socket" },
        count: { type: Number, default: 1 },
        log_date: String,
        params: mongoose.Schema.Types.Mixed
    })

};
