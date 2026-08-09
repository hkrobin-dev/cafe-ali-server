// Wraps a Zod schema so { body, params, query } are validated together.
// Usage: router.post('/', validate(createItemSchema), controller)
export const validate = (schema) => (req, _res, next) => {
  try {
    const parsed = schema.parse({
      body: req.body,
      params: req.params,
      query: req.query,
    });
    req.body = parsed.body ?? req.body;
    next();
  } catch (err) {
    next(err); // handled by centralized ZodError branch in error.middleware.js
  }
};

export default validate;
