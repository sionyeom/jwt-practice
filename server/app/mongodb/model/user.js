module.exports = (mongoose) => {
  const User = mongoose.model(
    "user",
    mongoose.Schema(
      {
        id: String,
        pw: String,
        name: String,
        email: String,
        // jwt-refresh 토큰 보관
        refreshtoken: {
          type: String,
          default: "",
        },
      },
      { timestamps: true }
    )
  );
  return User;
};
