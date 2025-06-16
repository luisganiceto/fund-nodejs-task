import fs from "fs";
import { parse } from "csv-parse";
import fetch from "node-fetch";

const csvFilePath = "./tasks.csv";

const stream = fs.createReadStream(csvFilePath);
const parser = parse({
  delimiter: ",",
  from_line: 2,
});

const lines = stream.pipe(parser);

for await (const line of lines) {
  const [title, description] = line;

  await fetch("http://localhost:3334/tasks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, description }),
  });
}
