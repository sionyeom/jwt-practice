const db = require("../model/index.js");
const Tutorial = db.tutorial;

// Create document
exports.create = async (req, res) => {
  // Validate request
  if (!req.body.title) {
    res.status(400).send({
      message: "Title is empty!",
    });

    return;
  }

  let { title, description } = req.body;

  try {
    const tutorial = await new Tutorial({
      title: title,
      description: description,
      published: req.body.published ? req.body.published : false,
    });

    await tutorial
      .save()
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || "Create document failure.",
        });
      });
  } catch {
    res.status(500).send({
      message: "Create document failure.",
    });
  }
};

// Retrieve all documents
exports.findAll = (req, res) => {
  const title = req.query.title;
  const condition = title
    ? { title: { $regex: new RegExp(title), $options: "i" } }
    : {};

  // Retrieve all documents
  Tutorial.find(condition)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Retrieve document failure.",
      });
    });
};

// Retrieve single document
exports.findOne = (req, res) => {
  const id = req.params.id;

  // Retrieve single document by id
  Tutorial.findById(id)
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: "Cannot find document. (id: " + id + ")",
        });
      } else {
        res.send(data);
      }
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Retrieve single document failure. (id: " + id + ")",
      });
    });
};

// Update document by id
exports.update = async (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data is empty!",
    });
  }
  const updates = Object.keys(req.body);
  const allowed = ["title", "description"];
  const isValid = updates.every((update) => allowed.includes(update));

  if (!isValid) {
    return res.status(400).send({ error: "Invalid Updates." });
  }
  try {
    const tutorial = await Tutorial.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!tutorial) res.status(404).send();

    res.send(tutorial);
  } catch (er) {
    res.status(400).send();
  }
};

// Delete document by id
exports.delete = async (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data is empty!",
    });
  }

  // Set id
  const id = req.params.id;

  try {
    const tutorial = await Tutorial.findByIdAndDelete(id);
    if (!tutorial) res.status(404).send();
    res.send(tutorial);
  } catch (err) {
    res.status(500).send();
  }
};
