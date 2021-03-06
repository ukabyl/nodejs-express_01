const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

class Course {
  constructor(title, price, img) {
    this.title = title;
    this.price = price;
    this.img = img;
  }

  async save() {
    const courses = await Course.getAll();
    courses.push(this.toObject());
    
    return new Promise((resolve, reject) => {
      fs.writeFile(path.join(__dirname, '..', 'data', 'courses.json'), JSON.stringify(courses), (err) => {
        if (err) reject(err);
        resolve();
      });
    })
  }

  toObject() {
    return {
      title: this.title,
      price: this.price,
      img: this.img,
      id: uuidv4(),
      created: Date.now()
    }
  }

  static getAll() {
    return new Promise((resolve, reject) => {
      fs.readFile(path.join(__dirname, '..', 'data', 'courses.json'), 'utf-8', (err, content) => {
        if (err) reject(err);
        resolve(JSON.parse(content));
      });
    })
  }

  static async getById(id) {
    const courses = await Course.getAll();
      return courses.find(c => c.id === id);
  }

  static async update(course) {
    const courses = await Course.getAll();
    const indx = courses.findIndex((c) => c.id === course.id);

    courses[indx] = course;

    return new Promise((resolve, reject) => {
      fs.writeFile(path.join(__dirname, '..', 'data', 'courses.json'), JSON.stringify(courses), (err) => {
        if (err) reject(err);
        resolve();
      });
    })
  }
}

module.exports = Course;