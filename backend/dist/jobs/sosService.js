import { sendMail } from "../notifications/emailService.js";
export const sos = async (sos, message) => {
    if (message.length === 0) {
        message = "Emergency call";
    }
    for (let i = 0; i < sos.length; i++) {
        await sendMail(sos[i] || "", "Emergency", message, "CareAlert");
    }
};
//# sourceMappingURL=sosService.js.map