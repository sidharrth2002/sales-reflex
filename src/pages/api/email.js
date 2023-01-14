const mail = require("@sendgrid/mail");

mail.setApiKey(process.env.SENDGRID_API_KEY);

async function emailBusinessOwner(req, res) {
  /*
        Expects a `name` and `mobileNumber` in the request body as a JSON object.
        Also expects a storeOwner ID - but currently is hardcoded.
    */
  // req body contains business owner store number

  const body = JSON.parse(req.body);
  const storeOwnerEmail = "ashrielbrian@yahoo.com"; // hardcoded for now

  console.log("Potential customer: ", body);

  const message = `
        👋 A potential customer has come knocking on your door!
        <br>
        🧍 Name: <strong>${body.name}</strong>
        <br>
        ☎️ Mobile Number: <strong>${body.mobileNumber}</strong>
        <br>
        <br>
        Courtesy of,
        <i>SalesReflex</i> 🎆
    `;

  mail
    .send({
      to: storeOwnerEmail,
      from: "ashrielbrian@gmail.com", // sales-reflex
      subject: "You have a new potential customer!",
      // text: message,
      html: message.replace(/rn/g, "<br>"),
    })
    .then(() => {
      console.log("SENT!");
      return res.status(200).json({ status: "OK" });
    })
    .catch((err) => {
      console.log(err);
    });
}

export default emailBusinessOwner;
