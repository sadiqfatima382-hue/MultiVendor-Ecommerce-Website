// export const validate = (schema) => {
//   return async (req, res, next) => {
//     try {
//       let data;

//       // Schema expects body/params/query wrapper
//       if (
//         schema.shape?.body ||
//         schema.shape?.params ||
//         schema.shape?.query
//       ) {
//         data = {
//           body: req.body,
//           params: req.params,
//           query: req.query,
//         };
//       }
//       //  schema (body only)
//       else {
//         data = req.body;
//       }
//       console.log(req.body);
// console.log(typeof req.body.type);
//       req.validatedData = await schema.parseAsync(data);

//       next();
//     } catch (error) {
//       return res.status(400).json({
//         success: false,
//         message: "Validation failed",
//         errors: error.issues,
//       });
//     }
//   };
// };

export const validate = (schema) => {
  return async (req, res, next) => {
    try {
      const data = {
        body: req.body,
        params: req.params,
        query: req.query,
      };

      const validatedData =
        await schema.parseAsync(data);

      req.validatedData = validatedData;

      next();

    } catch (error) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: error.issues,
      });
    }
  };
};