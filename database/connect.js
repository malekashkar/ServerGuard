const mongoose = require("mongoose");
mongoose.connect(`mongodb://mainUser:WDRPJfaw8hcCBAvQ@104.243.43.144/mainDB`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  });