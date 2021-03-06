const fs = require('fs');
const path = require('path');

const p = path.join(
  path.dirname(process.mainModule.filename),
  'data',
  'cart.json'
)

class Cart {
  static async add(course) {
    const cart = await Cart.fetch();

    const indx = cart.courses.findIndex((c) => c.id == course.id);
    const candidate = cart.courses[indx];

    if (candidate) {
      candidate.count++;
      cart.courses[indx] = candidate;
    } else {
      course.count = 1;
      cart.courses.push(course);
    }

    cart.price += +course.price;
  
    return new Promise((resolve, reject) => {
      fs.writeFile(p, JSON.stringify(cart), 'utf-8', (err) => {
        if (err) reject(err);
        resolve();
      })
    });
  }

  static fetch() {
    return new Promise((resolve, reject) => {
      fs.readFile(p, 'utf-8', (err, content) => {
        if (err) throw reject(err);
        resolve(JSON.parse(content));
      })
    });
  }
}

module.exports = Cart;