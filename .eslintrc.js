module.exports = {
  "env": {
      "es2021": true,
      "browser": true,
      "commonjs": true,
      "node": true,
  },
  "extends": [
      "eslint:recommended",
      "airbnb-base:recomended"
  ],
  "rules": {
    "no-underscore-dangle": ["error", {"allow": ["_id"]}]
  }
}
