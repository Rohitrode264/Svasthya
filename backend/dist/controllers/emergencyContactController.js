import prisma from "../prisma/client.js";
import { sos } from "../jobs/sosService.js";
export const createEmergencyContact = async (req, res) => {
    try {
        const { userId, name, phone, email, relation } = req.body;
        if (!userId || !name || (!phone || !email)) {
            return res.status(400).json({ message: "Please enter the required fields" });
        }
        const newContact = await prisma.emergencyContact.create({
            data: {
                userId,
                name,
                phone,
                email,
                relation
            }
        });
        res.status(201).json({
            newContact
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Internal server error."
        });
    }
};
export const deleteEmergencyContact = async (req, res) => {
    try {
        const { emergencyContactId } = req.params;
        if (!emergencyContactId) {
            return res.status(400).json({ message: "Please provide emergencyContactId." });
        }
        const response = await prisma.emergencyContact.delete({
            where: {
                id: emergencyContactId
            }
        });
        res.status(200).json({
            message: "contact deleted successfully"
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Internal server error."
        });
    }
};
export const sosSender = async (req, res) => {
    try {
        const { userId, message } = req.body;
        const users = await prisma.emergencyContact.findMany({
            where: {
                userId: userId
            }
        });
        const emails = users.map(user => user.email);
        await sos(emails, message);
        res.status(200).json({ message: "Email sent." });
    }
    catch (err) {
        res.status(500).json({ message: "Internal Server Error." });
    }
};
export const getEmergencyContacts = async (req, res) => {
    try {
        const { userId } = req.params;
        if (!userId) {
            return res.status(400).json({
                message: "Please provide a valid userId.",
            });
        }
        const contacts = await prisma.emergencyContact.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" }, // most recent first
        });
        if (!contacts.length) {
            return res.status(200).json({
                message: "No emergency contacts found for this user.",
                contacts: [],
            });
        }
        return res.status(200).json({
            message: "Emergency contacts fetched successfully.",
            contacts,
        });
    }
    catch (error) {
        console.error("Error fetching emergency contacts:", error);
        return res.status(500).json({
            message: "Internal server error.",
        });
    }
};
//# sourceMappingURL=emergencyContactController.js.map