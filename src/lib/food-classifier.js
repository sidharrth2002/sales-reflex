import * as tf from "@tensorflow/tfjs";

export const nasi_lemak = {
  name: "Cookies",
  description:
    "Salted double-chocolate chip cookies with a chewy center and crisp edges, baked to perfection.",
};

const classnames = [
  {
    name: "Apple Pie",
    description:
      "We sell double-crusted, with pastry both above and below the filling; the upper crust may be solid or latticed (woven of crosswise strips). The bottom crust may be baked separately ('blind') to prevent it from getting soggy. This will be one of the signature comfort foods in our store",
  },
  {
    name: "Caesar Salad",
    description:
      "We sell salad on top of romaine lettuce and croutons dressed with lemon juice, olive oil, egg, Worcestershire sauce, anchovies, garlic, Dijon mustard, Parmesan cheese, and black pepper.",
  },
  {
    name: "Cheesecake",
    description:
      "We sell sweet dessert consisting of one or more layers. The main, and thickest, layer consists of a mixture of a soft, fresh cheese, eggs, and sugar.",
  },
  {
    name: "Chicken Curry",
    description:
      "We sell a dish originating from the Indian subcontinent. It is is lauded for its curries, mouth-burning spices and complex flavor pairings.",
  },
  {
    name: "Chicken Wings",
    description:
      "Cool and amazing unbreaded chicken wing section that is generally deep-fried and then coated or dipped in a sauce consisting of a vinegar-based cayenne pepper hot sauce and melted butter prior to serving.",
  },
  {
    name: "Chocolate Cake",
    description:
      "Started off with just melted chocolate, cocoa powder, or both to suit the perfect balance of appearance, texture and flavour. We sell various delicious chocolate cake to best cater customers' flavour.",
  },
  {
    name: "Doughnut",
    description:
      "Preassembled mixes of ingredients to prepare ring-shaped snack food popular in many countries. We customize over 10 different kind of flavour daily",
  },
  {
    name: "French Fries",
    description:
      "Side dish or snack typically made from deep-fried potatoes that have been cut into various shapes, especially thin strips. Fries are often salted and served with other items, including ketchup, mayonnaise, or vinegar.",
  },
  {
    name: "French Onion Soup",
    description:
      "Warm, cozy, and flavorful, this French onion soup is prepared with beef stock and caramelized onions",
  },
  {
    name: "Hot Dog",
    description:
      "A food consisting of a grilled or steamed sausage served in the slit of a partially sliced bun. The term hot dog can refer to the sausage itself. The sausage used is a wiener (Vienna sausage) or a frankfurter (Frankfurter Würstchen, also just called frank).",
  },
  {
    name: "Ice Cream",
    description:
      "Frozen dairy dessert obtained by freezing the ice cream mix with continuous agitation. It contains milk products, sweetening materials, stabilizers, colors, flavors, and egg products. Ice cream had its origins in Europe and was introduced later in the United States where it developed into an industry.",
  },
  {
    name: "Waffles",
    description:
      "A cake-like food made from leavened batter when it is poured between two hot, patterned plates. Waffles come in a variety of shapes and sizes and they are eaten all over the world. While traditionally served at breakfast, waffles can also work well as a snack or dessert.",
  },
];

let model;

export const loadModel = async (url) => {
  model = await tf.loadGraphModel(url);
  return model;
};

export const predict = async (image) => {
  try {
    let tensor = tf.browser
      .fromPixels(image)
      .resizeNearestNeighbor([224, 224])
      .toFloat()
      .expandDims(0);
    console.log("image", image);
    let pred_probs = await model.predict(tensor);
    pred_probs = pred_probs.dataSync();
    const pred = tf.tensor1d(pred_probs).argMax().dataSync()[0];
    console.log(pred_probs, pred);
    return classnames[pred];
  } catch (error) {
    console.log(error.message);
  }
};
