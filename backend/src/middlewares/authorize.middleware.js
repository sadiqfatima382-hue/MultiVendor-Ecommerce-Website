// export function authorize(...roles) {
//   return (req, res, next) => {
//     if (!req.user) {
//       return res.status(401).json({
//         success: false,
//         message: "Unauthorized",
//       });
//     }

//     const userRole = req.user.role?.name;

//     if (!roles.includes(userRole)) {
//       return res.status(403).json({
//         success: false,
//         message: "Forbidden. You don't have permission to access this resource.",
//       });
//     }

//     next();
//   };
// }

export function authorize(...roles) {
  return (req, res, next) => {
    console.log("Required Roles:", roles);
    console.log("User Role:", req.user.role?.name);

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const userRole = req.user.role?.name;

    if (!roles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: "Forbidden. You don't have permission to access this resource.",
      });
    }

    next();
  };
}