
const startupDebugger = require('debug')('app:startup'); 

const dbDebugger = require('debug')('app:db'); 
const config =require('config');


const helmet = require("helmet");
const morgan = require("morgan");
const Joi = require("joi");

const logger = require("./logger");

const express = require("express");
const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(helmet());

//Configurations 

console.log('Application Name: ' + config.get('name'));

console.log('Mail Server: ' + config.get('mail.host'));

if(app.get('env') === 'development') {
  app.use(morgan("tiny"));
  startupDebugger ('Morgan enable....');
}





app.use(logger);

const courses = [
  { id: 1, name: "course1" },
  { id: 2, name: "course2" },
  { id: 3, name: "course3" },
];
app.get("/", function (req, res) {
  res.send("<h1>Hello, World!</h1>");
});

app.get("/api/courses", (req, res) => {
  res.send(courses);
});

app.post("/api/courses", (req, res) => {
  const { error } = validateCourse(req.body);
  if (error) {
    //400 Bad req

    res.status(400).send(result.error.details[0].message);

    return;
  }
  const course = {
    id: courses.length + 1,
    name: req.body.name,
  };
  courses.push(course);

  res.send(course);
});

app.put("/api/courses/:id", (req, res) => {
  //Look up the course
  //if not exit. return 404
  //validate
  //if invalid , return 40-bad req
  //update courses
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course)
    return res.status(404).send("The course with the given ID was not found");

  const { error } = validateCourse(req.body);
  if (error) return;

  //400 Bad req

  res.status(400).send(result.error.details[0].message);

  return;

  course.name = req.body.name;
  res.send(course);
});

function validateCourse(course) {
  const schema = {
    name: Joi.string().min(3).required(),
  };
  return Joi.validate(course, schema);
}

app.delete("/api/courses/:id", (req, res) => {
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course)
    return res.status(404).send("The course with the given ID was not found");

  const index = courses.indexOf(course);

  courses.splice(index, 1);
  res.send(course);
});

app.get("/api/courses/:id", (req, res) => {
  const course = courses.find((c) => c.id === parseInt(req.params.id));

  if (!course)
    res.status(404).send("The course with the given ID was not found");

  res.send(course);
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
