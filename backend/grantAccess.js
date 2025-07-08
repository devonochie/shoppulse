const Boom = require("boom");
const roles = require("./roles");


const grantAccess = (requiredPermissions) => {
    return (req, res, next) => {
        const userRole = req.user?.role; // `req.user` is populated after verifying the access token.

        if (!userRole) {
            return next(Boom.unauthorized("Role not assigned to user"));
        }

        const userPermissions = roles[userRole] || [];

        const hasPermission = requiredPermissions.every((permission) =>
            userPermissions.includes(permission)
        );

        if (!hasPermission) {
            return next(Boom.forbidden("You do not have the required permissions"));
        }

        next();
    };
};




module.exports = grantAccess;
