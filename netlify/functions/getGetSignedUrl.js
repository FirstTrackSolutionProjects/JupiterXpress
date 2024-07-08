const AWS = require('aws-sdk');

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

exports.handler = async (event, context) => {
  const { key } = JSON.parse(event.body);
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: key,
    Expires: 60,
  };

  try {
    const downloadURL = await s3.getSignedUrlPromise('getObject', params);
    return {
      statusCode: 200,
      body: JSON.stringify({ downloadURL }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Could not generate signed URL' }),
    };
  }
};
