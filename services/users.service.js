const SecureAutoalias = require("../mixins/secureautoalias.mixin");
const DbService = require("../mixins/db.mixin");
const CacheCleaner = require("../mixins/cache.cleaner.mixin");
const C = require("../constants");
const UserType = require('./graphql/users.js');

module.exports = {
	name: "users",
	version: 1,
	mixins: [
		DbService("accounts"),
		CacheCleaner([
			"cache.clean.accounts"
		]),
		SecureAutoalias
	],
	settings: {
		graphql: {
			type: UserType.User
		},
	},

	actions: {

		list: {
			rest: "GET /",
			graphql: {
				query: "users(limit: Int, offset: Int, sort: String): [User]",
			},
			visibility: C.VISIBILITY_PUBLISHED,
      async handler(ctx) {
        return await this.adapter.find(ctx.params);
      }
		},
		create: {
			rest: "POST /",
			graphql: {
				mutation: "create(username: String, firstName: String, lastName: String, email: String): CreateUser",
				type: UserType.CreateUser
			},
      async handler(ctx) {
				const params = ctx.params;
        const user = {
					username: params.username,
					email: params.email
				}
				return user;
      }
		},
	}
};