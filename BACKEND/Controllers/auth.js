
const db = require("../Config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// ======================= SIGNUP CONTROLLER =======================
exports.signup = async (req, res) => {
  try {
    let { name, email, password, phone_number, address } = req.body;
    console.log("REQ BODY: ", req.body);
    // validation
    if (!name || !email || !password || !phone_number || !address) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    name = name.trim();
    email = email.trim();
    phone_number = phone_number.trim();
    address = address.trim();

    if (name.length > 50) {
      return res
        .status(400)
        .json({ success: false, message: "Name cannot exceed 50 characters" });
    }

    if (email.length > 60) {
      return res
        .status(400)
        .json({ success: false, message: "Email cannot exceed 60 characters" });
    }

    if (phone_number.length > 20) {
      return res.status(400).json({
        success: false,
        message: "Phone number cannot exceed 20 characters",
      });
    }
    const phoneRegx = /^[0-9]{10}$/;
    if (!phoneRegx.test(phone_number)) {
      return res.status(400).json({
        success: false,
        message: "Phone number must be exactly 10 digits",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    // check if user already exists
    const checkUserQuery =
      "SELECT * FROM users WHERE email = ? OR phone_number = ?";

    db.query(checkUserQuery, [email, phone_number], async (err, results) => {
      if (err) {
        console.error("Database error during check:", err);
        return res.status(500).json({
          message: "Database error",
        });
      }

      if (results.length > 0) {
        const existingUser = results[0];

        if (existingUser.email === email) {
          return res.status(400).json({
            message: "User already exists with this email",
          });
        }

        if (existingUser.phone_number === phone_number) {
          return res.status(400).json({
            message: "User already exist with this phone_number",
          });
        }
      }

      // hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // insert user
      const insertQuery =
        "INSERT INTO users (name, email, password, phone_number, address) VALUES (?, ?, ?, ?, ?)";

      db.query(
        insertQuery,
        [name, email, hashedPassword, phone_number, address],
        (err, result) => {
          if (err) {
            console.log("err", err);
            return res.status(500).json({
              message: "Error creating user",
              data: err.message,
            });
          }

          res.status(201).json({
            success: true,
            message: "User registered successfully",
          });
        },
      );
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// ======================= LOGIN CONTROLLER =======================
exports.login = (req, res) => {
  try {
    let { email, password } = req.body;

    // validation
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    email = email.trim().toLowerCase();

    const query = "SELECT * FROM users WHERE email = ?";

    db.query(query, [email], async (err, results) => {
      if (err) {
        console.log("DATABASE ERROR: ", err);
        return res.status(500).json({
          message: "Database error",
        });
      }

      if (results.length === 0) {
        return res.status(404).json({
          message: "Invalid emial or password",
        });
      }

      const user = results[0];

      // compare password
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(401).json({
          message: "Invalid password",
        });
      }

      if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is missing in environment variables");
      }

      // create JWT token
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1d" },
      );

      res.cookie("token", token, {
        httpOnly: true,
        secure: false,
      });

      res.status(200).json({
        success: true,
        message: "Login successful",
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// ======================= FORGOT PASSWORD =======================
exports.forgotPassword = (req, res) => {
  try {
    let { email } = req.body;

    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email is required" });
    }

    email = email.trim().toLowerCase();

    // Check if user exists
    db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
      if (err) return res.status(500).json({ message: "Database error" });

      if (results.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No account found with this email",
        });
      }

      // Generate a 6-digit OTP as reset token
      const resetToken = Math.floor(100000 + Math.random() * 900000).toString();
      const expiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

      db.query(
        "UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE email = ?",
        [resetToken, expiry, email],
        (err) => {
          if (err)
            return res
              .status(500)
              .json({ message: "Error saving reset token" });

          // LOG OTP to console (dev only — replace with email service in production)
          console.log(`[DEV ONLY] Reset OTP for ${email}: ${resetToken}`);

          return res.status(200).json({
            success: true,
            message: "OTP sent successfully. Check server console (dev mode).",
            // resetToken NOT exposed in response — use email service in production
          });
        },
      );
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ======================= RESET PASSWORD =======================
exports.resetPassword = async (req, res) => {
  try {
    const { email, resetToken, newPassword } = req.body;

    if (!email || !resetToken || !newPassword) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    db.query(
      "SELECT * FROM users WHERE email = ? AND reset_token = ?",
      [email.trim().toLowerCase(), resetToken],
      async (err, results) => {
        if (err) return res.status(500).json({ message: "Database error" });

        if (results.length === 0) {
          return res
            .status(400)
            .json({ success: false, message: "Invalid OTP" });
        }

        const user = results[0];

        // Check expiry
        if (new Date() > new Date(user.reset_token_expiry)) {
          return res.status(400).json({
            success: false,
            message: "OTP has expired. Please request again.",
          });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password and clear token
        db.query(
          "UPDATE users SET password = ?, reset_token = NULL, reset_token_expiry = NULL WHERE email = ?",
          [hashedPassword, email],
          (err) => {
            if (err)
              return res
                .status(500)
                .json({ message: "Error updating password" });

            return res.status(200).json({
              success: true,
              message: "Password reset successfully! Please login.",
            });
          },
        );
      },
    );
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.logout = (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "You are already logged out",
      });
    }
    res.cookie("token", "", {
      httpOnly: true,
      expires: new Date(0),
    });

    res.status(200).json({
      success: true,
      message: "Logout successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};