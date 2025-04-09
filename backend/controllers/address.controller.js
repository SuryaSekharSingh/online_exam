import {pool} from '../config/db.js';
import { Address } from '../models/address.model.js';

export const createAddress = async (req, res) => {
    try {
        const { street, city, state, country, pincode, studentId, teacherId } = req.body;
        
        await pool.query(
            `INSERT INTO ${Address.table} 
            (${Address.columns.STREET},
             ${Address.columns.CITY},
             ${Address.columns.STATE},
             ${Address.columns.COUNTRY},
             ${Address.columns.PINCODE},
             ${Address.columns.STUDENT_ID},
             ${Address.columns.TEACHER_ID})
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [street, city, state, country, pincode, studentId, teacherId]
        );
        
        res.status(201).json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getAddress = async (req, res) => {
    try {
        const [addresses] = await pool.query(
            `SELECT * FROM address 
             WHERE address_id = ?`,
            [req.params.id]
        );
        
        if (addresses.length === 0) {
            return res.status(404).json({ error: "Address not found" });
        }
        
        res.json(addresses[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateAddress = async (req, res) => {
    try {
        const { street, city, state, country, pincode } = req.body;
        
        if (!street && !city && !state && !country && !pincode) {
            return res.status(400).json({ error: "No fields to update" });
        }

        const [result] = await pool.query(
            `UPDATE address SET ?
             WHERE address_id = ?`,
            [{ street, city, state, country, pincode }, req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Address not found" });
        }

        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};