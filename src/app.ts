import express from "express";
import { prisma } from "../prisma/prisma-instance";
import { errorHandleMiddleware } from "./error-handler";
import "express-async-errors";
import {
  checkForInvalidKeys,
  checkKeysInObj,
  isDogPatchData,
} from "./helpers";

const app = express();
app.use(express.json());
// All code should go below this line

app.get("/", (_req, res) => {
  res.json({ message: "Hello World!" }).status(200); // the 'status' is unnecessary but wanted to show you how to define a status
});

//index
app.get("/dogs", async (req, res) => {
  const dogs = await prisma.dog.findMany();
  res.status(200).send(dogs);
});

//show
app.get("/dogs/:id", async (req, res) => {
  const id = +req.params.id;
  if (isNaN(id)) {
    return res
      .status(400)
      .send({ message: "id should be a number" });
  }
  const dog = await prisma.dog.findUnique({
    where: {
      id,
    },
  });
  if (dog === null) {
    return res
      .status(204)
      .send({ message: "Dog not found!" });
  }
  res.status(200).send(dog);
});

//create
app.post("/dogs", async (req, res) => {
  const dogInput = req.body;
  const errors: string[] = [];
  checkKeysInObj(
    ["name", "breed", "description"],
    "string",
    dogInput,
    errors
  );
  checkKeysInObj(["age"], "number", dogInput, errors);
  checkForInvalidKeys(
    ["age", "name", "breed", "description"],
    dogInput,
    errors
  );
  if (errors.length > 0) {
    return res.status(400).send({ errors: errors });
  }
  try {
    const dog = await prisma.dog.create({
      data: {
        ...dogInput,
      },
    });
    return res.status(201).send(dog);
  } catch (error) {
    return res
      .status(400)
      .send({ message: "dog not created" });
  }
});

//delete
app.delete("/dogs/:id", async (req, res) => {
  const id = +req.params.id;
  if (!Number.isInteger(id)) {
    return res
      .status(400)
      .send({ message: "id should be a number" });
  }
  const deletedDog = await Promise.resolve()
    .then(() => {
      return prisma.dog.delete({
        where: {
          id,
        },
      });
    })
    .catch(() => null);
  if (deletedDog === null) {
    return res
      .status(204)
      .send({ message: "dog not found" });
  }
  res.status(200).send(deletedDog);
});

//update
app.patch("/dogs/:id", async (req, res) => {
  const id = +req.params.id;
  const inputDog = req.body;
  const errors: string[] = [];
  checkForInvalidKeys(
    ["age", "name", "breed", "description"],
    inputDog,
    errors
  );
  if (errors.length > 0) {
    return res.status(400).send({ errors });
  }

  if (!isNaN(id) && isDogPatchData(inputDog)) {
    const dog = await Promise.resolve()
      .then(() => {
        return prisma.dog.update({
          data: {
            ...inputDog,
          },
          where: {
            id,
          },
        });
      })
      .catch(() => null);
    if (dog) {
      res.status(201).send(dog);
    } else {
      res.status(404).send({ message: "Dog not Found!" });
    }
  } else {
    res.status(400).send({ message: "Bad Input" });
  }
});

// all your code should go above this line
app.use(errorHandleMiddleware);

const port = process.env.NODE_ENV === "test" ? 3001 : 3000;
app.listen(port, () =>
  console.log(`
🚀 Server ready at: http://localhost:${port}
`)
);
