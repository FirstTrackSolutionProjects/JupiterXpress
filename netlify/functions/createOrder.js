const jwt = require("jsonwebtoken");
const mysql = require("mysql2/promise");
require("dotenv").config();

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

// Secret key for JWT
const SECRET_KEY = process.env.JWT_SECRET;

exports.handler = async (event) => {
  const token = event.headers.authorization;
  if (!token) {
    return {
      statusCode: 401,
      body: JSON.stringify({ message: "Access Denied" }),
    };
  }

  try {
    const verified = jwt.verify(token, SECRET_KEY);
    const id = verified.id;
    try {
      let {
        wid,
        order,
        date,
        payMode,
        name,
        email,
        phone,
        address,
        address2,
        addressType,
        addressType2,
        postcode,
        city,
        state,
        country,
        Baddress,
        Baddress2,
        BaddressType,
        BaddressType2,
        Bpostcode,
        Bcity,
        Bstate,
        Bcountry,
        same,
        orders,
        discount,
        cod,
        weight,
        length,
        breadth,
        height,
        gst,
        Cgst,
        shippingType
      } = JSON.parse(event.body);

      if (same) {
        Baddress = address;
        BaddressType = addressType;
        Baddress2 = address2;
        BaddressType2 = addressType2;
        Bcountry = country;
        Bstate = state;
        Bcity = city;
        Bpostcode = postcode;
      }

      const connection = await mysql.createConnection(dbConfig);

      try {
        await connection.beginTransaction();
        await connection.execute(
          `INSERT INTO SHIPMENTS (
  uid,
  ord_id,
  ord_date,
  pay_method,
  customer_name,
  customer_email,
  customer_mobile,
  shipping_address,
  shipping_address_type,
  shipping_address_2,
  shipping_address_type_2,
  shipping_country,
  shipping_state,
  shipping_city,
  shipping_postcode,
  billing_address,
  billing_address_type,
  billing_address_2,
  billing_address_type_2,
  billing_country,
  billing_state,
  billing_city,
  billing_postcode,
  cod_amount,
  total_discount,
  length,
  breadth,
  height,
  weight,
  gst,
  customer_gst,
  wid,
  same,
  shipping_mode
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,  ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?, ?, ?, ?,?, ?)`,
          [
            id,
            order,
            date,
            payMode,
            name,
            email,
            phone,
            address,
            addressType,
            address2,
            addressType2,
            country,
            state,
            city,
            postcode,
            Baddress,
            BaddressType,
            Baddress2,
            BaddressType2,
            Bcountry,
            Bstate,
            Bcity,
            Bpostcode,
            cod,
            discount,
            length,
            breadth,
            height,
            weight,
            gst,
            Cgst,
            wid,
            same,
            shippingType
          ]
        );
        for (let i = 0; i < orders.length; i++) {
          await connection.execute(
            `INSERT INTO ORDERS VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
              order,
              orders[i].master_sku,
              orders[i].product_name,
              orders[i].product_quantity,
              orders[i].tax_in_percentage,
              orders[i].selling_price,
              orders[i].discount,
            ]
          );
        }
        await connection.commit();
        return {
          statusCode: 200,
          body: JSON.stringify({ success: true, message: "Details Submitted" }),
        };
      } catch (error) {
        return {
          statusCode: 500,
          body: JSON.stringify({
            message: error.message + id,
            orders: orders,
            error: error.message,
          }),
        };
      } finally {
        await connection.end();
      }
    } catch (err) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Something went wrong" }),
      };
    }
  } catch (err) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Invalid Token" }),
    };
  }
};
