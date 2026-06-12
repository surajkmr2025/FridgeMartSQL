const db = require('../Config/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

exports.getUserProfile = (req, res) => {
    const userId = req.user.id;
    console.log('USER ID:', userId);

    const query = `
        SELECT id, name, email, phone_number, address
        FROM users
        WHERE id = ?
    `;

    db.query(query, [userId], (err, results) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: "Error fetching user",
                error: err.message,
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        return res.status(200).json({
            success: true,
            user: results[0],
        });
    });
};

exports.updateUserProfile = (req, res) => {
    const userId = req.user.id;
    console.log('USER ID:',userId);

    const {name, phone_number, address} = req.body;

    if(!name || !phone_number || !address){
        return res.status(400).json({
            success: false,
            message: "All fields are required",
        });
    }
                                    
    const updateUser = 'UPDATE users SET name = ?, phone_number = ?, address = ? WHERE id = ?';
    db.query(updateUser, [name, phone_number, address, userId], (err, result) => {
        if(err){
            return res.status(500).json({
                success: false,
                message: "Error updating profile",
                error: err.message,
            });
        }

        if(result.changedRows === 0) {
            return res.status(200).json({
                message: "No changes made",
            })
        }
        res.status(200).json({
            success: true,
            data: result,
        });
    })
}

exports.updatePassword = async (req, res) => {
    try{
        const userId = req.user.id;
        console.log('USER ID: ', userId);

        const {oldPassword, confirmPassword, newPassword} = req.body;
        console.log("REQ BODY: ", req.body);

        if(!oldPassword || !confirmPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const getUserQuery = "SELECT * FROM users WHERE id = ?";

        db.query(getUserQuery, [userId], async (err, results) => {
            if(err){
                return res.status(500).json({
                    success: false,
                    message: "Error occured while changing password",
                });
            }

            if(results.length === 0){
                return res.status(404).json({
                    success: false,
                    message: "User not found",
                });
            }

            const user = results[0];

            const isMatch = await bcrypt.compare(oldPassword, user.password);
            console.log('IS MATCH: ', isMatch);

            if(!isMatch) {
                return res.status(401).json({
                    success: false,
                    message: "Old password is incorrect",
                });
            }

            if(oldPassword === newPassword) {
                return res.status(400).json({
                    success: false,
                    message: "Old password and new password can not be same",
                });
            }

            if(confirmPassword !== newPassword){
                return res.status(400).json({
                    success: false,
                    message: "Confirm password and newPassword do not match",
                });
            }

            const hashedPassword = await bcrypt.hash(newPassword, 10);
            console.log('HASHED PASSWORD: ', hashedPassword);
            
            const updateQuery = `UPDATE users SET password = ? WHERE id=?`;

            db.query(updateQuery, [hashedPassword, userId], (err, result) => {
                if(err){
                    return res.status(500).json({
                        success: false,
                        message: "Password update failed",
                    });
                }
                res.status(200).json({
                    success: true,
                    message: "Password updated successfully",
                });
            })
            
        })

    }
    catch(error){
        return res.status(500).json({
            message: "Internal server error",
            error : error.message,
        })
    }
}

exports.getAllUsers = (req, res) => {
    try{
        const getUsersQuery = "SELECT id, name, email, phone_number, address, role FROM users";
        db.query(getUsersQuery, (err, users) => {
            if(err){
                return res.status(500).json(err);
            }
            
            return res.status(200).json({
                success: true,
                data: users,
            });
        })
    }
    catch(error){
        res.status(500).json({
            success: false,
            message: "Internal server error",
        })
    }
}
