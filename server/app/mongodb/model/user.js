module.exports = (mongoose) => {
  const User = mongoose.model(
    "user",
    mongoose.Schema(
      { id: String, pw: String, name: String, email: String },
      { timestamps: true }
    )
  );
  return User;
};
