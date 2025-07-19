// /user/me
router.get("/me", verifyToken, (req, res) => {
  res.status(200).json({
    email: req.user.email,
    role: req.user.role,
  });
});
