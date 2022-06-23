const dotenv = require("dotenv")
let ENV_FILE_NAME = ""
switch (process.env.NODE_ENV) {
  case "prod":
    ENV_FILE_NAME = ".env"
    break
  case "test":
    ENV_FILE_NAME = ".env.test"
    break
  default:
    ENV_FILE_NAME = ".env"
    break
}

dotenv.config({ path: process.cwd() + "/" + ENV_FILE_NAME })
// CORS when consuming Medusa from admin
const ADMIN_CORS = process.env.ADMIN_CORS

// CORS to avoid issues when consuming Medusa from a client
const STORE_CORS = process.env.STORE_CORS

// Database URL (here we use a local database called medusa-development)
const DATABASE_URL = process.env.DATABASE_URL

// Medusa uses Redis, so this needs configuration as well
const REDIS_URL = process.env.REDIS_URL

// Stripe keys
const STRIPE_API_KEY = process.env.STRIPE_API_KEY
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET

const ACCESS_KEY_ID = process.env.ACCESS_KEY_ID
const SECRET_ACCESS_KEY = process.env.SECRET_ACCESS_KEY

// This is the place to include plugins. See API documentation for a thorough guide on plugins.
const plugins = [
  `medusa-fulfillment-manual`,
  `medusa-payment-manual`,
  {
    resolve: `medusa-file-s3`,
    options: {
      s3_url: "https://jamobrand-medusa.s3.ap-south-1.amazonaws.com",
      bucket: "jamobrand-medusa",
      region: "ap-south-1",
      access_key_id: ACCESS_KEY_ID,
      secret_access_key: SECRET_ACCESS_KEY,
    },
  },
  {
    resolve: `medusa-plugin-meilisearch`,
    options: {
      config: {
        host: process.env.MEILISEARCH_HOST,
        apiKey: process.env.MEILISEARCH_API_KEY,
      },
      settings: {
        products: {
          searchableAttributes: ["title", "description", "variant_sku"],
          displayedAttributes: ["title", "description", "variant_sku"],
        },
      },
    },
  },
  {
    resolve: `medusa-plugin-sendgrid`,
    options: {
      api_key: process.env.SENDGRID_API_KEY,
      from: process.env.SENDGRID_FROM,
      order_placed_template: "d-1dca7bd98f464598aafbdcb5e312d1df",
    },
  },
  {
    resolve: `medusa-plugin-slack-notification`,
    options: {
      show_discount_code: false,
      slack_url: process.env.SLACK_WEBHOOK_URL,
      admin_orders_url: process.env.ADMIN_ORDERS_URL,
    },
  },
  // Uncomment to add Stripe support.
  // You can create a Stripe account via: https://stripe.com
  // {
  //   resolve: `medusa-payment-stripe`,
  //   options: {
  //     api_key: STRIPE_API_KEY,
  //     webhook_secret: STRIPE_WEBHOOK_SECRET,
  //   },
  // },
]

module.exports = {
  projectConfig: {
    redis_url: REDIS_URL,
    // For more production-like environment install PostgresQL
    database_url: DATABASE_URL,
    database_type: "postgres",
    // database_database: "./medusa-db.sql",
    // database_type: "sqlite",
    store_cors: STORE_CORS,
    admin_cors: ADMIN_CORS,
    database_extra:
      process.env.NODE_ENV !== "development"
        ? { ssl: { rejectUnauthorized: false } }
        : {},
  },
  plugins,
}
