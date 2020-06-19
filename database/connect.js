const mongoose = require("mongoose");
mongoose.connect(`mongodb://main:WDRPJfaw8hcCBAvQ@104.243.43.144:27017/test`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  });