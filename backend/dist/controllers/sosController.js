import prisma from "../prisma/client.js";
export const createSos = async (req, res) => {
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
export const deleteSos = async (req, res) => {
    try {
        const { emergencyContactId } = req.body;
        if (!emergencyContactId) {
            return res.status(400).json({ message: "Please provide emergencyContactId." });
        }
        await prisma.emergencyContact.delete({
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
//# sourceMappingURL=sosController.js.map