'use strict'

const uuidv4 = require('uuid/v4')
const AWS = require('aws-sdk')
AWS.config.update({ region: process.env.AWS_REGION || 'us-east-1' })
const s3 = new AWS.S3()

exports.handler = async (event) => {
  return await getUploadURL()
}

const getUploadURL = async function() {
  const actionId = uuidv4()
  
  const s3Params = {
    Bucket: process.env.UPLOAD_BUCKET_NAME,
    Key:  `${actionId}.pdf`,
    ContentType: 'application/pdf', 
    ACL: 'authenticated-read',
    Expires: 60*10
  }
  
  return new Promise((resolve, reject) => {
    resolve({
      "statusCode": 200,
      "isBase64Encoded": false,
      "headers": {
        "Access-Control-Allow-Origin": "*"
      },
      "body": JSON.stringify({
          "uploadURL": s3.getSignedUrl('putObject', s3Params),
          "pdfFilename": `${actionId}.pdf`
      })
    })
  })
}
