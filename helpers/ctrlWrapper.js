const ctrlwrapper = (ctrl) => {
  const wrapper = async (req, res, next) => {
    try {
      await ctrl(req, res, next);
    } catch (error) {
      next(error);
    }
  };
  return wrapper;
};

export default ctrlwrapper;